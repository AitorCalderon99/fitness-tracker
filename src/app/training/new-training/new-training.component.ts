import {Component, OnDestroy, OnInit} from '@angular/core';
import {TrainingService} from "../training.service";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import {Exercise} from "../exercise.model";


@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

  exercises: Exercise[];
  exercisesSubscription: Subscription;
  isLoading: boolean = true;

  constructor(private trainingService: TrainingService) {
  }

  ngOnInit() {
    this.exercisesSubscription = this.trainingService.exercisesChanged.subscribe((exercises: Exercise[]) => {
      this.exercises = exercises;
      this.isLoading = false;
    })
    this.trainingService.fetchAvailableExercises();

  }

  onStartTraining(trainingForm: NgForm) {
    this.trainingService.startExercise(
      trainingForm.value.trainingSelect
    )
  }

  ngOnDestroy(): void {
    this.exercisesSubscription.unsubscribe();
  }
}
