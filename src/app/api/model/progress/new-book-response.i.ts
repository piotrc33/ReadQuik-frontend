import { BookDataI } from "../library/book-data.i";
import { BookSegmentsI } from "../book-segments.i";

export interface NewBookResponseI {
  bookData: BookDataI;
  bookSegments: BookSegmentsI
}