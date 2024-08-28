import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LibraryComponent } from './components/library/library.component';
import { AddBookComponent } from './components/add-book/add-book.component';
import { tagsResolver } from '../main/resolvers/tags.resolver';

const routes: Routes = [
  {
    path: '',
    component: LibraryComponent,
  },
  {
    path: 'add-book',
    resolve: {
      tags: tagsResolver,
    },
    component: AddBookComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LibraryRoutingModule { }
