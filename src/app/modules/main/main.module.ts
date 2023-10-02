import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { AuthService } from '../auth/auth.service';



@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    AuthService
  ]
})
export class MainModule { }
