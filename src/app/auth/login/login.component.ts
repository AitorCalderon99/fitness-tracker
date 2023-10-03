import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {UiService} from "../../shared/ui.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy{

  private spinnerSub = new Subscription();
  isLoading = false;

  constructor(private authService: AuthService, private uiService: UiService) {
  }

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', {validators: [Validators.required, Validators.email]}),
    password: new FormControl('', {validators: [Validators.required]}),
  });

  onFormSubmit(): void {
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    });
  }

  ngOnInit(): void {
    this.spinnerSub = this.uiService.loadingStateChanged.subscribe((isLoading: boolean) => this.isLoading = isLoading);
  }

  ngOnDestroy() {
    this.spinnerSub.unsubscribe();
  }
}
