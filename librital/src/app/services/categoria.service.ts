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

}
