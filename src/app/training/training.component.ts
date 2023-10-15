import {Component, OnInit} from '@angular/core';
import {TrainingService} from "./training.service";
import {Store} from "@ngrx/store";
import * as fromTraining from "./training.reducer";
import {getIsExercising} from "./training.reducer";
import {Observable} from "rxjs";

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements OnInit {
  onGoingTraining$: Observable<boolean>;

  constructor(private trainingService: TrainingService, private store: Store<fromTraining.State>) {
  }

  ngOnInit(): void {
    this.onGoingTraining$ = this.store.select(getIsExercising);
  }
}
