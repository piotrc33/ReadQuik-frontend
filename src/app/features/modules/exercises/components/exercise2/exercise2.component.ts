import { AfterViewChecked, Component, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'exercise2',
  templateUrl: './exercise2.component.html',
  styleUrls: ['./exercise2.component.scss'],
})
export class Exercise2Component implements AfterViewChecked {
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
      this.nextFragment();
    }
  }

  constructor(private el: ElementRef) {}

  ngAfterViewChecked(): void {
    const activeElement = this.el.nativeElement.querySelector('.active');
    this.phraseWidth = activeElement.offsetWidth;
  }

  nextFragment() {
    this.phraseNumber++;
    this.leftOffset -= this.phraseWidth!;
    if(this.phraseNumber === this.bookFragments.length) {
      this.phraseNumber = 0;
      this.leftOffset = 180;
    }
  }  
}
