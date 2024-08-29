import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  inject,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  Observable,
  combineLatest,
  filter,
  map,
  merge,
  scan,
  switchMap,
  timer
} from 'rxjs';
import { AutoExerciseBase } from '../../model/auto-exercise-base';
import { TextService } from '../../services/text.service';

@Component({
  selector: 'exercise4',
  templateUrl: './exercise4.component.html',
  styleUrls: ['./exercise4.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Exercise4Component extends AutoExerciseBase implements OnInit {
  private readonly el = inject(ElementRef);
  readonly textService = inject(TextService);

  readonly wordIndexes: number[] = [];

  override ngOnInit(): void {
    super.ngOnInit();
    for (let i = 0; i < this.phrasesWithNewlines().length; i++) {
      if (
        !this.textService.isNewline(this.phrasesWithNewlines()[i])
      ) {
        this.wordIndexes.push(i);
      }
    }
  }

  private readonly activeBox$ = this.flowService.movedToNextPhrase$.pipe(
    switchMap(() => timer(2)),
    map(() =>
      this.el.nativeElement.querySelector('.active')?.getBoundingClientRect()
    ),
  );

  private readonly nextPage$: Observable<boolean> = combineLatest([
    this.activeBox$,
    toObservable(this.state.panelBox),
  ]).pipe(
    map(([activeBox, panelBox]) => {
      return activeBox?.y! > panelBox?.bottom!;
    }),
    filter((nextPage) => nextPage === true)
  );

  private readonly pageYPosition$ = merge(
    this.nextPage$.pipe(map(() => 1)),
    this.flowService.completedAutoMode$.pipe(map(() => 0))
  ).pipe(
    scan((position, val) => {
      if (val === 0) return 0;
      return position - this.state.panelBox()?.height!;
    }, 0)
  );
  readonly pageYPosition = toSignal(this.pageYPosition$, { initialValue: 0 });
}
