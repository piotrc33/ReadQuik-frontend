import { Injectable, WritableSignal, signal } from '@angular/core';
import { ReadingDataI } from 'src/app/api/model/reading-data.i';

@Injectable({
  providedIn: 'root',
})
export class ReadingDataStateService {
  readonly #readingData: WritableSignal<ReadingDataI | null> = signal(null);

  updateReadingData(newReadingData: ReadingDataI) {
    this.#readingData.set(newReadingData);
  }

  get readingData() {
    return this.#readingData.asReadonly();
  }
}
