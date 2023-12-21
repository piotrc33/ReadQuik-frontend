import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibraryRoutingModule } from './library-routing.module';
import { BookService } from './services/book.service';
import { LibraryComponent } from './components/library/library.component';
import { AddBookComponent } from './components/add-book/add-book.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { PillComponent } from './components/ui/pill/pill.component';
import { BookCardComponent } from './components/ui/book-card/book-card.component';


@NgModule({
  declarations: [
    AddBookComponent,
    LibraryComponent,
    PillComponent,
    BookCardComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LibraryRoutingModule,
    SharedModule
  ],
  providers: [
    BookService
  ]
})
export class LibraryModule { }
