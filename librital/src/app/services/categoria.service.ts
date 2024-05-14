import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Categoria} from "../models/categoria";

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private http: HttpClient) { }


  public obtenerTodasCategorias() {
    return this.http.get<Categoria[]>(environment.apiUrl + "api/categoria/obtenerCategorias");
  }

  public obtenerLibrosPerCategoria() {
    return this.http.get<any>(environment.apiUrl + "api/categoria/obtenerLibrosPerCategoria");
  }

  public obtenerBestCategorias() {
    return this.http.get<any>(environment.apiUrl + "api/categoria/obtenerBestCategorias");
  }


  public obtenerTodasCategoriasAdmin() {
    return this.http.get<Categoria[]>(environment.apiUrl + "api/categoria/obtenerCategoriasActivasNoActivasAdmin");
  }

  public obtenerCategoriaLibroAdmin(id_libro: number) {
    return this.http.post<any>(environment.apiUrl + "api/libro_categoria/obtenerCategoriaLibroAdmin", {'id': id_libro});
  }


}
