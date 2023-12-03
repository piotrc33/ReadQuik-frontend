import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Exercise1Component } from './components/exercise1/exercise1.component';
import { Exercise2Component } from './components/exercise2/exercise2.component';
import { ExercisesComponent } from './components/exercises/exercises.component';
import { ExercisesRoutingModule } from './exercises-routing.module';
import { Exercise3Component } from './components/exercise3/exercise3.component';
import { TextService } from './services/text.service';
import { Exercise4Component } from './components/exercise4/exercise4.component';
import { ExercisesStateService } from './services/exercises-state.service';
import { KeyboardService } from './services/keyboard.service';
import { ExerciseNavComponent } from './components/ui/exercise-nav/exercise-nav.component';
import { ExercisePanelComponent } from './components/ui/exercise-panel/exercise-panel.component';
import { ExercisesHttpService } from './services/exercises-http.service';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    Exercise1Component,
    Exercise2Component,
    ExercisesComponent,
    Exercise3Component,
    Exercise4Component,
    ExerciseNavComponent,
    ExercisePanelComponent
  ],
  imports: [
    CommonModule,
    ExercisesRoutingModule,
    SharedModule
  ],
  exports: [
    Exercise1Component,
    Exercise2Component,
  ],
  providers: [
    TextService,
    ExercisesStateService,
    KeyboardService,
    ExercisesHttpService
  ]
})
export class ExercisesModule { }
