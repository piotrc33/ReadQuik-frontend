import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { BookService } from '../../../library/services/book.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {

  constructor(
    public readonly authService: AuthService,
    private router: Router,
    readonly bookService: BookService
  ) {
    // Get last read book here!
    bookService.chooseBook(bookService.currentBookId());
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
