import {Exercise} from "./exercise.model";
import {Subject, Subscription} from "rxjs";
import {map} from "rxjs/operators";
import {Injectable} from "@angular/core";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {UiService} from "../shared/ui.service";
import {Store} from "@ngrx/store";
import * as fromRoot from "../app.reducer";
import * as UI from "../shared/ui.actions";

@Injectable()
export class TrainingService {

  exerciseChanged = new Subject<Exercise | null>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise | null | undefined;
  private firebaseSubscriptions: Subscription[] = [];
  private fetchErrorMsg: string = 'Fetching exercises failed, please try again later';

  constructor(private angularFirestore: AngularFirestore, private uiService: UiService, private store: Store<fromRoot.State>) {
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
          this.availableExercises = exercises;
          this.exercisesChanged.next([...this.availableExercises]);
        },
        error: () => {
          this.store.dispatch(new UI.StopLoading);
          this.uiService.showSnackBar(this.fetchErrorMsg, null, 3000);
          this.exerciseChanged.next(null);
        }
      }));
  }

  public startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(exercise => exercise.id === selectedId);
    this.exerciseChanged.next({...this.runningExercise});
  }

  public completeExercise() {
    this.addDataToDb(<Exercise>{...this.runningExercise, date: new Date(), state: "completed"});
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  public cancelExercise(progress: number) {
    this.addDataToDb(<Exercise>{
      ...this.runningExercise,
      duration: this.runningExercise?.duration ? this.runningExercise.duration * (progress / 100) : undefined,
      calories: this.runningExercise?.calories ? this.runningExercise.calories * (progress / 100) : undefined,
      date: new Date(),
      state: "cancelled"
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  public getRunningExercise(): Exercise {
    return <Exercise>{...this.runningExercise};
  }

  public fetchCompletedOrCanceledExercises() {
    this.firebaseSubscriptions.push(this.angularFirestore.collection('finishedExercises')
      .valueChanges()
      .subscribe({
        next: (exercises: Exercise[]) => {
          this.finishedExercisesChanged.next(exercises);
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
    this.angularFirestore.collection('finishedExercises').add(exercise).then().catch(error => {
      this.uiService.showSnackBar(error, null, 3000);
    });
  }
}
