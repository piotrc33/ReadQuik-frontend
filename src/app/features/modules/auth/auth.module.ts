import { NgModule } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { SignupComponent } from './components/signup/signup.component';
import { RouterModule } from '@angular/router';
import { AuthPanelComponent } from './components/ui/auth-panel/auth-panel.component';
import { CommonModule } from '@angular/common';
import { AuthContainerComponent } from './components/ui/auth-container/auth-container.component';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [LoginComponent, SignupComponent, AuthPanelComponent, AuthContainerComponent],
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    RouterModule,
    CommonModule,
    AuthRoutingModule
  ],
  providers: [AuthService],
})
export class AuthModule {}
