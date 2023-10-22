import {inject} from '@angular/core';
import * as fromRoot from "../app.reducer";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";


export const trainingGuard = (): Observable<boolean> => {
  const store = inject(Store<fromRoot.State>)

  return store.select(fromRoot.getIsAuthenticated);
}
