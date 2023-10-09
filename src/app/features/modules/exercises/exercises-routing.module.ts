import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Exercise1Component } from './components/exercise1/exercise1.component';
import { Exercise2Component } from './components/exercise2/exercise2.component';

const routes: Routes = [
  { path: '1', component: Exercise1Component },
  { path: '2', component: Exercise2Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExercisesRoutingModule {}
