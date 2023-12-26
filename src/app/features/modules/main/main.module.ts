import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { ExercisesModule } from '../exercises/exercises.module';
import { BookService } from '../library/services/book.service';
import { MainComponent } from './components/main/main.component';
import { MainRoutingModule } from './main-routing.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    MainComponent,
    NavbarComponent,
  ],
  imports: [
    MainRoutingModule,
    CommonModule,
    ExercisesModule,
    SharedModule
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
