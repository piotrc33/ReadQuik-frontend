import { BookData } from './library/book-data.i';
import { SegmentI } from './book/segment.i';
import { SingleProgressI } from './progress/single-progress.i';

export interface ReadingData {
  exercisesProgress: SingleProgressI[];
  bookData: BookData;
  segment: SegmentI;
}
