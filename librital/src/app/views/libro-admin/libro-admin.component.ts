import { Component } from '@angular/core';
import {environment} from "../../../environments/environment";
import {NgForOf, NgIf} from "@angular/common";
import {NgxPaginationModule} from "ngx-pagination";
import {LibroService} from "../../services/libro.service";
import {SpinnerService} from "../../services/spinner.service";
import {LoadingSpinnerComponent} from "../loading-spinner/loading-spinner.component";
import {FormsModule} from "@angular/forms";
import {FooterComponent} from "../footer/footer.component";
import {Router} from "@angular/router";
import {ToastService} from "../../services/toast.service";

@Component({
  selector: 'app-libro-admin',
  standalone: true,
  imports: [
    NgForOf,
    NgxPaginationModule,
    LoadingSpinnerComponent,
    NgIf,
    FormsModule,
    FooterComponent
  ],
  templateUrl: './libro-admin.component.html',
  styleUrl: './libro-admin.component.scss'
})
export class LibroAdminComponent {

  protected readonly environment = environment;
  protected readonly decodeURIComponent = decodeURIComponent;

  isLoading = false;

  listaLibros: any[]= [];

  tieneContenido = false;
  libroBuscar = '';

  //paginacion
  numLibrosPerPage = 0;
  currentIndex = -1;
  paginaActual = 1;
  count = 0;
  numeroTotalLibros = 0;


  constructor(private libroService: LibroService, private spinnerService: SpinnerService, private route: Router,
              private toastService: ToastService) { }



  ngOnInit() {

    this.comprobarExistePag();
    this.comprobarExisteBusqueda();

    this.obtenerLibrosActivosNoActivos();

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



  public comprobarTitulo(titulo : string) {
    if (titulo.length > 40) {
      return titulo.substring(0, 40) + '...';
    }
    return titulo;
  }

  public comprobarAutor(autor: string) {
    if (autor.length > 30) {
      return autor.substring(0, 30) + '...';
    }
    return autor;
  }


  public activarBorrarContenido() {
    this.tieneContenido = this.libroBuscar.length > 0;
  }

  public borrarBuscador() {
    this.libroBuscar = '';
    this.tieneContenido = false;
  }

  public obtenerLibrosActivosNoActivos() {

    this.isLoading = true;

    this.spinnerService.setOpacidad(0.8);

    setTimeout(() => {
      this.libroService.obtenerTodosLibrosActivosNoActivos(this.paginaActual, this.libroBuscar).subscribe((data: any) => {

        if (data.message == 'Obtenido') {
          this.listaLibros = data.libros;
          this.numeroTotalLibros = data.numLibros;
          this.numLibrosPerPage = data.numMostrar;
        } else{
          this.listaLibros = [];
          this.toastService.clear();
          this.toastService.add({severity:'error', summary: 'Error', detail: 'No se han podido obtener los libros'});
        }
        this.isLoading = false;
      });
    }, 1000);
  }


  public onEnter() {
    this.paginaActual = 1;

    this.obtenerLibrosActivosNoActivos();
  }


  public irEditarInfoLibro(id_libro: number) {
    this.route.navigate(['/libro-detail/', id_libro]);
  }




  public handlePageChange(event: number): void {

    window.scrollTo(0, 0);

    this.paginaActual = event;

    this.obtenerLibrosActivosNoActivos();
  }

}
