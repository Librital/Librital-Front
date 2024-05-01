import {Component, ElementRef, HostListener, input, ViewChild} from '@angular/core';
import {FooterComponent} from "../footer/footer.component";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {LibroService} from "../../services/libro.service";
import {Libro} from "../../models/libro";
import {Router, RouterLink} from "@angular/router";
import {LoadingSpinnerComponent} from "../loading-spinner/loading-spinner.component";
import {SpinnerService} from "../../services/spinner.service";
import {NgxPaginationModule} from "ngx-pagination";

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [
    FooterComponent,
    NgIf,
    FormsModule,
    NgForOf,
    RouterLink,
    LoadingSpinnerComponent,
    NgxPaginationModule
  ],
  templateUrl: './buscador.component.html',
  styleUrl: './buscador.component.scss'
})
export class BuscadorComponent {

  isLoading = false;

  tieneContenido = false;
  valorBuscador: string = '';

  filtroGeneroSelected: boolean = false;
  filtroSelected: string = '';

  generoSelected: string = '';

  listaFiltroGeneral: string[] = ['Título', 'Autor', 'Género'];
  generos: string[] = ['Aventura', 'Ciencia Ficción', 'Fantasía', 'Romance', 'Terror', 'Thriller'];

  listaGenerosSelected: string[] = [];

  listaLibros: Libro[] = [];


  //paginacion
  numLibrosPerPage = 0;
  currentIndex = -1;
  paginaActual = 1;
  count = 0;
  numeroTotalLibros = 0;

  protected readonly decodeURIComponent = decodeURIComponent;



/*  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  private stream: MediaStream | undefined;*/

  constructor(private libroService: LibroService, private spinnerService: SpinnerService, private route: Router) { }

  ngOnInit() {

    this.isLoading = true;
    this.spinnerService.setOpacidad(0.8);
    this.obtenerNumPagina();
    this.obtenerLibrosBuscador();

  }

  public obtenerNumPagina() {

    if (this.libroService.obtenerPaginaActual() != null) {
      this.paginaActual = parseInt(this.libroService.obtenerPaginaActual()!);
    } else {
      console.log("Entra a guardar pag 1")
      this.libroService.almacenarPagActual(this.paginaActual);
    }
  }

  public obtenerLibrosBuscador() {

    this.isLoading = true;
    this.spinnerService.setOpacidad(0.8);
    setTimeout(() => {

      this.libroService.getLibros(this.paginaActual).subscribe((data: any) => {

        if (data.message == "Error") {
          alert('Error al obtener los libros. Vuelva a intentarlo más tarde.');
          this.isLoading = false;
        } else if (data.message == "Obtenido") {
          this.listaLibros = data.libros;
          this.numeroTotalLibros = data.total;
          this.numLibrosPerPage = data.librosPerPage;
        }
        this.isLoading = false;
      });
    }, 1000);


  }

  public comprobarTitulo(titulo : string) {
    if (titulo.length > 50) {
      return titulo.substring(0, 50) + '...';
    }
    return titulo;

  }


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


  public handlePageChange(event: number) {

    this.paginaActual = event;

    this.obtenerLibrosBuscador();

    if (this.libroService.obtenerPaginaActual() != null) {
      this.libroService.eliminarPaginaActual();
      this.libroService.almacenarPagActual(this.paginaActual);
    } else {
      this.libroService.almacenarPagActual(this.paginaActual);
    }

    window.scrollTo(0, 0);

  }

  public irLibroId(libro: any) {
    this.route.navigate(['/libro-info/', libro['id_libro']]);

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
