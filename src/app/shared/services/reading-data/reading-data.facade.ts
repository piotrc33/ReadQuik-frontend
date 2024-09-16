import {
  Injectable,
  Signal,
  computed,
  inject
} from '@angular/core';
import { BookData } from 'src/app/api/model/library/book-data.i';
import { ReadingData } from 'src/app/api/model/reading-data.i';
import { ReadingDataStateService } from './reading-data-state.service';
import { ReadingDataService } from './reading-data.service';
import { SaveData } from 'src/app/api/model/save-data.model';

@Injectable({
  providedIn: 'root',
})
export class ReadingDataFacade {
  readonly #readingDataService = inject(ReadingDataService);
  readonly #readingDataState = inject(ReadingDataStateService);
  readonly #readingData = this.#readingDataState.readingData;

  readonly bookData: Signal<BookData> = computed(
    () => this.#readingData().bookData
  );

  readonly currentBookId: Signal<string> = computed(() => {
    return this.bookData()._id;
  });

  readonly segmentText: Signal<string> = computed(
    () => this.#readingData().segment.text
  );

  readonly segmentNumber: Signal<number> = computed(
    () => this.#readingData().segment.number
  );

  updateReadingData(newReadingData: ReadingData) {
    this.#readingDataState.updateReadingData(newReadingData);
  }

  getNextReadingData(saveData: SaveData) {
    this.#readingDataService.getNextReadingDataAction.next(saveData);
  }

  changeSegment(segmentNumber: number) {
    this.#readingDataService.changeSegmentAction.next(segmentNumber);
  }

  chooseBook(bookId: string) {
    this.#readingDataService.changeBookAction.next(bookId);
  }
}
