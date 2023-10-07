import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Exercise1Component } from './components/exercise1/exercise1.component';



@NgModule({
  declarations: [
    Exercise1Component
  ],
  imports: [
    CommonModule
  ],
  exports: [
    Exercise1Component
  ]
})
export class ExercisesModule { }
