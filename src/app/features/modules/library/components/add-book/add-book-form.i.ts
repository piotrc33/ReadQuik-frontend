import { FormArray, FormControl } from "@angular/forms";

export interface AddBookFormI {
  title: FormControl<string>;
  author: FormControl<string>;
  coverUrl: FormControl<string>;
  language: FormControl<'Polish' | 'English'>;
  tags: FormArray<FormControl<string>>;
}