import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../auth.service";
import {AuthData} from "../auth-data.model";
import {UiService} from "../../shared/ui.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy{

  protected maxDate: Date | undefined;
  private spinnerSub = new Subscription();
  isLoading = false;


  constructor(private authService: AuthService, private uiService: UiService) {
  }

  ngOnInit() {
    this.spinnerSub = this.uiService.loadingStateChanged.subscribe((isLoading: boolean) => this.isLoading = isLoading);
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  onFormSubmit(form: NgForm) {
    const formData: AuthData = {
      email: form.value.email,
      password: form.value.password
    }
    this.authService.registerUser(formData);
  }

  ngOnDestroy(): void {
    this.spinnerSub?.unsubscribe();
  }
}
