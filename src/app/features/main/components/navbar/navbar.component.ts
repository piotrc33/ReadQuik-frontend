import { Component, inject } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { flags } from 'src/app/shared/misc/flags';
import { AvailableLanguages } from 'src/app/shared/types/available-languages.t';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  readonly loco = inject(TranslocoService);
  readonly authService = inject(AuthService);

  dropdownOpened: boolean = false;
  username = this.authService.getUsername();

  get flags() {
    return flags;
  }

  handleDropdown() {
    this.dropdownOpened = !this.dropdownOpened;
  }

  changeLang(lang: AvailableLanguages) {
    switch (lang) {
      case 'Polish':
        this.loco.setActiveLang('pl');
        break;
      case 'English':
        this.loco.setActiveLang('en');
        break;
    }
  }
}
