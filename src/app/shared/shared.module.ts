import { NgModule } from "@angular/core";
import { InputWithLabelComponent } from "./components/input-with-label/input-with-label.component";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [InputWithLabelComponent],
  imports: [ReactiveFormsModule],
  exports:[InputWithLabelComponent],
  providers: []
})
export class SharedModule {};