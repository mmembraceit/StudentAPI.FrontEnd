import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [AsyncPipe, ProgressBarModule],
  template: `
    @if (isLoading$ | async) {
      <p-progressBar mode="indeterminate" [style]="{ height: '3px' }" />
    }
  `,
  styles: [`
    :host {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 9999;
    }
  `]
})
export class LoadingSpinnerComponent {
  isLoading$ = inject(LoadingService).isLoading$;
}
