import { AvailableLanguages } from "src/app/shared/types/available-languages.t";

export interface Filters {
  title: string;
  author: string;
  language: AvailableLanguages | '';
  tags: string[];
}