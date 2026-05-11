import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from '../../store/auth/auth.state';

export const roleGuard: CanActivateFn = (route, _state) => {
  const store = inject(Store);
  const router = inject(Router);

  const requiredRoles: string[] = route.data['roles'] ?? [];
  const user = store.selectSnapshot(AuthState.user);

  if (!user || !requiredRoles.includes(user.role)) {
    return router.createUrlTree(['/students']);
  }

  return true;
};
