import {AuthData} from "./auth-data.model";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {TrainingService} from "../training/training.service";
import {UiService} from "../shared/ui.service";
import {Store} from "@ngrx/store";
import * as fromRoot from "../app.reducer";
import * as UI from "../shared/ui.actions";
import * as AUTH from "../auth/auth.action";

@Injectable()
export class AuthService {

  constructor(private router: Router, private firestoreAuth: AngularFireAuth, private trainingService: TrainingService,
              private uiService: UiService, private store: Store<fromRoot.State>) {
  }

  initAuthListener(): void {
    this.firestoreAuth.authState.subscribe(user => {
      if (user) {
        this.store.dispatch(new AUTH.SetAuthenticated);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.store.dispatch(new AUTH.SetUnauthenticated);
        this.router.navigate(['/login']);
      }
    })
  }

  registerUser(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading);
    this.firestoreAuth.createUserWithEmailAndPassword(authData.email, authData.password).then().catch(error => {
      this.uiService.showSnackBar(error.message, null, 3000);
    }).finally(() => {
      this.store.dispatch(new UI.StopLoading);
    });
  }

  login(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading);
    this.firestoreAuth.signInWithEmailAndPassword(authData.email, authData.password).then().catch(error => {
      this.uiService.showSnackBar(error.message, null, 3000);
    }).finally(() => {
      this.store.dispatch(new UI.StopLoading);
    });
  }

  logout() {
    this.firestoreAuth.signOut();
  }
}
