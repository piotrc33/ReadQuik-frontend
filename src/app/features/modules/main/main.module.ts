import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './components/main/main.component';
import { AuthService } from '../auth/services/auth.service';
import { ExercisesModule } from '../exercises/exercises.module';
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
    AuthService
  ]
})
export class MainModule { }
