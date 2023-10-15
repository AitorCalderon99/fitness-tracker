import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {StopTrainingComponent} from "./stop-training.component";
import {TrainingService} from "../training.service";
import {Exercise} from "../exercise.model";
import {Store} from "@ngrx/store";
import * as fromTraining from "../training.reducer";
import {take} from "rxjs";


@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.scss']
})
export class CurrentTrainingComponent implements OnInit {
  progress: number = 0;
  progressInterval: number | undefined;

  constructor(private dialog: MatDialog, private trainingService: TrainingService, private store: Store<fromTraining.State>) {
  }

  ngOnInit(): void {
    this.startInterval();
  }

  startInterval() {
    this.store.select(fromTraining.getActiveExercise).pipe(take(1)).subscribe((exercise: Exercise) => {
      const step: number = exercise?.duration / 100 * 1000;

      this.progressInterval = setInterval(() => {
        this.progress++
        if (this.progress >= 100) {
          this.trainingService.completeExercise();
          clearInterval(this.progressInterval);
        }
      }, step);
    })

  }

  onStopCount() {
    clearInterval(this.progressInterval);

    const dialog = this.dialog.open(StopTrainingComponent, {
      data: {
        progress: this.progress
      }
    });

    dialog.afterClosed().subscribe(result => {
      result ? this.trainingService.cancelExercise(this.progress) : this.startInterval();
    })
  }
}
