import {Exercise} from "./exercise.model";
import {Subscription, take} from "rxjs";
import {map} from "rxjs/operators";
import {Injectable} from "@angular/core";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {UiService} from "../shared/ui.service";
import {Store} from "@ngrx/store";
import * as fromTraining from "./training.reducer";
import * as UI from "../shared/ui.actions";
import * as TRAINING from "./training.actions";


@Injectable()
export class TrainingService {

  private firebaseSubscriptions: Subscription[] = [];
  private fetchErrorMsg: string = 'Fetching exercises failed, please try again later';

  constructor(private angularFirestore: AngularFirestore, private uiService: UiService, private store: Store<fromTraining.State>) {
  }

  public fetchAvailableExercises(): void {
    this.store.dispatch(new UI.StartLoading);
    this.firebaseSubscriptions.push(this.angularFirestore.collection('availableExercises')
      .snapshotChanges().pipe(map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...(doc.payload.doc.data() as Exercise)
          }
        })
      })).subscribe({
        next: (exercises: Exercise[]) => {
          this.store.dispatch(new UI.StopLoading);
          this.store.dispatch(new TRAINING.SetAvailableTrainings(exercises));
        },
        error: () => {
          this.store.dispatch(new UI.StopLoading);
          this.uiService.showSnackBar(this.fetchErrorMsg, null, 3000);
        }
      }));
  }

  public startExercise(selectedId: string) {
    this.store.dispatch(new TRAINING.StartTraining(selectedId));
  }

  public completeExercise() {
    this.store.select(fromTraining.getActiveExercise).pipe(take(1)).subscribe((exercise: Exercise) => {
      this.addDataToDb(<Exercise>{...exercise, date: new Date(), state: "completed"});
      this.store.dispatch(new TRAINING.StopTraining())
    });
  }

  public cancelExercise(progress: number) {
    this.store.select(fromTraining.getActiveExercise).pipe(take(1)).subscribe((exercise: Exercise) => {
      this.addDataToDb(<Exercise>{
        ...exercise,
        duration: exercise.duration ? exercise.duration * (progress / 100) : undefined,
        calories: exercise.calories ? exercise.calories * (progress / 100) : undefined,
        date: new Date(),
        state: "cancelled"
      });
      this.store.dispatch(new TRAINING.StopTraining())
    });
  }

  public fetchCompletedOrCanceledExercises() {
    this.firebaseSubscriptions.push(this.angularFirestore.collection('finishedExercises')
      .valueChanges()
      .subscribe({
        next: (exercises: Exercise[]) => {
          this.store.dispatch(new TRAINING.SetFinishedTrainings(exercises))
        },
        error: () => {
          this.store.dispatch(new UI.StopLoading);
          this.uiService.showSnackBar(this.fetchErrorMsg, null, 3000)
        }
      }))
  }

  public cancelSubscriptions(): void {
    this.firebaseSubscriptions.forEach((sub: Subscription) => sub?.unsubscribe());
  }

  private addDataToDb(exercise: Exercise) {
    this.angularFirestore.collection('finishedExercises').add(exercise).then(r => console.log(r));

  }
}
