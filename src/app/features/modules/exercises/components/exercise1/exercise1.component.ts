import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'exercise1',
  templateUrl: './exercise1.component.html',
  styleUrls: ['./exercise1.component.scss'],
})
export class Exercise1Component implements OnInit {
  phraseNumber: number = 0;

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

  phrasesArray: string[] = [];

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === ' ') {
      this.nextFragment();
    }
  }

  constructor() {}

  ngOnInit(): void {}

  nextFragment() {
    this.phraseNumber++;
  }
}
