import { FormArray, FormControl } from "@angular/forms";
import { AvailableLanguages } from "src/app/shared/types/available-languages.t";

export interface AddBookFormI {
  title: FormControl<string>;
  author: FormControl<string>;
  coverUrl: FormControl<string>;
  language: FormControl<AvailableLanguages>;
  tags: FormArray<FormControl<string>>;
}