import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './features/modules/main/components/main/main.component';
import { AuthGuard } from './api/guards/auth.guard';
import { AuthContainerComponent } from './features/modules/auth/components/ui/auth-container/auth-container.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/modules/main/main-routing.module').then(
        (m) => m.MainRoutingModule
      ),
  },
  {
    path: 'auth',
    component: AuthContainerComponent,
    loadChildren: () =>
      import('./features/modules/auth/auth-routing.module').then(
        (m) => m.AuthRoutingModule
      ),
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
