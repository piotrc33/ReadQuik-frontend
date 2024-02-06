import { Component } from '@angular/core';
import { ExercisesProgressStateService } from 'src/app/services/exercises-progress-state.service';
import { BookService } from '../../../library/services/book.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  constructor(
    readonly bookService: BookService,
    readonly progressService: ExercisesProgressStateService
  ) {
    bookService.getInitialData().subscribe((data) => {
      if (data) {
        bookService.readingData.set(data);
        progressService.next(data.exercisesProgress);
      }
    });
  }
}
