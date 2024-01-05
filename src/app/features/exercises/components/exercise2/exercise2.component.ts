import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit
} from '@angular/core';
import { AutoExerciseBase } from '../../model/auto-exercise-base';

@Component({
  selector: 'exercise2',
  templateUrl: './exercise2.component.html',
  styleUrls: ['./exercise2.component.scss'],
})
export class Exercise2Component
  extends AutoExerciseBase
  implements AfterViewChecked, OnInit
{
  leftOffset: number = 50;
  phraseWidth?: number;

  constructor(
    private readonly el: ElementRef,
  ) {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.leftOffset = this.getDefaultOffset('.exercise2');
  }

  override handleAutoNextFragment(): void {
    super.handleAutoNextFragment();
    this.leftOffset -= this.phraseWidth!;
  }

  override handleNextFragment(): void {
    if (this.state.exerciseMode === 'manual') {
      super.handleNextFragment();
      this.leftOffset -= this.phraseWidth!;
    }
  }

  override reset(): void {
    super.reset();
    this.leftOffset = this.getDefaultOffset('.exercise2');
  }

  ngAfterViewChecked(): void {
    if (!this.state.finished) {
      const activeElement = this.el.nativeElement.querySelector('.active');
      this.phraseWidth = activeElement.offsetWidth;
    }
  }

  getDefaultOffset(selector: string): number {
    const container = this.el.nativeElement.querySelector(selector);
    return container.offsetWidth / 2 - 75;
  }
}
