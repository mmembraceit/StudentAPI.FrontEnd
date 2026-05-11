import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const store = inject(Store);
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          import('../../store/auth/auth.actions').then(({ Logout }) => {
            store.dispatch(new Logout());
          });
          router.navigate(['/auth/login']);
          break;
        case 403:
          messageService.add({ severity: 'error', summary: 'Acceso denegado', detail: 'No tienes permisos para realizar esta acción.', life: 4000 });
          break;
        case 404:
          messageService.add({ severity: 'warn', summary: 'No encontrado', detail: 'El recurso solicitado no existe.', life: 4000 });
          break;
        case 500:
          messageService.add({ severity: 'error', summary: 'Error del servidor', detail: 'Ocurrió un error interno. Intenta de nuevo.', life: 4000 });
          break;
      }
      return throwError(() => error);
    })
  );
};
