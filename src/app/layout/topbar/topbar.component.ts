import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngxs/store';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { AuthState } from '../../store/auth/auth.state';
import { Logout } from '../../store/auth/auth.actions';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [AsyncPipe, ButtonModule, AvatarModule, TooltipModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
  private readonly store = inject(Store);

  user$ = this.store.select(AuthState.user);

  logout(): void {
    this.store.dispatch(new Logout());
  }
}
