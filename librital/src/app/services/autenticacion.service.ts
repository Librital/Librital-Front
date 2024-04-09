import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import { jwtDecode } from "jwt-decode";
import {Usuario} from "../models/usuario";

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {

  constructor(private http: HttpClient) { }


  public guardarToken(token: string) {
    localStorage.setItem('token', token);
  }

  public getToken() {
    return localStorage.getItem('token');
  }

  private getTokenRefresh() {
    return localStorage.getItem('refresh');
  }

  public eliminarToken() {
    localStorage.removeItem('token');
  }

  public obtenerUsuarioDelToken() {
    let usuario = null;
    if (this.getToken() != null) {
      const token = this.getToken();
      const decodedToken = jwtDecode(token!) as any;
      usuario = decodedToken.usuario;
    }
    return usuario;
  }

  public logout() {
    if (this.getToken() != null) {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh');
    }
  }

  public refrescarToken() {
    const token = this.getTokenRefresh();
    return this.http.post<any>(environment.apiUrlToken+ "api/token/refresh/", {'refresh': token});
  }

  public guardarRefreshToken(token: string) {
    localStorage.setItem('refresh', token);
  }


  public comprobarUsuarioLogueado() {
    let logueado = false

    if (this.getToken() != null) {
      logueado = true;
    }
    return logueado;
  }


  public comprobarExpToken() {
    const token = this.getToken();
    const decodedToken = jwtDecode(token!) as any;
    let exp = (decodedToken.exp)*1000;
    let now = Date.now();
    let diff = exp - now;
    console.log(exp);
    console.log(now);
    console.log(diff);
    if (diff > 0) {
      return true
    } else {
      return false
    }
  }


  public comprobarAdministrador() {
    let es_admin = false

    if (this.getToken() != null) {
      let usuario = this.obtenerUsuarioDelToken();
      if (usuario != null) {
        if (usuario.tipo == 3) {
          es_admin = true;
        }
      }
    }
    return es_admin;
  }














/*
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
  }*/

}
