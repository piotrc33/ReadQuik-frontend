import { BookDataI } from './library/book-data.i';
import { SegmentI } from './segment.i';
import { SingleProgressI } from './progress/single-progress.i';

export interface ReadingDataI {
  exercisesProgress: SingleProgressI[];
  bookData: BookDataI;
  segment: SegmentI;
}
