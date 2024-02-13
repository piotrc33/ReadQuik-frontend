import { Injectable, computed, inject, signal } from '@angular/core';
import { ExerciseFlowService } from './exercise-flow.service';
import { BookService } from '../../library/services/book.service';

@Injectable()
export class PercentBarService {
  private readonly flowService = inject(ExerciseFlowService);
  private readonly bookService = inject(BookService);

  readonly paged = signal(false);

  readonly progressPercent = computed(() => {
    return Math.round(
      (this.flowService.phraseNumber() / this.bookService.wordPhrases().length) * 100
    );
  });

  pagedPercent = signal(0);
}
