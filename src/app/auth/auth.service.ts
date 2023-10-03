import {AuthData} from "./auth-data.model";
import {Subject} from "rxjs";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {TrainingService} from "../training/training.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable()
export class AuthService {

  private isAuthenticated: boolean = false;
  authChange = new Subject<boolean>();

  constructor(private router: Router, private firestoreAuth: AngularFireAuth, private trainingService: TrainingService, private snackBar: MatSnackBar) {
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
    this.firestoreAuth.createUserWithEmailAndPassword(authData.email, authData.password).then().catch(error => {
      this.snackBar.open(error.message, null, {
        duration: 3000
      });
    });
  }

  login(authData: AuthData) {
    this.firestoreAuth.signInWithEmailAndPassword(authData.email, authData.password).then().catch(error => {
      this.snackBar.open(error.message, null, {
        duration: 3000
      });
    });
  }

  logout() {
    this.firestoreAuth.signOut();
  }

  isAuth(): boolean {
    return this.isAuthenticated;
  }

}
