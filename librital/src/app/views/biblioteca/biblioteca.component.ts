import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";

import {AddLibroComponent} from "../add-libro/add-libro.component";
import {FooterComponent} from "../footer/footer.component";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {LibroService} from "../../services/libro.service";
import {Etiqueta} from "../../models/etiqueta";
import {AutenticacionService} from "../../services/autenticacion.service";
import {Usuario} from "../../models/usuario";
import {EtiquetaService} from "../../services/etiqueta.service";
import {Libro} from "../../models/libro";
import {environment} from "../../../environments/environment";
import {NgxPaginationModule} from "ngx-pagination";
import {LoadingSpinnerComponent} from "../loading-spinner/loading-spinner.component";
import {SpinnerService} from "../../services/spinner.service";
import {ToastService} from "../../services/toast.service";

@Component({
  selector: 'app-biblioteca',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
    FooterComponent,
    NgClass,
    RouterLink,
    RouterLinkActive,
    NgxPaginationModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './biblioteca.component.html',
  styleUrl: './biblioteca.component.scss'
})
export class BibliotecaComponent {

  isLoading = false;

  tieneContenido = false;

  listaEtiquetasDefault: string[] = ['Todos', 'Favoritos', 'Actualmente leyendo', 'Pendientes', 'Ya leídos', 'Con valoración'];

  listaEtiquetasCustom: Etiqueta[] = [];

  librosUsuario: Libro[] = [];

  usuarioLogueado = new Usuario('', '', '', '', '', 1, 0, 1, '');


  etiquetaSeleccionada = 'Todos'
  etiquetaDefaultSeleccionada = 'Todos';
  tipoEtiqueta = 'default'
  valorBuscarInput = '';

  hayEtiquetasUser = false;
  hayLibrosBibliotecaUser = false;

/*  numLibrosPerPage = 0;
  currentIndex = -1;
  paginaActual = 1;
  count = 0;
  numeroTotalLibros = 0;*/

  numLibrosPerPage = 0;
  currentIndex = -1;
  paginaActual = 1;
  count = 0;
  numeroTotalLibros = 0;



  protected readonly environment = environment;
  protected readonly decodeURIComponent = decodeURIComponent;


  constructor(private libroService: LibroService, private authService: AutenticacionService, private etiequetaService: EtiquetaService,
              private router: Router, private spinnerService: SpinnerService, private toastService: ToastService) { }

  ngOnInit() {

    window.scrollTo(0, 0);

    this.comprobarExistePag();
    this.comprobarExisteBusqueda();

    this.comprobarUsuarioLogueado();

    this.cargarEtiquetasCustomUsuario();
    this.cargarTodosLibrosUser();

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


  public activarBorrarContenido() {
    this.tieneContenido = this.valorBuscarInput.length > 0;
  }

  public borrarBuscador() {
    this.valorBuscarInput = '';
    this.tieneContenido = false;
  }




  public comprobarUsuarioLogueado() {
    if (this.authService.comprobarUsuarioLogueado()) {
      this.usuarioLogueado = this.authService.obtenerUsuarioDelToken();
    } else {
      this.toastService.clear();
      this.toastService.add({severity:'error', summary: 'Error', detail: 'No has iniciado sesión'});
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1000);

    }
  }

  public cargarEtiquetasCustomUsuario() {

    if (this.authService.comprobarUsuarioLogueado()) {

      let usuario: Usuario;

      usuario = this.authService.obtenerUsuarioDelToken();

      this.etiequetaService.cargarTodasEtiquetasCustomUser(usuario.id!).subscribe((data: any) => {
        console.log(data);
        if (data.message == 'No hay etiquetas') {
          this.listaEtiquetasCustom = [];
          this.hayEtiquetasUser = false;
        } else if (data.message == 'Etiquetas cargadas') {
          this.listaEtiquetasCustom = data.etiquetas;
          this.hayEtiquetasUser = true;
        }
      });
    }
  }

  public cargarTodosLibrosUser() {

    this.isLoading = true;

    this.spinnerService.setOpacidad(0.8);

    setTimeout(() => {
      this.libroService.cargarTodosLibrosUsuario(this.usuarioLogueado.id!, this.paginaActual, this.etiquetaSeleccionada, this.tipoEtiqueta, this.valorBuscarInput).subscribe((data: any) => {
        if (data.message == 'No hay libros') {
          this.librosUsuario = [];
          this.hayLibrosBibliotecaUser = true;
        } else if (data.message == 'Obtenidos') {
          this.librosUsuario = data.libros;
          this.numLibrosPerPage = data.numLibroPerPage;
          this.numeroTotalLibros = data.totalLibros;
          this.hayLibrosBibliotecaUser = false;

        }
      });
      this.isLoading = false;
    }, 1000);
  }


  public irLibroId(id_libro: any) {
    this.router.navigate(['/libro-info/', id_libro]);

  }


  public pulsarEtiquetaFiltrarLibrosUser(etiqueta: string) {

    this.etiquetaSeleccionada = etiqueta;
    this.etiquetaDefaultSeleccionada = etiqueta;

    // Comprobar si es una etiqueta default o custom
    if (this.listaEtiquetasDefault.includes(etiqueta)) {
      this.tipoEtiqueta = 'default';
    } else {
      this.tipoEtiqueta = 'custom';
    }
    this.paginaActual = 1;
    this.cargarTodosLibrosUser();

  }

  public onEnter() {

    if (this.valorBuscarInput != '') {
      this.etiquetaSeleccionada = '';
      this.tipoEtiqueta = 'busqueda';
    } else {
      this.etiquetaSeleccionada = 'Todos';
      this.tipoEtiqueta = 'default';
    }

    this.paginaActual = 1;
    this.cargarTodosLibrosUser();
  }



  public handlePageChange(event: number) {

    this.paginaActual = event;

    this.cargarTodosLibrosUser();

    window.scrollTo(0, 0);

  }

}
