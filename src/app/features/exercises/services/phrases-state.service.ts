import { Injectable, Signal, computed, inject } from '@angular/core';
import { ReadingDataFacade } from 'src/app/shared/services/reading-data/reading-data.facade';
import { TextUtils } from 'src/app/utils/text.utils';

@Injectable({
  providedIn: 'root',
})
export class PhrasesStateService {
  readonly #readingDataFacade = inject(ReadingDataFacade);

  readonly maxWordsPerFragment = 4;
  readonly phrasesWithNewlines: Signal<string[]> = computed(() => {
    return TextUtils.getFragmentsWithNewlines(
      this.#readingDataFacade.segmentText(),
      this.maxWordsPerFragment
    );
  });

  readonly wordPhrases: Signal<string[]> = computed(() =>
    TextUtils.removeNewlines(this.phrasesWithNewlines())
  );
}
