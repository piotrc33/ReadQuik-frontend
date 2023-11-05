import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { ExercisesModule } from '../exercises/exercises.module';
import { BookService } from '../library/services/book.service';
import { MainComponent } from './components/main/main.component';
import { MainRoutingModule } from './main-routing.module';



@NgModule({
  declarations: [
    MainComponent,
  ],
  imports: [
    MainRoutingModule,
    CommonModule,
    ExercisesModule,
  ],
  exports: [
    MainComponent
  ],
  providers: [
    AuthService,
    BookService
  ]
})
export class MainModule { }
