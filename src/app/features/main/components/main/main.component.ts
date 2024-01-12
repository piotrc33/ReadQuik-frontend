import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { BookService } from '../../../library/services/book.service';
import { ExercisesStateService } from 'src/app/features/exercises/services/exercises-state.service';
import { ExercisesProgressStateService } from 'src/app/features/services/exercises-progress-state.service';

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
    readonly state: ExercisesStateService,
    readonly progressService: ExercisesProgressStateService
  ) {
    bookService.initialData$().subscribe((data) => {
      if (data) {
        bookService.readingData$.next(data);
        progressService.next(data.exercisesProgress);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
