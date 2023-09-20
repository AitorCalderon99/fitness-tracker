import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from "./auth.service";

export const trainingGuard = (): boolean => {
  const router = inject(Router);
  const authService = inject(AuthService)
  if (authService.isAuth()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
}
