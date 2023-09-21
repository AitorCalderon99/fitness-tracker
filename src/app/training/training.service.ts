import {Exercise} from "./exercise.model";
import {Subject} from "rxjs";

export class TrainingService {

  exerciseChanged = new Subject<Exercise | null>();

  private availableExercises: Exercise[] = [
    {id: 'crunches', name: 'Crunches', duration: 30, calories: 8},
    {id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15},
    {id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18},
    {id: 'burpees', name: 'Burpees', duration: 60, calories: 8}
  ];

  private runningExercise: Exercise | null | undefined;
  private exercises: Exercise[] = [];

  public getAvailableExercises(): Exercise[] {
    return this.availableExercises;
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


}
