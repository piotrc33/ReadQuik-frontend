import { Component } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  dropdownOpened: boolean = false;
  username = ''

  constructor(public authService: AuthService) {
    this.username = this.authService.getUsername();
  }

  handleDropdown() {
    this.dropdownOpened = !this.dropdownOpened;
  }
}
