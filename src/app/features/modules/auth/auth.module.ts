import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { SignupComponent } from './components/signup/signup.component';
import { RouterModule } from '@angular/router';
import { AuthPanelComponent } from './components/auth-panel/auth-panel.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [LoginComponent, SignupComponent, AuthPanelComponent],
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    RouterModule,
    CommonModule,
  ],
  providers: [AuthService],
})
export class AuthModule {}
