import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {StopTrainingComponent} from "./stop-training.component";

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.scss']
})
export class CurrentTrainingComponent implements OnInit {
  progress: number = 0;
  progressInterval: number | undefined;
  @Output() trainingExit = new EventEmitter<void>();

  constructor(private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.startInterval();
  }

  startInterval(){
    this.progressInterval = setInterval(() => {
      this.progress++
      if (this.progress >= 100) {
        clearInterval(this.progressInterval);
      }
    }, 250);
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
