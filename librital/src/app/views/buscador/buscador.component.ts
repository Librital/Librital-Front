import {Component, ElementRef, HostListener, input, ViewChild} from '@angular/core';
import {FooterComponent} from "../footer/footer.component";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {LibroService} from "../../services/libro.service";
import {Libro} from "../../models/libro";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {LoadingSpinnerComponent} from "../loading-spinner/loading-spinner.component";
import {SpinnerService} from "../../services/spinner.service";
import {NgxPaginationModule} from "ngx-pagination";
import {CategoriaService} from "../../services/categoria.service";
import {Categoria} from "../../models/categoria";

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

  buscadorDisabled = false;

  filtroGeneroSelected: boolean = false;
  filtroSelected: string = '';

  generoSelected: string = '';

  listaFiltroGeneral: string[] = ['Título', 'Autor', 'Género'];
  generos: Categoria[] = [];

  listaGenerosSelected: string[] = [];

  listaLibros: Libro[] = [];


  //paginacion
  numLibrosPerPage = 0;
  currentIndex = -1;
  paginaActual = 1;
  count = 0;
  numeroTotalLibros = 0;

  protected readonly decodeURIComponent = decodeURIComponent;

  private sub: any;

  constructor(private libroService: LibroService, private categoriaService: CategoriaService,
              private spinnerService: SpinnerService, private route: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.isLoading = true;
    this.spinnerService.setOpacidad(0.8);
    this.obtenerCategoriasBuscador();
    this.obtenerNumPagina();
    this.buscarCategoriaParamsHome();
    this.obtenerLibrosBuscador();

  }

  public obtenerNumPagina() {

    if (this.libroService.obtenerPaginaActual() != null) {
      this.paginaActual = parseInt(this.libroService.obtenerPaginaActual()!);
    } else {
      this.libroService.almacenarPagActual(this.paginaActual);
    }

    if (this.libroService.obtenerFiltroBusqueda() != null) {
      this.filtroSelected = this.libroService.obtenerFiltroBusqueda()!;
      console.log("filtro busqueda" + this.filtroSelected);
    }

    if (this.libroService.obtenerGeneroBusqueda() != null) {
      this.generoSelected = this.libroService.obtenerGeneroBusqueda()!;
      console.log("genero busqueda" + this.generoSelected);
    }

    if (this.libroService.obtenerValorBusqueda() != null) {
      this.valorBuscador = this.libroService.obtenerValorBusqueda()!;
      console.log("valor busqueda" + this.valorBuscador);
    }
  }

  public obtenerLibrosBuscador() {

    this.isLoading = true;
    this.spinnerService.setOpacidad(0.8);

    setTimeout(() => {

      this.libroService.getLibros(this.paginaActual, this.filtroSelected, this.valorBuscador, this.generoSelected).subscribe((data: any) => {

        if (data.message == "Error") {
          alert('Error al obtener los libros. Vuelva a intentarlo más tarde.');
          this.isLoading = false;
        } else if (data.message == "Obtenido") {

          if (data.libros.length == 0) {
            alert('No se han encontrado libros con los criterios de búsqueda seleccionados.');
            this.listaLibros = [];
          } else {
            this.listaLibros = data.libros;
            console.log(this.listaLibros);
            this.numeroTotalLibros = data.total;
            this.numLibrosPerPage = data.librosPerPage;
          }
        }
        this.isLoading = false;
      });
    }, 1000);

/*    if (this.valorBuscador != '') {
      this.paginaActual = 1;
      this.libroService.eliminarPaginaActual();
      this.libroService.almacenarPagActual(this.paginaActual);
    } else if (this.listaGenerosSelected.length > 0 && this.listaGenerosSelected.filter((genero) => genero !== '').length > 0) {
      this.libroService.eliminarPaginaActual();
      this.libroService.almacenarPagActual(this.paginaActual);
    }*/


  }


  public capturarSeleccion() {

    if (this.filtroSelected == 'titulo') {
      this.filtroGeneroSelected = false;
      this.buscadorDisabled = false;
    } else if (this.filtroSelected == 'autor') {
      this.filtroGeneroSelected = false;
      this.buscadorDisabled = false;
    } else if (this.filtroSelected == 'categoria') {
      this.filtroGeneroSelected = true;
      this.buscadorDisabled = true;
      this.valorBuscador = '';
    } else if (this.filtroSelected == 'isbn') {
      this.filtroGeneroSelected = false;
      this.buscadorDisabled = false;
    } else if (this.filtroSelected == ''){
      this.filtroGeneroSelected = false;
      this.buscadorDisabled = false;
    }
  }




  public onEnter() {

    if (this.filtroSelected == '') {
      this.paginaActual = 1;
      this.generoSelected = ''
      this.libroService.eliminarPaginaActual();
      this.libroService.almacenarPagActual(this.paginaActual);

      this.libroService.eliminarBusqueda();

      this.obtenerLibrosBuscador();
    } else if (this.filtroSelected == 'titulo') {
      if (this.valorBuscador != '') {
        this.paginaActual = 1;
        this.generoSelected = ''
        this.libroService.eliminarPaginaActual();
        this.libroService.almacenarPagActual(this.paginaActual);
        this.obtenerLibrosBuscador();

        this.libroService.eliminarBusqueda();

        this.libroService.guardarBusqueda(this.filtroSelected, this.generoSelected, this.valorBuscador);

      } else {
        alert('Introduzca un título.');
      }
    } else if (this.filtroSelected == 'autor') {
      if (this.valorBuscador != '') {
        this.paginaActual = 1;
        this.generoSelected = ''
        this.libroService.eliminarPaginaActual();
        this.libroService.almacenarPagActual(this.paginaActual);
        this.obtenerLibrosBuscador();

        this.libroService.eliminarBusqueda();

        this.libroService.guardarBusqueda(this.filtroSelected, this.generoSelected, this.valorBuscador);

      } else {
        alert('Introduzca un autor.');
      }
    } else if (this.filtroSelected == 'isbn') {

      if (this.valorBuscador != '') {

        if (this.valorBuscador.length == 13 || this.valorBuscador.length == 10) {
          this.paginaActual = 1;
          this.generoSelected = ''
          this.libroService.eliminarPaginaActual();
          this.libroService.almacenarPagActual(this.paginaActual);
          this.obtenerLibrosBuscador();

          this.libroService.eliminarBusqueda();

          this.libroService.guardarBusqueda(this.filtroSelected, this.generoSelected, this.valorBuscador);

        } else {
          alert('Introduzca un ISBN válido.');
        }
      } else {
        alert('Introduzca un ISBN.');
      }
    } else if (this.filtroSelected == 'categoria') {
      if (this.generoSelected != '') {

        this.paginaActual = 1;
        this.libroService.eliminarPaginaActual();
        this.libroService.almacenarPagActual(this.paginaActual);

        this.libroService.eliminarBusqueda();

        this.libroService.guardarBusqueda(this.filtroSelected, this.generoSelected, this.valorBuscador);

        this.obtenerLibrosBuscador();
      } else {
        alert('Seleccione un género.');
      }
    }
  }



  public comprobarTitulo(titulo : string) {
    if (titulo.length > 50) {
      return titulo.substring(0, 50) + '...';
    }
    return titulo;
  }

  public comprobarAutor(autor: string) {
    if (autor.length > 30) {
      return autor.substring(0, 30) + '...';
    }
    return autor;
  }



  public obtenerCategoriasBuscador() {
    this.categoriaService.obtenerTodasCategorias().subscribe((data: Categoria[]) => {
      this.generos = data;
    });
  }








  public activarBorrarContenido() {
    this.tieneContenido = this.valorBuscador.length > 0;
  }

  public borrarBuscador() {
    this.valorBuscador = '';
    this.tieneContenido = false;
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


  public buscarCategoriaParamsHome() {

    window.scrollTo(0, 0);

    this.sub = this.activatedRoute.params.subscribe(params => {
      const categoria = params['categoria'];

      if (categoria) {
        console.log("existe categoria" + categoria);
        this.generoSelected = categoria;
        this.filtroSelected = 'categoria';
      } else {

        if (this.libroService.obtenerFiltroBusqueda() == null) {
          this.generoSelected = '';
          this.filtroSelected = '';
        }
      }
    });
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
