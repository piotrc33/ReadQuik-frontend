import { ChangeDetectionStrategy, Component, WritableSignal, inject, signal } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { flags } from 'src/app/shared/misc/flags';
import { AvailableLanguages } from 'src/app/shared/types/available-languages.t';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  private readonly loco = inject(TranslocoService);
  public readonly authService = inject(AuthService);

  dropdownOpened: WritableSignal<boolean> = signal(false);
  username = this.authService.getUsername();

  flagList = signal(flags);

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
