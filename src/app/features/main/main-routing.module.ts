import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExercisesComponent } from '../exercises/components/exercises/exercises.component';

const routes: Routes = [
  {
    path: 'exercises',
    component: ExercisesComponent,
    loadChildren: () =>
      import('../exercises/exercises-routing.module').then(
        (m) => m.ExercisesRoutingModule
      ),
  },
  {
    path: 'library',
    loadChildren: () =>
      import('../library/library-routing.module').then(
        (m) => m.LibraryRoutingModule
      ),
  },
  {
    path: 'progress',
    loadChildren: () =>
      import('../progress/progress-routing.module').then(
        (m) => m.ProgressRoutingModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
