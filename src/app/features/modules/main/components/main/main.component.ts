import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {

  constructor(
    public readonly authService: AuthService,
    private router: Router,
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
