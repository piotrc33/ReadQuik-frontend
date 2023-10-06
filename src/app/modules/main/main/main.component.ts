import { Component, HostListener } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
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

  phrasesArray: string[] = []

  constructor(
    private readonly authService: AuthService,
    private router: Router
  ) {}

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === ' ') {
      this.nextFragment();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  nextFragment() {
    this.phraseNumber++;
  }
}
