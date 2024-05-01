import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AutenticacionService} from "../services/autenticacion.service";

export const adminGuard: CanActivateFn = (route, state) => {

  const autenticacionService = inject(AutenticacionService);
  const router = inject(Router);

  if (autenticacionService.getToken() != null) {
    if (autenticacionService.obtenerUsuarioDelToken().tipo == 3) {
      return true;
    } else {
      router.navigate(['/']);
      return false;
    }
  } else {
    alert("No has iniciado sesion");
    router.navigate(['/login']);
    return false;
  }
};
