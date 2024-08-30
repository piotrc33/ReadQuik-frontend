import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  computed,
  inject,
  viewChild,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Observable, combineLatest, filter, map, merge, scan } from 'rxjs';
import { AutoExerciseBase } from '../../model/auto-exercise-base';
import { TextService } from '../../services/text.service';

@Component({
  selector: 'exercise4',
  templateUrl: './exercise4.component.html',
  styleUrls: ['./exercise4.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Exercise4Component extends AutoExerciseBase implements OnInit {
  readonly textService = inject(TextService);
  readonly wordIndexes = this.phrasesWithNewlines()
    .map((phrase, i) => {
      return !this.textService.isNewline(phrase) ? i : undefined;
    })
    .filter((el) => el !== undefined);

  private readonly activeElement = viewChild<ElementRef>('activePhrase');
  readonly #activeBox = computed(() => {
    return this.activeElement()?.nativeElement.getBoundingClientRect();
  });

  private readonly nextPage$: Observable<boolean> = combineLatest([
    toObservable(this.#activeBox),
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
