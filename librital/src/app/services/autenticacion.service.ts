import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  constructor(private http: HttpClient) { }

  public obtenerMensaje() {
    return this.http.get<any>( environment.apiUrl + "api/usuario/");
  }

  public recibir(mensaje: {
    nombre: string;
  }) {

    return this.http.post<any>(environment.apiUrl + 'api/librital/', mensaje);
  }

  private getCsrfToken(): string {
    const csrfCookie = document.cookie.split(';').find(c => c.trim().startsWith('csrftoken='));
    if (!csrfCookie) {
      console.error('CSRF token not found in cookies.');
      return '';
    }
    return csrfCookie.split('=')[1];
  }

}
