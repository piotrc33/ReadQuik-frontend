import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './features/main/components/main/main.component';
import { AuthGuard } from './api/guards/auth.guard';
import { AuthContainerComponent } from './features/auth/components/ui/auth-container/auth-container.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/main/main-routing.module').then(
        (m) => m.MainRoutingModule
      ),
  },
  {
    path: 'auth',
    component: AuthContainerComponent,
    loadChildren: () =>
      import('./features/auth/auth-routing.module').then(
        (m) => m.AuthRoutingModule
      ),
  },
  { path: '**', redirectTo: '/exercises' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
