import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AutenticacionService} from "../services/autenticacion.service";
import {ToastService} from "../services/toast.service";

export const adminGuard: CanActivateFn = (route, state) => {

  const autenticacionService = inject(AutenticacionService);
  const toastService = inject(ToastService);
  const router = inject(Router);

  if (autenticacionService.getToken() != null) {
    if (autenticacionService.obtenerUsuarioDelToken().tipo == 3) {
      return true;
    } else {
      router.navigate(['/']);
      return false;
    }
  } else {
    toastService.clear();
    toastService.add({severity: 'info', summary: 'Información', detail: 'No has iniciado sesion'})
    setTimeout(() => {
      router.navigate(['/login']);
    }, 1000);
    return false;
  }
};
