import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { tap } from 'rxjs';
import { ReadingData } from 'src/app/api/model/reading-data.i';
import { ReadingDataApiService } from 'src/app/api/services/reading-data-api.service';
import { ReadingDataStateService } from 'src/app/shared/services/reading-data/reading-data-state.service';

export const readingDataResolver: ResolveFn<ReadingData> = () => {
  const readingDataApi = inject(ReadingDataApiService);
  const readingDataState = inject(ReadingDataStateService);
  const state = readingDataState.readingData();

  return state.bookData.title ? state : readingDataApi
    .getInitialReadingData()
    .pipe(
      tap((readingData) => readingDataState.updateReadingData(readingData))
    );
};
