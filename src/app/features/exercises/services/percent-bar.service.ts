import { Injectable, computed, inject, signal } from '@angular/core';
import { ExerciseFlowService } from './exercise-flow.service';
import { PhrasesStateService } from './phrases-state.service';

@Injectable()
export class PercentBarService {
  readonly #flowService = inject(ExerciseFlowService);
  readonly #phrasesService = inject(PhrasesStateService);

  readonly paged = signal(false);

  readonly progressPercent = computed(() => {
    return Math.round(
      (this.#flowService.phraseNumber() /
        this.#phrasesService.wordPhrases().length) *
        100
    );
  });

  pagedPercent = signal(0);
}
