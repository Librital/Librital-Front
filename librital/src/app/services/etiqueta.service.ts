import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Etiqueta} from "../models/etiqueta";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class EtiquetaService {

  constructor(private httpClient: HttpClient) { }

  public cargarTodasEtiquetasCustomUser(id_user: number) {
    return this.httpClient.get<any>(environment.apiUrl + 'api/etiqueta/obtenerTodasEtiquetasCustomUser/' + id_user);
  }


}
