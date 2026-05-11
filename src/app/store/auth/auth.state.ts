import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { State, Action, Selector, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/auth.model';
import { Login, Logout } from './auth.actions';

export interface AuthStateModel {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: { token: null, user: null, isAuthenticated: false }
})
@Injectable()
export class AuthState {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  @Selector() static token(state: AuthStateModel): string | null { return state.token; }
  @Selector() static user(state: AuthStateModel): User | null { return state.user; }
  @Selector() static isAuthenticated(state: AuthStateModel): boolean { return state.isAuthenticated; }

  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, action: Login) {
    return this.authService.login(action.payload).pipe(
      tap(response => {
        ctx.patchState({
          token: response.token,
          user: response.user,
          isAuthenticated: true
        });
        this.router.navigate(['/students']);
      })
    );
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({ token: null, user: null, isAuthenticated: false });
    this.router.navigate(['/auth/login']);
  }
}
