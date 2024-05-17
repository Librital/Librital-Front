import { Component } from '@angular/core';
import * as L from 'leaflet';
import {MapaService} from "../../services/mapa.service";
import {FooterComponent} from "../footer/footer.component";
import {AutenticacionService} from "../../services/autenticacion.service";
import {Mapa} from "../../models/mapa";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {LibroService} from "../../services/libro.service";

L.Icon.Default.imagePath = 'assets/leaflet/bookcrossing.png';

@Component({
  selector: 'app-mapa-admin',
  standalone: true,
  imports: [
    FooterComponent,
    FormsModule,
    NgIf
  ],
  templateUrl: './mapa-admin.component.html',
  styleUrl: './mapa-admin.component.scss'
})
export class MapaAdminComponent {

  private map!: L.Map;
  private markers: L.Marker[] = [];

  private markerIcon = L.icon({
    iconUrl: 'assets/leaflet/bookcrossing.png',
    iconSize: [25, 41],
    iconAnchor: [13, 41],
    popupAnchor: [0, -41]
  });


  puntoSeleccionado = false;
  puntoActivo = false;

  marcadorSelected = new Mapa('', '', 0, 0, true, 0);



  constructor(private mapaService: MapaService, private authService: AutenticacionService, private libroService: LibroService) { }

  ngOnInit(): void {
    this.comprobarExistePag();
    this.comprobarExisteBusqueda();


    window.scrollTo(0, 0);

  }

  ngAfterViewInit(): void {
    this.initMap();
    this.addMarkers();
  }




  public comprobarExistePag() {

    if (this.libroService.obtenerPaginaActual() != null) {
      this.libroService.eliminarPaginaActual();
    }
  }

  public comprobarExisteBusqueda() {
    if (this.libroService.obtenerFiltroBusqueda() != null) {
      this.libroService.eliminarBusqueda();
    }
  }


  private initMap(): void {
    this.map = L.map('map', {
      center: [39.37, -2.5],
      zoom: 6
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    // Capturar eventos de clic en el mapa
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const latLng = e.latlng;

      let inputLat = document.getElementById('latitud') as HTMLInputElement;
      let inputLng = document.getElementById('longitud') as HTMLInputElement;

      inputLat.value = latLng.lat.toString();
      inputLng.value = latLng.lng.toString();

    });
  }

  private addMarkers() {

    this.mapaService.obtenerTodosMarkersMapaAdmin().subscribe((data: any) => {
      if (data.message == 'Obtenidos') {
        this.markers = data.puntosMapa.map((punto: any) => {

          const marker = L.marker([punto.latitud, punto.longitud], {
            icon: this.markerIcon
          });

          if (punto.descripcion == '') {
            marker.bindPopup(`
                <div class="popup-content">
                    <b>${punto.titulo}</b>
                </div>
            `);
          } else {
            marker.bindPopup(`
                <div class="popup-content">
                    <b>${punto.titulo}</b>
                    <br>${punto.descripcion}<br>
                </div>
            `);
          }

          marker.addTo(this.map);

          marker.on('popupopen', () => {
            const datosMarcador = marker.getLatLng();
            this.rellenarInfoPunto(datosMarcador.lat, datosMarcador.lng);
          });


        });
      } else if ('No hay puntos en el mapa'){
          console.log('No hay puntos en el mapa');
      }
    });
  }


  public rellenarInfoPunto(latitud: number, longitud: number) {

    let inputTitulo = document.getElementById('titulo') as HTMLInputElement;
    let inputDescripcion = document.getElementById('descripcion') as HTMLTextAreaElement;
    let activo = document.getElementById('activo') as HTMLInputElement;
    let lat = document.getElementById('latitud') as HTMLInputElement;
    let lng = document.getElementById('longitud') as HTMLInputElement;

    let inputLat = document.getElementById('latitud') as HTMLInputElement;
    let inputLng = document.getElementById('longitud') as HTMLInputElement;

    inputLat.value = latitud.toString();
    inputLng.value = longitud.toString();

    this.mapaService.buscarMarcadorPorLatLong(latitud, longitud).subscribe((data: any) => {

      if (data.message == 'Obtenido') {
        inputTitulo.value = data.marcador.titulo;
        inputDescripcion.value = data.marcador.descripcion;
        lat.value = data.marcador.latitud;
        lng.value = data.marcador.longitud;

        this.puntoSeleccionado = true;
        this.puntoActivo = data.marcador.activo;

        this.marcadorSelected = data.marcador;

      }

    });
  }


  public guardarCambiosMarcador() {

    let inputTitulo = document.getElementById('titulo') as HTMLInputElement;
    let inputDescripcion = document.getElementById('descripcion') as HTMLTextAreaElement;
    let activo = document.getElementById('activo') as HTMLInputElement;
    let lat = document.getElementById('latitud') as HTMLInputElement;
    let lng = document.getElementById('longitud') as HTMLInputElement;

    if (inputTitulo.value == '') {
      inputTitulo.placeholder = 'Campo Obligatorio';
    }

    if (lat.value == '') {
      lat.placeholder = 'Campo Obligatorio';
    }

    if (lng.value == '') {
      lng.placeholder = 'Campo Obligatorio';
    }

    if (inputTitulo.value != '' && lat.value != '' && lng.value != '') {

      let nuevoPuntoActualizado = new Mapa(inputTitulo.value, inputDescripcion.value, parseFloat(lat.value), parseFloat(lng.value), this.puntoActivo, this.marcadorSelected.id_usuario);

      this.mapaService.actualizarPuntoMapa(this.marcadorSelected.id_marker!, nuevoPuntoActualizado).subscribe((data: any) => {
        if (data.message == 'Actualizado') {
          this.puntoSeleccionado = false;
          this.puntoActivo = false;
          this.marcadorSelected = new Mapa('', '', 0, 0, true, 0);
          inputTitulo.value = '';
          inputDescripcion.value = '';
          lat.value = '';
          lng.value = '';

          this.addMarkers();

          alert('Marcador actualizado correctamente');
        }
      });
    }

  }


  public eliminarMarcadorMapa() {

    let inputTitulo = document.getElementById('titulo') as HTMLInputElement;
    let inputDescripcion = document.getElementById('descripcion') as HTMLTextAreaElement;
    let lat = document.getElementById('latitud') as HTMLInputElement;
    let lng = document.getElementById('longitud') as HTMLInputElement;

    this.mapaService.eliminarPuntoMapa(this.marcadorSelected.id_marker!).subscribe((data: any) => {

      if (data.message == 'Eliminado') {
        this.puntoSeleccionado = false;
        this.puntoActivo = false;
        this.marcadorSelected = new Mapa('', '', 0, 0, true, 0);

        inputTitulo.value = '';
        inputDescripcion.value = '';
        lat.value = '';
        lng.value = '';

        this.addMarkers();

        alert('Marcador eliminado correctamente');
      }

    });

  }

}
