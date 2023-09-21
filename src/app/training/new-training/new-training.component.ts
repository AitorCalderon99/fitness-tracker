import {Component, OnInit} from '@angular/core';
import {TrainingService} from "../training.service";
import {Exercise} from "../exercise.model";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit{
  availableTrainings: Exercise[] = [];

  constructor(private trainingService: TrainingService) {
  }

  ngOnInit() {
    this.availableTrainings = this.trainingService.getExercises();
    console.log(this.availableTrainings);
  }

  onStartTraining(trainingForm: NgForm) {
    this.trainingService.startExercise(
      trainingForm.value.trainingSelect
    )
  }
}
