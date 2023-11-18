import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { BookService } from '../../../library/services/book.service';
import { switchMap, take, tap } from 'rxjs';
import { BookDataI } from 'src/app/api/model/book-data.i';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {

  constructor(
    public readonly authService: AuthService,
    private router: Router,
    readonly bookService: BookService,
  ) {
    console.log('main constructor run')
    bookService.initialData$().pipe(take(1)).subscribe(data => {
      bookService.currentBook$.next(data.bookData);
      bookService.currentSegment$.next(data.segment);
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
