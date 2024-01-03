import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddBookComponent } from './components/add-book/add-book.component';
import { FiltersComponent } from './components/filters/filters.component';
import { LibraryComponent } from './components/library/library.component';
import { BookCardComponent } from './components/ui/book-card/book-card.component';
import { LibraryRoutingModule } from './library-routing.module';
import { BookService } from './services/book.service';
import { TranslocoModule } from '@ngneat/transloco';

@NgModule({
  declarations: [
    AddBookComponent,
    LibraryComponent,
    BookCardComponent,
    FiltersComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LibraryRoutingModule,
    SharedModule,
    TranslocoModule
  ],
  providers: [BookService],
})
export class LibraryModule {}
