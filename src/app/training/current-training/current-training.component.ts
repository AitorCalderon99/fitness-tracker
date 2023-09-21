import {Component, EventEmitter, OnInit, Output} from '@angular/core';
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
  @Output() trainingExit = new EventEmitter<void>();
  private runningExercise: Exercise | undefined;

  constructor(private dialog: MatDialog, private trainingService: TrainingService) {
  }

  ngOnInit(): void {
    this.startInterval();
    this.runningExercise = this.trainingService.getRunningExercise();
  }

  startInterval() {
    let timeout = 1000;
    if (this.runningExercise?.duration) {
      timeout = this.runningExercise?.duration / timeout * 100;
    }

    this.progressInterval = setInterval(() => {
      this.progress++
      if (this.progress >= 100) {
        clearInterval(this.progressInterval);
      }
    }, timeout);
  }

  onStopCount() {
    clearInterval(this.progressInterval);

    const dialog = this.dialog.open(StopTrainingComponent, {
      data: {
        progress: this.progress
      }
    });

    dialog.afterClosed().subscribe(result => {
      result ? this.trainingExit.emit() : this.startInterval();
    })
  }
}
