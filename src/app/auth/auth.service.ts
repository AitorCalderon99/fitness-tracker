import {User} from "./user.model";
import {AuthData} from "./auth-data.model";
import {Subject} from "rxjs";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";

@Injectable()
export class AuthService {

  private user: null | undefined | User;
  authChange = new Subject<boolean>();

  constructor(private router: Router) {
  }

  registerUser(authData: AuthData) {
    this.login(authData);
  }

  login(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 1000).toString()
    }
    this.authSuccesfull();
  }

  private authSuccesfull() {
    this.authChange.next(true);
    this.router.navigate(['/training']);
  }

  logout() {
    this.user = null;
    this.authChange.next(false);
    this.router.navigate(['/login']);
  }

  getUser() {
    return {...this.user}
  }

  isAuth(): boolean {
    return this.user != null;
  }

}
