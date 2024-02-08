import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Exercise1Component } from './components/exercise1/exercise1.component';
import { Exercise2Component } from './components/exercise2/exercise2.component';
import { Exercise3Component } from './components/exercise3/exercise3.component';
import { Exercise4Component } from './components/exercise4/exercise4.component';
import { Exercise5Component } from './components/exercise5/exercise5.component';
import { Exercise6Component } from './components/exercise6/exercise6.component';
import { Exercise7Component } from './components/exercise7/exercise7.component';
import { Exercise8Component } from './components/exercise8/exercise8.component';

const routes: Routes = [
  { path: '1', component: Exercise1Component },
  { path: '2', component: Exercise2Component },
  { path: '3', component: Exercise3Component },
  { path: '4', component: Exercise4Component },
  { path: '5', component: Exercise5Component },
  { path: '6', component: Exercise6Component },
  { path: '7', component: Exercise7Component },
  { path: '8', component: Exercise8Component },
  { path: '**', redirectTo: '1' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExercisesRoutingModule {}
