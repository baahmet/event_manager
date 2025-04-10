import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    // Si déjà connecté, rediriger vers profile
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
