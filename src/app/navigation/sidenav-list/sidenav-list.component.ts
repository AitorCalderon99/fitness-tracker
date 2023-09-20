import {Component, EventEmitter, Output} from '@angular/core';
import {Subscription} from "rxjs";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent {

  @Output() closeSideNav = new EventEmitter<void>;
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

  onCloseSidenav() {
    this.closeSideNav.emit();
  }

}
