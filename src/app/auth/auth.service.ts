import {AuthData} from "./auth-data.model";
import {Subject} from "rxjs";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {TrainingService} from "../training/training.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UiService} from "../shared/ui.service";

@Injectable()
export class AuthService {

  authChange = new Subject<boolean>();
  private isAuthenticated: boolean = false;

  constructor(private router: Router, private firestoreAuth: AngularFireAuth, private trainingService: TrainingService, private snackBar: MatSnackBar, private uiService: UiService) {
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
    this.uiService.loadingStateChanged.next(true);
    this.firestoreAuth.createUserWithEmailAndPassword(authData.email, authData.password).then().catch(error => {
      this.snackBar.open(error.message, null, {
        duration: 3000
      });
    }).finally(() => {
      this.uiService.loadingStateChanged.next(false);
    });
  }

  login(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    this.firestoreAuth.signInWithEmailAndPassword(authData.email, authData.password).then().catch(error => {
      this.snackBar.open(error.message, null, {
        duration: 3000
      });
    }).finally(() => {
      this.uiService.loadingStateChanged.next(false);
    });
  }

  logout() {
    this.firestoreAuth.signOut();
  }

  isAuth(): boolean {
    return this.isAuthenticated;
  }

}
