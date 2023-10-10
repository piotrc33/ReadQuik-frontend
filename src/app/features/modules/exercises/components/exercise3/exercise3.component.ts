import {
  AfterViewChecked,
  Component,
  ElementRef,
  HostListener,
} from '@angular/core';

@Component({
  selector: 'exercise3',
  templateUrl: './exercise3.component.html',
  styleUrls: ['./exercise3.component.scss'],
})
export class Exercise3Component implements AfterViewChecked {
  phraseNumber: number = 0;
  leftOffset: number = 180;
  phraseWidth?: number;

  bookFragments: string[] = [
    'Miriamowi',
    '(Zenonowi Przesmyckiemu)',
    'I',
    '— Niech będzie pochwalony',
    'Jezus Chrystus!',
    '— Na wieki wieków,',
    '—moja Agato,',
    'a dokąd to wędrujecie, co?',
  ];

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === ' ') {
      this.start();
    }
  }

  constructor(private el: ElementRef) {}

  ngAfterViewChecked(): void {
    const activeElement = this.el.nativeElement.querySelector('.active');
    this.phraseWidth = activeElement.offsetWidth;
  }

  start(): void {
    setTimeout(() => this.nextFragment(), 500);
  }

  getTimeoutMs(phraseLength: number, wpm: number): number {
    const lettersPerSecond = wpm * 5.6 / 60;
    return phraseLength / lettersPerSecond * 1000;
  }

  nextFragment(): void {
    this.phraseNumber++;
    this.leftOffset -= this.phraseWidth!;
    if (this.phraseNumber === this.bookFragments.length) {
      this.phraseNumber = 0;
      this.leftOffset = 180;
    } else {
      setTimeout(
        () => this.nextFragment(),
        this.getTimeoutMs(this.bookFragments[this.phraseNumber].length, 200)
      );
      }
  }
}
