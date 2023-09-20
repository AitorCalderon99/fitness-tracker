import {User} from "./user.model";
import {AuthData} from "./auth-data.model";
import {Subject} from "rxjs";

export class AuthService {
  private user: null | undefined | User;
  authChange = new Subject<boolean>();

  registerUser(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 1000).toString()
    }
    this.authChange.next(true);
  }

  login(authData: AuthData) {
    console.log('login: ', authData);
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 1000).toString()
    }
    this.authChange.next(true);
  }

  logout() {
    this.user = null;
    this.authChange.next(false);

  }

  getUser() {
    return {...this.user}
  }

  isAuth(): boolean {
    return this.user != null;
  }

}
