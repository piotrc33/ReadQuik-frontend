import { Component, OnDestroy, inject } from '@angular/core';
import { SubscriptionContainer } from 'src/app/utils/subscription-container';
import { ExerciseFlowService } from '../services/exercise-flow.service';
import { ExercisesStateService } from '../services/exercises-state.service';
import { PhrasesStateService } from '../services/phrases-state.service';

@Component({
  selector: 'app-exercise',
  template: '',
})
export class Exercise implements OnDestroy {
  public readonly state = inject(ExercisesStateService);
  protected readonly flowService = inject(ExerciseFlowService);
  readonly #phrasesService = inject(PhrasesStateService);
  subs = new SubscriptionContainer();

  protected readonly wordPhrases = this.#phrasesService.wordPhrases;
  protected readonly phrasesWithNewlines =
    this.#phrasesService.phrasesWithNewlines;

  ngOnDestroy(): void {
    this.subs.dispose();
  }
}
