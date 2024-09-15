import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  computed,
  viewChild
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Observable, combineLatest, filter, map, merge, scan } from 'rxjs';
import { AutoExerciseBase } from '../../model/auto-exercise-base';
import { TextUtils } from 'src/app/utils/text.utils';

@Component({
  selector: 'exercise4',
  templateUrl: './exercise4.component.html',
  styleUrls: ['./exercise4.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Exercise4Component extends AutoExerciseBase implements OnInit {
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
    filter(nextPage => nextPage === true)
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

  isNewline(phrase: string) {
    return TextUtils.isNewline(phrase);
  }
}
