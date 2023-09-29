import {Exercise} from "./exercise.model";
import {Subject} from "rxjs";
import {map} from "rxjs/operators";
import {Injectable} from "@angular/core";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Injectable()
export class TrainingService {

  exerciseChanged = new Subject<Exercise | null>();
  exercisesChanged = new Subject<Exercise[]>();


  private availableExercises: Exercise[] = [];

  private runningExercise: Exercise | null | undefined;
  private exercises: Exercise[] = [];

  constructor(private angularFirestore: AngularFirestore) {
  }

  public fetchAvailableExercises(): void {
    this.angularFirestore.collection('availableExercises')
      .snapshotChanges().pipe(map(docArray => {
      return docArray.map(doc => {
        return {
          id: doc.payload.doc.id,
          ...(doc.payload.doc.data() as Exercise)
        }
      })
    })).subscribe((exercises: Exercise[]) => {
      this.availableExercises = exercises;
      this.exercisesChanged.next([...this.availableExercises]);
    });
  }

  public startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(exercise => exercise.id === selectedId);
    this.exerciseChanged.next({...this.runningExercise});
  }

  public stopExercise() {
    this.runningExercise = null;
  }

  public completeExercise() {
    this.exercises.push(<Exercise>{...this.runningExercise, date: new Date(), state: "completed"});
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  public cancelExercise(progress: number) {
    this.exercises.push(<Exercise>{
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


  public getCompletedOrCanceledExercises(): Exercise[] {
    return this.exercises.slice();
  }
}
