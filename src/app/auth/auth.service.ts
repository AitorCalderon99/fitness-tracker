import {AuthData} from "./auth-data.model";
import {Subject} from "rxjs";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {AngularFireAuth} from "@angular/fire/compat/auth";

@Injectable()
export class AuthService {

  private isAuthenticated: boolean = false;
  authChange = new Subject<boolean>();

  constructor(private router: Router, private firestoreAuth: AngularFireAuth) {
  }

  registerUser(authData: AuthData) {
    this.firestoreAuth.createUserWithEmailAndPassword(authData.email, authData.password).then(result => {
      console.log(result);
      this.authSuccesfull();
    }).catch(error => console.log(error));
  }

  login(authData: AuthData) {
    this.firestoreAuth.signInWithEmailAndPassword(authData.email, authData.password).then(result => {
      console.log(result);
      this.authSuccesfull();
    }).catch(error => console.log(error));
  }

  private authSuccesfull() {
    this.isAuthenticated = true;
    this.authChange.next(true);
    this.router.navigate(['/training']);
  }

  logout() {
    this.authChange.next(false);
    this.router.navigate(['/login']);
    this.isAuthenticated = false;
  }

  isAuth(): boolean {
    return this.isAuthenticated;
  }

}
