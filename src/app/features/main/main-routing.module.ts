import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExercisesComponent } from '../exercises/components/exercises/exercises.component';
import { readingDataResolver } from './reading-data.resolver';

const routes: Routes = [
  {
    path: 'exercises',
    component: ExercisesComponent,
    resolve: {
      data: readingDataResolver,
    },
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
  {
    path: '',
    redirectTo: 'exercises',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
