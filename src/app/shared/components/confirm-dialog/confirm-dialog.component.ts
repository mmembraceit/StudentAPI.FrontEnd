import { Component } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [ConfirmDialogModule],
  template: `
    <p-confirmDialog
      [style]="{ width: '420px' }"
      acceptLabel="Sí, confirmar"
      rejectLabel="Cancelar"
      acceptButtonStyleClass="p-button-danger"
      rejectButtonStyleClass="p-button-text"
    />
  `
})
export class ConfirmDialogComponent {}
