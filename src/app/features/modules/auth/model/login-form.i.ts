import { FormControl } from "@angular/forms";

export interface LoginFormI {
  email: FormControl<string>;
  password: FormControl<string>;
}