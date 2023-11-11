import { SegmentI } from "./segment.i";

export interface BookI {
  _id?: string,
  title: string,
  segments: SegmentI[]
}