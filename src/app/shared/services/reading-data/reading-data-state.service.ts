import { Injectable, WritableSignal, signal } from '@angular/core';
import { ReadingData } from 'src/app/api/model/reading-data.i';

@Injectable({
  providedIn: 'root',
})
export class ReadingDataStateService {
  readonly #initialState: ReadingData = {
    bookData: {
      _id: '',
      author: '',
      coverUrl: '',
      language: 'Polish',
      tags: [],
      title: '',
      totalSegments: 0,
    },
    exercisesProgress: [],
    segment: {
      number: 1,
      text: '',
    },
  };

  readonly #readingData: WritableSignal<ReadingData> = signal(
    this.#initialState
  );

  readonly readingData = this.#readingData.asReadonly();

  updateReadingData(newReadingData: ReadingData) {
    this.#readingData.set(newReadingData);
  }
}
