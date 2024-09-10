import { Component, OnDestroy, inject } from '@angular/core';
import { SubscriptionContainer } from 'src/app/utils/subscription-container';
import { ExerciseFlowService } from '../services/exercise-flow.service';
import { ExercisesStateService } from '../services/exercises-state.service';
import { PhrasesStateService } from '../services/phrases-state.service';
import { TextService } from '../services/text.service';
import { PercentBarService } from '../services/percent-bar.service';

@Component({
  selector: 'app-exercise',
  template: '',
})
export class Exercise implements OnDestroy {
  public readonly state = inject(ExercisesStateService);
  readonly flowService = inject(ExerciseFlowService);
  readonly #phrasesService = inject(PhrasesStateService);
  protected readonly textService = inject(TextService);
  protected readonly percentService = inject(PercentBarService);
  subs = new SubscriptionContainer();

  protected readonly wordPhrases = this.#phrasesService.wordPhrases;
  protected readonly phrasesWithNewlines =
    this.#phrasesService.phrasesWithNewlines;

  readonly wordIndexes = this.phrasesWithNewlines()
    .map((phrase, i) => {
      return !this.textService.isNewline(phrase) ? i : undefined;
    })
    .filter(el => el !== undefined);

  get phraseNumber() {
    return this.flowService.phraseNumber();
  }

  get exerciseMode() {
    return this.flowService.exerciseMode();
  }

  ngOnDestroy(): void {
    this.subs.dispose();
    this.percentService.paged.set(false);
    this.percentService.pagedPercent.set(0);
  }
}
