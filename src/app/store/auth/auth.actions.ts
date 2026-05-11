import { LoginRequest } from '../../core/models/auth.model';

export class Login {
  static readonly type = '[Auth] Login';
  constructor(public payload: LoginRequest) {}
}

export class Logout {
  static readonly type = '[Auth] Logout';
}
