import { Component } from '@angular/core';
import { ExercisesStateService } from 'src/app/features/exercises/services/exercises-state.service';
import { ExercisesProgressStateService } from 'src/app/services/exercises-progress-state.service';
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
}
