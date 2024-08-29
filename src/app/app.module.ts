import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './features/auth/auth.module';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptorService } from './api/interceptors/auth-interceptor.service';
import { AuthGuard } from './api/guards/auth.guard';
import { ExercisesModule } from './features/exercises/exercises.module';
import { MainModule } from './features/main/main.module';
import { LibraryModule } from './features/library/library.module';
import { TranslocoRootModule } from './transloco-root.module';
import { SharedModule } from './shared/shared.module';
import { ProgressModule } from './features/progress/progress.module';

@NgModule({ declarations: [AppComponent],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        AuthModule,
        ExercisesModule,
        MainModule,
        LibraryModule,
        ProgressModule,
        TranslocoRootModule,
        SharedModule], providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptorService,
            multi: true,
        },
        AuthGuard,
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule {}
