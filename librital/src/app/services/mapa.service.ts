import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Mapa} from "../models/mapa";

@Injectable({
  providedIn: 'root'
})
export class MapaService {

  constructor(private httpClient: HttpClient) { }

  public obtenerTodosMarkersMapa() {
    return this.httpClient.get<any>(environment.apiUrl + "api/mapa/obtenerTodosMarkerMapa");
  }

  public addMarcadorMapaUser(punto: Mapa) {
    return this.httpClient.post<any>(environment.apiUrl + "api/mapa/addMarcadorMapaUser", {'punto': punto});

  }



  public obtenerMarkersUserMapa(id_user: number) {
    return this.httpClient.post<any>(environment.apiUrl + "api/mapa/obtenerMarkerUserMapa", {'id_user': id_user});
  }

  public desactivarPuntoMapaUser(id_marker: number, estado: boolean) {
    return this.httpClient.post<any>(environment.apiUrl + "api/mapa/desactivarPuntoMapaUser", {'id_marker': id_marker, 'estado': estado});
  }

  public obtenerTodosMarkersMapaAdmin() {
    return this.httpClient.get<any>(environment.apiUrl + "api/mapa/obtenerTodosMarkerMapaAdmin");
  }

  public buscarMarcadorPorLatLong(latitud: number, longitud: number) {
    return this.httpClient.post<any>(environment.apiUrl + "api/mapa/buscarMarcadorLatitudLongitud", {'latitud': latitud, 'longitud': longitud});

  }

  public actualizarPuntoMapa(id_marker: number, punto: Mapa) {
    return this.httpClient.post<any>(environment.apiUrl + "api/mapa/actualizarPuntoMapa", {'id_marker': id_marker,'punto': punto});

  }

  public eliminarPuntoMapa(id_marker: number) {
    return this.httpClient.post<any>(environment.apiUrl + "api/mapa/eliminarPuntoMapa", {'id_marker': id_marker});
  }

}
