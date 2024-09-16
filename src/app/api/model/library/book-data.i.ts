import { AvailableLanguages } from "src/app/shared/types/available-languages.t";

export interface BookData {
  _id: string,
  title: string,
  author: string,
  coverUrl: string,
  language: AvailableLanguages,
  totalSegments: number,
  tags: string[]
}