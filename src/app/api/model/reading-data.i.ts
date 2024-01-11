import { BookDataI } from './book-data.i';
import { SegmentI } from './segment.i';
import { SingleProgressI } from './single-progress.i';

export interface ReadingDataI {
  exercisesProgress: SingleProgressI[];
  bookData: BookDataI;
  segment: SegmentI;
}
