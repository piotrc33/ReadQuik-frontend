import { ChangeDetectionStrategy, Component, ElementRef, OnInit, signal } from '@angular/core';
import { AutoExerciseBase } from '../../model/auto-exercise-base';

@Component({
  selector: 'exercise2',
  templateUrl: './exercise2.component.html',
  styleUrls: ['./exercise2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Exercise2Component
  extends AutoExerciseBase
  implements 
  OnInit
{
  leftOffset: number = 50;
  leftOffsetSignal = signal(50);
  phraseWidth?: number;

  constructor(private readonly el: ElementRef) {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.leftOffset = this.getDefaultOffset('.exercise2');
    this.leftOffsetSignal.set(this.getDefaultOffset('.exercise2'));
  }

  override handleAutoNextFragment(): void {
    this.updatePhraseWidth();

    super.handleAutoNextFragment();
    this.leftOffset -= this.phraseWidth!;
    this.leftOffsetSignal.update(val => val - this.phraseWidth!);
  }

  override handleNextFragment(): void {
    this.updatePhraseWidth();
    
    if (this.state.exerciseMode === 'manual') {
      super.handleNextFragment();
      this.leftOffset -= this.phraseWidth!;
      this.leftOffsetSignal.update((val) => val - this.phraseWidth!);
    }
  }

  override reset(): void {
    super.reset();
    this.leftOffset = this.getDefaultOffset('.exercise2');
    this.leftOffsetSignal.set(this.getDefaultOffset('.exercise2'));
  }

  getDefaultOffset(selector: string): number {
    const container = this.el.nativeElement.querySelector(selector);
    return container.offsetWidth / 2 - 75;
  }

  updatePhraseWidth() {
    const activeElement = this.el.nativeElement.querySelector('.active');
    this.phraseWidth = activeElement.offsetWidth;
  }
}
