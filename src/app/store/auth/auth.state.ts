import { Injectable } from '@angular/core';
import { State, Selector } from '@ngxs/store';
import { User } from '../../core/models/auth.model';

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
  @Selector() static token(state: AuthStateModel): string | null { return state.token; }
  @Selector() static user(state: AuthStateModel): User | null { return state.user; }
  @Selector() static isAuthenticated(state: AuthStateModel): boolean { return state.isAuthenticated; }
}
