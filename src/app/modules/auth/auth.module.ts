import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { SignupComponent } from './signup/signup.component';
import { RouterModule } from '@angular/router';
import { AuthPanelComponent } from './auth-panel/auth-panel.component';

@NgModule({
  declarations: [LoginComponent, SignupComponent, AuthPanelComponent],
  imports: [ReactiveFormsModule, HttpClientModule, SharedModule, RouterModule],
  providers: [AuthService],
})
export class AuthModule {}
