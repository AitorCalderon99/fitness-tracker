import {Component, OnDestroy, OnInit} from '@angular/core';
import {TrainingService} from "../training.service";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import {Exercise} from "../exercise.model";
import {UiService} from "../../shared/ui.service";


@Component({
    selector: 'app-new-training',
    templateUrl: './new-training.component.html',
    styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

    exercises: Exercise[];
    exercisesSubscription: Subscription;
    loadingSubscription: Subscription;

    isLoading: boolean = true;

    constructor(private trainingService: TrainingService, private uiService: UiService) {
    }

    ngOnInit() {
        this.loadingSubscription = this.uiService.loadingStateChanged.subscribe((isLoading: boolean) => {
            this.isLoading = isLoading;
        })
        this.exercisesSubscription = this.trainingService.exercisesChanged.subscribe((exercises: Exercise[]) => {
            this.exercises = exercises;
        })
        this.fetchExercises();
    }

    fetchExercises() {
        this.trainingService.fetchAvailableExercises();
    }

    onStartTraining(trainingForm: NgForm) {
        this.trainingService.startExercise(
            trainingForm.value.trainingSelect
        )
    }

    ngOnDestroy(): void {
        this.exercisesSubscription?.unsubscribe();
        this.loadingSubscription?.unsubscribe();
    }
}
