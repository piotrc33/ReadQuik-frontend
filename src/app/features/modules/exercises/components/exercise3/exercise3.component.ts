import {
  AfterViewChecked,
  Component,
  ElementRef,
  HostListener,
} from '@angular/core';
import { TextService } from '../../services/text.service';
import { Exercise } from '../../model/exercise';
import { KeyboardService } from '../../services/keyboard.service';
import { ExerciseModeT } from '../../model/exercise-mode.type';

@Component({
  selector: 'exercise3',
  templateUrl: './exercise3.component.html',
  styleUrls: ['./exercise3.component.scss'],
})
export class Exercise3Component extends Exercise implements AfterViewChecked {
  leftOffset: number = 180;
  phraseWidth?: number;

  mode: ExerciseModeT = 'auto';
  started: boolean = false;

  constructor(
    private el: ElementRef,
    textService: TextService,
    keyService: KeyboardService
  ) {
    super(textService, keyService);
  }

  ngAfterViewChecked(): void {
    const activeElement = this.el.nativeElement.querySelector('.active');
    this.phraseWidth = activeElement.offsetWidth;
  }

  override handleForwardingKey(): void {
    if (!this.started && this.mode === 'auto') {
      this.start();
      this.started = true;
    }

    if (this.mode === 'manual') {
      this.nextFragment();
    }
  }

  start(): void {
    setTimeout(() => this.autoNextFragment(), 500);
  }

  getTimeoutMs(phraseLength: number, wpm: number): number {
    const lettersPerSecond = (wpm * 5.6) / 60;
    return (phraseLength / lettersPerSecond) * 1000;
  }

  autoNextFragment(): void {
    this.phraseNumber++;
    this.leftOffset -= this.phraseWidth!;
    if (this.phraseNumber === this.bookFragments.length) {
      this.phraseNumber = 0;
      this.leftOffset = 180;
      this.mode = 'manual';
    } else {
      setTimeout(
        () => this.autoNextFragment(),
        this.getTimeoutMs(this.bookFragments[this.phraseNumber].length, 200)
      );
    }
  }

  nextFragment() {
    this.phraseNumber++;
    this.leftOffset -= this.phraseWidth!;
    if (this.phraseNumber === this.bookFragments.length) {
      this.phraseNumber = 0;
      this.leftOffset = 180;
    }
  }
}
