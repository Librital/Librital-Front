import { HttpInterceptorFn } from '@angular/common/http';
import { AutenticacionService } from "../services/autenticacion.service";
import {inject} from "@angular/core";


export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {

  const autenticacionService = inject(AutenticacionService);

  let request = req;

  if (autenticacionService.getToken()) {

    request = req.clone({
      setHeaders: {
        Authorization: `Bearer ${autenticacionService.getToken()}`
      }
    });
  }
  return next(request);
};
