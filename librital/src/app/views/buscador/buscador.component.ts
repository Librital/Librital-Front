import {Component, ElementRef, HostListener, input, ViewChild} from '@angular/core';
import {FooterComponent} from "../footer/footer.component";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Libro} from "../../models/libro";

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [
    FooterComponent,
    NgIf,
    FormsModule,
    NgForOf
  ],
  templateUrl: './buscador.component.html',
  styleUrl: './buscador.component.scss'
})
export class BuscadorComponent {

  tieneContenido = false;
  valorBuscador: string = '';

  filtroGeneroSelected: boolean = false;
  filtroSelected: string = '';

  generoSelected: string = '';

  listaFiltroGeneral: string[] = ['Título', 'Autor', 'Género'];
  generos: string[] = ['Aventura', 'Ciencia Ficción', 'Fantasía', 'Romance', 'Terror', 'Thriller'];

  listaGenerosSelected: string[] = [];

  listaLibros: string[] = ['https://m.media-amazon.com/images/I/716ncIYKK3L._AC_UF1000,1000_QL80_.jpg',
    'https://m.media-amazon.com/images/I/41W7CaDtu8L._SY445_SX342_.jpg',
    'https://m.media-amazon.com/images/I/41Ucpdvdq8L._SY445_SX342_.jpg'];
  //listaLibros: Libro[] = [];


/*  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  private stream: MediaStream | undefined;*/

  constructor() { }


  public onEnter() {

    this.valorBuscador = this.valorBuscador.trim();

    if (this.valorBuscador != '') {
      this.buscarLibros();
    } else {
      alert('No hay nada que buscar.');
      this.tieneContenido = false;
    }
  }

  public activarBorrarContenido() {
    this.tieneContenido = this.valorBuscador.length > 0;
  }

  public borrarBuscador() {
    this.valorBuscador = '';
    this.tieneContenido = false;
  }

  public cambioFiltro() {

    this.filtroSelected = (<HTMLInputElement>document.getElementById('select-filtro-buscador')).value;

    console.log(this.filtroSelected);

    if (this.filtroSelected === 'Género') {
      this.filtroGeneroSelected = true;
    } else {
      this.listaGenerosSelected = [];
      this.filtroGeneroSelected = false;
    }
  }

  public addGenero() {

    if (this.generoSelected != '') {
      if (!(this.listaGenerosSelected.includes(this.generoSelected))) {
        this.listaGenerosSelected.push(this.generoSelected);
      }
    }
  }

  public eliminarGenero(genero: string) {
    this.listaGenerosSelected = this.listaGenerosSelected.filter((generoSelected) => generoSelected !== genero);
  }


  public buscarLibros() {
    alert('Buscando...');
    //this.valorBuscador = '';
  }


/*  async startCamera(): Promise<void> {
    const video = this.videoElement.nativeElement;
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = this.stream;
      video.play();
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
    }
  }

  stopCamera(): void {
    if (this.stream) {
      const videoTracks = this.stream.getVideoTracks();
      videoTracks.forEach(track => track.stop());
      this.stream = undefined;
      this.videoElement.nativeElement.srcObject = null;
    }
  }*/
}
