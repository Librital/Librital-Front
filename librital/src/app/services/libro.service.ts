import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Libro} from "../models/libro";

@Injectable({
  providedIn: 'root'
})
export class LibroService {

  constructor(private httpClient: HttpClient) { }


  public obtenerMejoresLibros() {
    return this.httpClient.get<any>(environment.apiUrl + "api/libro_usuario/obtenerMejoresLibros");
  }

  public obtenerNewArrivals() {
  return this.httpClient.get<any>(environment.apiUrl + "api/libro/obtenerNewArrivals");
  }


  public almacenarPagActual(pagina: number) {
    localStorage.setItem('paginaActual', pagina.toString());
  }

  public obtenerPaginaActual() {

    if (localStorage.getItem('paginaActual') == null) {
      return null;
    } else {
      return localStorage.getItem('paginaActual');
    }
  }

  public eliminarPaginaActual() {
    localStorage.removeItem('paginaActual');
  }


  public getLibros(page: number) {
    return this.httpClient.post<any>(environment.apiUrl + "api/libro/obtenerLibros", { "pagina": page });
  }

  public obtenerLibroPorId(id: number) {
    return this.httpClient.get<any>(environment.apiUrl + "api/libro/obtenerLibroId/" + id);
  }

  public guardarValoracionLibroUser(id_user: number, id_libro: number, valoracion: number) {
    return this.httpClient.post<any>(environment.apiUrl + "api/libro_usuario/saveUserLibro", { "id_user": id_user, "id_libro": id_libro, "valoracion": valoracion });
  }

  public eliminarValoracionLibroUser(id_user: number, id_libro: number, valoracion: number) {
    return this.httpClient.post<any>(environment.apiUrl + "api/libro_usuario/eliminarValoracionUsuario", { "id_user": id_user, "id_libro": id_libro, "valoracion": valoracion });
  }

  public obtenerValoracionLibroUser(id_user: number, id_libro: number) {
    return this.httpClient.post<any>(environment.apiUrl + "api/libro_usuario/cargarInfoLibroUser", { "id_user": id_user, "id_libro": id_libro });
  }

  public obtenerInfoLibro(id_libro: number) {
    return this.httpClient.post<any>(environment.apiUrl + "api/libro_usuario/cargarInfoLibro", {'id_libro': id_libro});
  }

  public obtenerCategoriasLibro(id_libro: number) {
    return this.httpClient.post<any>(environment.apiUrl + "api/libro_categoria/obtenerCategoriaLibro", {'id_libro': id_libro});
  }
}
