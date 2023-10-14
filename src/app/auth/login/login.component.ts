import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {UiService} from "../../shared/ui.service";
import {Observable} from "rxjs";
import {Store} from "@ngrx/store";
import * as fromApp from "../../app.reducer";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLoading$: Observable<boolean>;
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', {validators: [Validators.required, Validators.email]}),
    password: new FormControl('', {validators: [Validators.required]}),
  });

  constructor(private authService: AuthService, private uiService: UiService, private store: Store<{
    ui: fromApp.State
  }>) {
  }

  onFormSubmit(): void {
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    });
  }

  ngOnInit(): void {
    this.isLoading$ = this.store.pipe(map((state: { ui: fromApp.State }) => state.ui.isLoading))
  }
}
