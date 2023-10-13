import {NgModule} from "@angular/core";
import {TrainingComponent} from "./training.component";
import {CurrentTrainingComponent} from "./current-training/current-training.component";
import {PastTrainingsComponent} from "./past-trainings/past-trainings.component";
import {NewTrainingComponent} from "./new-training/new-training.component";
import {StopTrainingComponent} from "./current-training/stop-training.component";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {SharedModule} from "../shared/shared.module";


@NgModule({
  declarations: [
    TrainingComponent,
    CurrentTrainingComponent,
    PastTrainingsComponent,
    NewTrainingComponent,
    StopTrainingComponent
  ],
  imports: [
    AngularFirestoreModule,
    SharedModule
  ]
})
export class TrainingModule {
}
