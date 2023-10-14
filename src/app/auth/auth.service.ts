import {AuthData} from "./auth-data.model";
import {Subject} from "rxjs";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {TrainingService} from "../training/training.service";
import {UiService} from "../shared/ui.service";
import {Store} from "@ngrx/store";
import * as fromRoot from "../app.reducer";
import * as UI from "../shared/ui.actions";

@Injectable()
export class AuthService {

  authChange = new Subject<boolean>();
  private isAuthenticated: boolean = false;

  constructor(private router: Router, private firestoreAuth: AngularFireAuth, private trainingService: TrainingService,
              private uiService: UiService, private store: Store<fromRoot.State>) {
  }

  initAuthListener(): void {
    this.firestoreAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.authChange.next(false);
        this.router.navigate(['/login']);
        this.isAuthenticated = false;
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

  isAuth(): boolean {
    return this.isAuthenticated;
  }
}
