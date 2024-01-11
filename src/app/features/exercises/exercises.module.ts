import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { SharedModule } from 'src/app/shared/shared.module';
import { Exercise1Component } from './components/exercise1/exercise1.component';
import { Exercise2Component } from './components/exercise2/exercise2.component';
import { Exercise3Component } from './components/exercise3/exercise3.component';
import { Exercise4Component } from './components/exercise4/exercise4.component';
import { Exercise5Component } from './components/exercise5/exercise5.component';
import { Exercise6Component } from './components/exercise6/exercise6.component';
import { Exercise7Component } from './components/exercise7/exercise7.component';
import { Exercise8Component } from './components/exercise8/exercise8.component';
import { ExercisesComponent } from './components/exercises/exercises.component';
import { ExerciseNavComponent } from './components/ui/exercise-nav/exercise-nav.component';
import { ExercisePanelComponent } from './components/ui/exercise-panel/exercise-panel.component';
import { InstructionComponent } from './components/ui/instruction/instruction.component';
import { ExercisesRoutingModule } from './exercises-routing.module';
import { ExercisesHttpService } from './services/exercises-http.service';
import { ExercisesStateService } from './services/exercises-state.service';
import { KeyboardService } from './services/keyboard.service';
import { TextService } from './services/text.service';
import { InstructionsService } from './services/instructions.service';
import { AdviceComponent } from './components/ui/advice/advice.component';
import { RepetitionIndicatorComponent } from './components/ui/repetition-indicator/repetition-indicator.component';

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
    Exercise7Component,
    Exercise8Component,
    InstructionComponent,
    AdviceComponent,
    RepetitionIndicatorComponent,
  ],
  imports: [
    CommonModule,
    ExercisesRoutingModule,
    SharedModule,
    TranslocoModule,
  ],
  exports: [Exercise1Component, Exercise2Component],
  providers: [
    TextService,
    ExercisesStateService,
    KeyboardService,
    ExercisesHttpService,
    InstructionsService
  ],
})
export class ExercisesModule {}
