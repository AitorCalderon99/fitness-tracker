import {AuthData} from "./auth-data.model";
import {Subject} from "rxjs";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {TrainingService} from "../training/training.service";

@Injectable()
export class AuthService {

  private isAuthenticated: boolean = false;
  authChange = new Subject<boolean>();

  constructor(private router: Router, private firestoreAuth: AngularFireAuth, private trainingService: TrainingService) {
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
    this.firestoreAuth.createUserWithEmailAndPassword(authData.email, authData.password).then().catch(error => console.log(error));
  }

  login(authData: AuthData) {
    this.firestoreAuth.signInWithEmailAndPassword(authData.email, authData.password).then().catch(error => console.log(error));
  }

  logout() {
    this.firestoreAuth.signOut();
  }

  isAuth(): boolean {
    return this.isAuthenticated;
  }

}
