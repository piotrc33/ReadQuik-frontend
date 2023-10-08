import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Exercise1Component } from './components/exercise1/exercise1.component';
import { Exercise2Component } from './components/exercise2/exercise2.component';
import { ExercisesComponent } from './components/exercises/exercises.component';
import { ExercisesRoutingModule } from './exercises-routing.module';



@NgModule({
  declarations: [
    Exercise1Component,
    Exercise2Component,
    ExercisesComponent
  ],
  imports: [
    CommonModule,
    ExercisesRoutingModule
  ],
  exports: [
    Exercise1Component,
    Exercise2Component,
  ]
})
export class ExercisesModule { }
