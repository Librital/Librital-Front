import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {AutenticacionService} from "./autenticacion.service";
import {Observable} from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private autenticacionService:AutenticacionService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let request = req;

    request = req.clone({
      setHeaders: {
        //Autorizacion de tipo Bearer + token
        //El tipo de autorizacion depende del back
      }
    });
    return next.handle(request);
  }

}
