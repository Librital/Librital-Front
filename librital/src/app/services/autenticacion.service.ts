import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  constructor(private http: HttpClient) { }

  public obtenerMensaje() {
    return this.http.get<any>("http://localhost:8000/librital/api/obtener_mensaje/");
  }

  public recibir(mensaje: string) {

    const csrfToken = this.getCsrfToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    });

    const requestBody = { mensaje };

    return this.http.post<any>('http://localhost:8000/librital/api/recibir/', requestBody, { headers });
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
