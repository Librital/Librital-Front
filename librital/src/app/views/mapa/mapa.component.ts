import {Component, ElementRef, ViewChild} from '@angular/core';
import * as L from 'leaflet';
import {MapaService} from "../../services/mapa.service";
import {FooterComponent} from "../footer/footer.component";
import {AutenticacionService} from "../../services/autenticacion.service";
import {Mapa} from "../../models/mapa";
import {ToastService} from "../../services/toast.service";

L.Icon.Default.imagePath = 'assets/leaflet/bookcrossing.png';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [
    FooterComponent
  ],
  templateUrl: './mapa.component.html',
  styleUrl: './mapa.component.scss'
})
export class MapaComponent {

  private map!: L.Map;
  private markers: L.Marker[] = [];

  // Icono personalizado
  private markerIcon = L.icon({
    iconUrl: 'assets/leaflet/bookcrossing.png',
    iconSize: [25, 41],
    iconAnchor: [13, 41],
    popupAnchor: [0, -41]
  });


  constructor(private mapaService: MapaService, private authService: AutenticacionService, private toastService: ToastService) { }

  ngOnInit(): void {

    window.scrollTo(0, 0);

  }

  ngAfterViewInit(): void {
    this.initMap();
    this.addMarkers();
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

    this.mapaService.obtenerTodosMarkersMapa().subscribe((data: any) => {
      if (data.message == 'Obtenidos') {
        console.log(data.puntosMapa);
        this.markers = data.puntosMapa.map((punto: any) => {

          const marker = L.marker([punto.latitud, punto.longitud], {
            icon: this.markerIcon
          });

          if (punto.descripcion == '') {
            marker.bindPopup(`<b>${punto.titulo}</b>`);
          } else {
            marker.bindPopup(`<b>${punto.titulo}</b><br>${punto.descripcion}`);
          }

          marker.addTo(this.map);
        });
      } else {
        this.toastService.clear();
        this.toastService.add({severity:'error', summary: 'Error', detail: 'Error al obtener los marcadores'});
      }
    });
  }


  public addMarkerMap() {

    if (!this.authService.comprobarUsuarioLogueado()) {
      this.toastService.clear();
      this.toastService.add({severity:'info', summary: 'Información', detail: 'Debes estar logueado para añadir un marcador'});
    } else {

      let usuario = this.authService.obtenerUsuarioDelToken();

      let inputTitulo = document.getElementById('titulo') as HTMLInputElement;
      let inputDescripcion = document.getElementById('descripcion') as HTMLInputElement;
      let inputLat = document.getElementById('latitud') as HTMLInputElement;
      let inputLng = document.getElementById('longitud') as HTMLInputElement;

      const titulo = inputTitulo.value;
      const descripcion = inputDescripcion.value;
      const latitud = parseFloat(inputLat.value);
      const longitud = parseFloat(inputLng.value);

      if (titulo == '') {
        inputTitulo.placeholder = 'Campo Obligatorio';
      } else {
        inputTitulo.placeholder = '';
      }

      if (isNaN(latitud)) {
        inputLat.placeholder = 'Campo Obligatorio';
      } else {
        inputLat.placeholder = '';
      }

      if (isNaN(longitud)) {
        inputLng.placeholder = 'Campo Obligatorio';
      } else {
        inputLng.placeholder = '';
      }


      if (titulo == '' && isNaN(latitud) && isNaN(longitud)) {
        console.log('Campos obligatorios');
      } else {
        const marker = L.marker([latitud, longitud], {
          icon: this.markerIcon
        });

        if (descripcion == '') {
          marker.bindPopup(`<b>${titulo}</b>`);
        } else {
          marker.bindPopup(`<b>${titulo}</b><br>${descripcion}`);
        }

        let mapa = new Mapa(titulo, descripcion, latitud, longitud, true, usuario.id);

        this.mapaService.addMarcadorMapaUser(mapa).subscribe((data: any) => {

          if (data.message == 'Correcto') {
            this.toastService.clear();
            this.toastService.add({severity:'success', detail: 'Marcador añadido correctamente'});

            marker.addTo(this.map);

            this.markers.push(marker);

            inputTitulo.value = '';
            inputDescripcion.value = '';
            inputLat.value = '';
            inputLng.value = '';


          } else if (data.message == 'Ya existe') {
            this.toastService.clear();
            this.toastService.add({severity:'error', summary: 'Error', detail: 'Ya existe un marcador en esa posición'});
          }
        });
      }
    }
  }



}
