import { Injectable, Signal, WritableSignal, computed, signal } from '@angular/core';
import { BookDataI } from 'src/app/api/model/library/book-data.i';
import { ReadingDataI } from 'src/app/api/model/reading-data.i';

@Injectable({
  providedIn: 'root',
})
export class ReadingDataStateService {
  readonly #readingData: WritableSignal<ReadingDataI | null> = signal(null);
  readonly bookData: Signal<BookDataI | undefined> = computed(
    () => this.readingData()?.bookData
  );

  readonly currentBookId: Signal<string> = computed(() => {
    return this.bookData()?._id ?? '';
  });

  readonly segmentText: Signal<string> = computed(
    () => this.readingData()?.segment.text ?? ''
  );

  readonly segmentNumber: Signal<number> = computed(
    () => this.readingData()?.segment.number ?? 1
  );

  readonly readingData = this.#readingData.asReadonly();

  updateReadingData(newReadingData: ReadingDataI) {
    this.#readingData.set(newReadingData);
  }
}
