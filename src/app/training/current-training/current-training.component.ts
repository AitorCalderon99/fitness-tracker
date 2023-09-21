import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {StopTrainingComponent} from "./stop-training.component";
import {TrainingService} from "../training.service";
import {Exercise} from "../exercise.model";

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.scss']
})
export class CurrentTrainingComponent implements OnInit {
  progress: number = 0;
  progressInterval: number | undefined;
  private runningExercise: Exercise | undefined;

  constructor(private dialog: MatDialog, private trainingService: TrainingService) {
  }

  ngOnInit(): void {
    this.startInterval();
    this.runningExercise = this.trainingService.getRunningExercise();
  }

  startInterval() {
    const step = this.trainingService.getRunningExercise().duration / 100 * 1000;

    this.progressInterval = setInterval(() => {
      this.progress++
      if (this.progress >= 100) {
        this.trainingService.completeExercise();
        clearInterval(this.progressInterval);
      }
    }, step);
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
