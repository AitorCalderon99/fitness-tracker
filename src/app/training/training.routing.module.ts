import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {TrainingComponent} from "./training.component";
import {trainingGuard} from "../auth/auth.guard";

const routes: Routes = [
  {path: '', component: TrainingComponent, canActivate: [trainingGuard]},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class TrainingRoutingModule {

}
