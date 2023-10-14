import {AuthData} from "./auth-data.model";
import {Subject} from "rxjs";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {TrainingService} from "../training/training.service";
import {UiService} from "../shared/ui.service";
import {Store} from "@ngrx/store";
import * as fromApp from "../app.reducer";
@Injectable()
export class AuthService {

  authChange = new Subject<boolean>();
  private isAuthenticated: boolean = false;

  constructor(private router: Router, private firestoreAuth: AngularFireAuth, private trainingService: TrainingService,
              private uiService: UiService, private store: Store<{ui: fromApp.State}>) {
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
    this.store.dispatch({type: 'START_LOADING'});
    this.firestoreAuth.createUserWithEmailAndPassword(authData.email, authData.password).then().catch(error => {
      this.uiService.showSnackBar(error.message, null, 3000);
    }).finally(() => {
      this.store.dispatch({type: 'STOP_LOADING'});
    });
  }

  login(authData: AuthData) {
    this.store.dispatch({type: 'START_LOADING'});
    this.firestoreAuth.signInWithEmailAndPassword(authData.email, authData.password).then().catch(error => {
      this.uiService.showSnackBar(error.message, null, 3000);
    }).finally(() => {
      this.store.dispatch({type: 'STOP_LOADING'});
    });
  }

  logout() {
    this.firestoreAuth.signOut();
  }

  isAuth(): boolean {
    return this.isAuthenticated;
  }
}
