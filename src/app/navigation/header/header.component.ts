import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy{
  @Output() sideNavToggle = new EventEmitter<void>;
  isAuth: boolean | undefined;
  private authSubscription: Subscription | undefined;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authSubscription = this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
    })
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
  }

  onToggleSidenav() {
    this.sideNavToggle.emit();
  }

  onLogOut() {
    this.authService.logout();
  }
}
