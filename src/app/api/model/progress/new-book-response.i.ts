import { BookData } from "../library/book-data.i";
import { BookSegmentsI } from "../book-segments.i";

export interface NewBookResponseI {
  bookData: BookData;
  bookSegments: BookSegmentsI
}