import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { DialogComponent } from './components/dialog/dialog.component';
import { PillComponent } from './components/pill/pill.component';
import { TextInputWithValidationComponent } from './components/text-input-with-validation/text-input-with-validation.component';
import { ValidationErrorsComponent } from './components/validation-errors/validation-errors.component';
import { RelativeDatePipe } from './pipes/relative-date.pipe';
import { CurrentExerciseService } from './services/current-exercise.service';
import { ReadingDataService } from './services/reading-data/reading-data.service';

const exportedComponents = [
  RelativeDatePipe,
  PillComponent,
  ValidationErrorsComponent,
  TextInputWithValidationComponent,
  DialogComponent,
];

@NgModule({
  declarations: exportedComponents,
  imports: [CommonModule, ReactiveFormsModule, TranslocoModule],
  exports: exportedComponents,
  providers: [ReadingDataService, CurrentExerciseService],
})
export class SharedModule {}
