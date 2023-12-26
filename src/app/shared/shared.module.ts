import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InputWithLabelComponent } from './components/input-with-label/input-with-label.component';
import { PillComponent } from './components/pill/pill.component';
import { RelativeDatePipe } from './pipes/relative-date.pipe';

const exportedComponents = [
  InputWithLabelComponent,
  RelativeDatePipe,
  PillComponent,
];

@NgModule({
  declarations: exportedComponents,
  imports: [CommonModule, ReactiveFormsModule],
  exports: exportedComponents,
  providers: [],
})
export class SharedModule {}
