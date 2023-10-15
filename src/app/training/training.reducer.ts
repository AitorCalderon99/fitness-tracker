import {
  SET_AVAILABLE_TRAININGS,
  SET_FINISHED_TRAININGS,
  START_TRAINING,
  STOP_TRAINING,
  TrainingActions
} from './training.actions';
import {Exercise} from "./exercise.model";
import * as fromRoot from "../app.reducer";
import {createFeatureSelector, createSelector} from "@ngrx/store";

export interface TrainingState {
  availableExercises: Exercise[];
  finishedExercise: Exercise[];
  activeExercise: Exercise;
}

export interface State extends fromRoot.State {
  training: TrainingState
}

const initialState: TrainingState = {
  availableExercises: [],
  finishedExercise: [],
  activeExercise: null
}

export function trainingReducer(state = initialState, action: TrainingActions) {
  switch (action.type) {
    case SET_AVAILABLE_TRAININGS:
      return {
        ...state,
        availableExercises: action.payload
      }
    case SET_FINISHED_TRAININGS:
      return {
        ...state,
        finishedExercise: action.payload
      }
    case START_TRAINING:
      return {
        ...state,
        activeTraining: {...state.availableExercises.find((ex: Exercise): boolean => ex.id === action.payload)}
      }
    case STOP_TRAINING:
      return {
        ...state,
        activeExercise: null
      }
    default:
      return state;
  }
}

export const getTrainingState = createFeatureSelector<TrainingState>('training');
export const getAvailableTrainings = createSelector(getTrainingState, (state: TrainingState) => state.availableExercises);
export const getFinishedExercises = createSelector(getTrainingState, (state: TrainingState) => state.finishedExercise);
export const getActiveExercise = createSelector(getTrainingState, (state: TrainingState) => state.activeExercise);

