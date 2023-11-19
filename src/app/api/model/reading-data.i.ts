import { BookDataI } from './book-data.i';
import { SegmentI } from './segment.i';

export interface ReadingDataI {
  bookData: BookDataI;
  segment: SegmentI;
}
