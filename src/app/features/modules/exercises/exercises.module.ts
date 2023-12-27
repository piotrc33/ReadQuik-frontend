import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { Exercise1Component } from './components/exercise1/exercise1.component';
import { Exercise2Component } from './components/exercise2/exercise2.component';
import { Exercise3Component } from './components/exercise3/exercise3.component';
import { Exercise4Component } from './components/exercise4/exercise4.component';
import { Exercise5Component } from './components/exercise5/exercise5.component';
import { ExercisesComponent } from './components/exercises/exercises.component';
import { ExerciseNavComponent } from './components/ui/exercise-nav/exercise-nav.component';
import { ExercisePanelComponent } from './components/ui/exercise-panel/exercise-panel.component';
import { ExercisesRoutingModule } from './exercises-routing.module';
import { ExercisesHttpService } from './services/exercises-http.service';
import { ExercisesStateService } from './services/exercises-state.service';
import { KeyboardService } from './services/keyboard.service';
import { TextService } from './services/text.service';
import { Exercise6Component } from './components/exercise6/exercise6.component';

@NgModule({
  declarations: [
    Exercise1Component,
    Exercise2Component,
    ExercisesComponent,
    Exercise3Component,
    Exercise4Component,
    Exercise5Component,
    ExerciseNavComponent,
    ExercisePanelComponent,
    Exercise6Component,
  ],
  imports: [CommonModule, ExercisesRoutingModule, SharedModule],
  exports: [Exercise1Component, Exercise2Component],
  providers: [
    TextService,
    ExercisesStateService,
    KeyboardService,
    ExercisesHttpService,
  ],
})
export class ExercisesModule {}
