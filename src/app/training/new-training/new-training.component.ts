import {Component, OnInit} from '@angular/core';
import {TrainingService} from "../training.service";
import {NgForm} from "@angular/forms";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Observable} from "rxjs";
import {map} from 'rxjs/operators';
import {Exercise} from "../exercise.model";


@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit {
  exercises: Observable<any>;

  constructor(private trainingService: TrainingService, private angularFirestore: AngularFirestore) {
  }

  ngOnInit() {
    this.exercises = this.angularFirestore.collection('availableExercises')
      .snapshotChanges().pipe(map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...(doc.payload.doc.data() as Exercise)
          }
        })
      }));
  }

  onStartTraining(trainingForm: NgForm) {
    this.trainingService.startExercise(
      trainingForm.value.trainingSelect
    )
  }
}
