import {ElementRef, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Usuario} from "../models/usuario";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private httpClient: HttpClient) {
  }

  public registrarUsuario(usuario: Usuario) {
    return this.httpClient.post<any>(environment.apiUrl + "api/usuario/registrarUsuario", usuario);

  }

  public loginUsuario(usuario: Usuario) {
    return this.httpClient.post<any>(environment.apiUrl + "api/token", usuario);
  }

  public actualizarInformacionUsuario(usuario: Usuario, emailInicial: string) {
    return this.httpClient.put<any>(environment.apiUrl + "api/usuario/actualizarInfoUsuario", {
      'usuario': usuario,
      'emailInicial': emailInicial
    });
  }

  public cambiarPassword(usuario: Usuario, passwordInicial: string) {
    return this.httpClient.put<any>(environment.apiUrl + "api/usuario/cambiarPasswordUsuario", {
      'usuario': usuario,
      'passwordInicial': passwordInicial
    });
  }

  public cambiarImagenPerfil(usuario: Usuario) {
    return this.httpClient.put<any>(environment.apiUrl + "api/usuario/cambiarImagenPerfil", usuario);
  }

}

