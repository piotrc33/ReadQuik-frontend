import { NgModule } from '@angular/core';
import { InputWithLabelComponent } from './components/input-with-label/input-with-label.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RelativeDatePipe } from './pipes/relative-date.pipe';

@NgModule({
  declarations: [InputWithLabelComponent, RelativeDatePipe],
  imports: [ReactiveFormsModule],
  exports: [InputWithLabelComponent, RelativeDatePipe],
  providers: [],
})
export class SharedModule {}
