import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  Signal,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, merge, scan } from 'rxjs';
import { AutoExerciseBase } from '../../model/auto-exercise-base';

@Component({
  selector: 'exercise2',
  templateUrl: './exercise2.component.html',
  styleUrls: ['./exercise2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Exercise2Component extends AutoExerciseBase implements OnInit {
  private readonly el = inject(ElementRef);

  private readonly START_OFFSET = 230;

  private readonly phraseWidth$ = this.flowService.movedToNextPhrase$.pipe(
    map(() => {
      const activeElement = this.el.nativeElement.querySelector('.active');
      return activeElement ? activeElement.offsetWidth : 0;
    })
  );

  readonly leftOffset: Signal<number> = toSignal(
    merge(
      this.phraseWidth$,
      this.flowService.completedAutoMode$.pipe(map(() => 0))
    ).pipe(
      scan((offset, phraseWidth) => {
        if (phraseWidth === 0) return this.START_OFFSET;
        return offset - phraseWidth;
      }, this.START_OFFSET)
    ),
    { initialValue: this.START_OFFSET }
  );
}
