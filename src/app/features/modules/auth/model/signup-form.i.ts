import { FormControl } from "@angular/forms";

export interface SignupFormI {
  email: FormControl<string>;
  username: FormControl<string>;
  password: FormControl<string>;
}