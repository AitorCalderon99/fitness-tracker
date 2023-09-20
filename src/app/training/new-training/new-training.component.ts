import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TrainingService} from "../training.service";
import {Exercise} from "../exercise.model";

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit{
  @Output() trainingStart = new EventEmitter<void>();
  availableTrainings: Exercise[] = [];

  constructor(private trainingService: TrainingService) {
  }

  ngOnInit() {
    this.availableTrainings = this.trainingService.getExercises();
  }

  onStartTraining() {
    console.log(this.availableTrainings)
    this.trainingStart.emit();
  }
}
