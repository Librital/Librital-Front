import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Libro} from "../models/libro";
import {Etiqueta} from "../models/etiqueta";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LibroService {

  private actualizarEtiquetasUser = new Subject();
  actualizarEtiquetasUser$ = this.actualizarEtiquetasUser.asObservable();

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


  public guardarBusqueda(filtro: string, genero: string, valor: string) {
    localStorage.setItem('filtro', filtro);
    localStorage.setItem('genero', genero);
    localStorage.setItem('valor', valor);
  }

  public obtenerFiltroBusqueda() {
    return localStorage.getItem('filtro');
  }

  public obtenerGeneroBusqueda() {
    return localStorage.getItem('genero');
  }

  public obtenerValorBusqueda() {
    return localStorage.getItem('valor');
  }

  public eliminarBusqueda() {
    localStorage.removeItem('filtro');
    localStorage.removeItem('genero');
    localStorage.removeItem('valor');
  }



  public getLibros(page: number, filtro: string, valorBuscar: string, genero: string) {
    return this.httpClient.post<any>(environment.apiUrl + "api/libro/obtenerLibros", { "pagina": page, "filtro": filtro, "valorBuscar": valorBuscar, "genero": genero });
  }

  public obtenerLibroPorId(id: number) {
    return this.httpClient.get<any>(environment.apiUrl + "api/libro/obtenerLibroId/" + id+'/');
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

  public obtenerLibroPorScanIsbn(isbn: string) {
    return this.httpClient.post<any>(environment.apiUrl + "api/libro/identificarISBN", {'isbn': isbn});
  }


  public cargarTodasEtiquetasDefaultUserLibro(id_user: number, id_libro: number) {
    return this.httpClient.post<any>(environment.apiUrl + "api/libro_usuario/obtenerEtiquetasDefaultUserLibro", { "id_user": id_user, "id_libro": id_libro });
  }

  public addFavoritoLibro(id_user: number, id_libro: number) {
    return this.httpClient.post<any>(environment.apiUrl + "api/libro_usuario/addFavoritoLibroUser", { "id_user": id_user, "id_libro": id_libro });

  }

  public addReadLater(id_user: number, id_libro: number) {
    return this.httpClient.post<any>(environment.apiUrl + "api/libro_usuario/addReadLaterUserLibro", { "id_user": id_user, "id_libro": id_libro });

  }

  public addTerminadoLeer(id_user: number, id_libro: number) {
    return this.httpClient.post<any>(environment.apiUrl + "api/libro_usuario/addTerminadoLeerUserLibro", { "id_user": id_user, "id_libro": id_libro });
  }

  public addActualmenteLeyendo(id_user: number, id_libro: number) {
    return this.httpClient.post<any>(environment.apiUrl + "api/libro_usuario/addActualmenteLeyendoUserLibro", { "id_user": id_user, "id_libro": id_libro });

  }

  public addEnBibliotecaLibroUser(id_user: number, id_libro: number) {
    return this.httpClient.post<any>(environment.apiUrl + "api/libro_usuario/addBibliotecaUserLibro", { "id_user": id_user, "id_libro": id_libro });
  }


  public cargarEtiquetasCustomUserLibro(id_user: number, id_libro: number) {
    return this.httpClient.post<any>(environment.apiUrl + "api/etiqueta/obtenerEtiquetasCustomUserLibro", { "id_user": id_user, "id_libro": id_libro });

  }

  public addEtiquetaUserLibro(etiqueta: Etiqueta) {
    return this.httpClient.post<any>(environment.apiUrl + "api/etiqueta/addEtiquetaUserLibro", {"etiqueta": etiqueta}).subscribe(
      (data:any) => {

        if (data.message == "Guardado") {
          this.actualizarEtiquetasUser.next(data.etiquetas);
        } else if (data.message == "Ya existe") {
          alert('La etiqueta ya existe');
        }
      }
    );

  }

  public removeEtiquetaUserLibro(etiqueta: Etiqueta) {
    return this.httpClient.post<any>(environment.apiUrl + "api/etiqueta/removeEtiquetaCustomUserLibro", {"etiqueta": etiqueta}).subscribe(
      (data:any) => {
        if (data.message == "Eliminado") {
          this.actualizarEtiquetasUser.next(data.etiquetas);
        } else if (data.message == "Error") {
          alert('Error al eliminar la etiqueta');
        }
      }
    );
  }


  public obtenerInfoLibroPorImagen(formData: FormData) {

    return this.httpClient.post<any>(environment.apiUrl + "api/image/procesarImagenLibro", formData);
  }


  public addLibroNuevoBiblioteca(libro: Libro, nombre_categoria: string, usuario: string) {
    return this.httpClient.post<any>(environment.apiUrl + "api/libro/addLibroNuevoBiblioteca", {"libro": libro, "categoria": nombre_categoria, 'usuario': usuario});
  }


}
