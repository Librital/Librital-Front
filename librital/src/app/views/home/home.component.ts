import {Component, ElementRef, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {LoadingSpinnerComponent} from "../loading-spinner/loading-spinner.component";
import {SpinnerService} from "../../services/spinner.service";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {Application} from "@splinetool/runtime";
import {FooterComponent} from "../footer/footer.component";
import {LibroService} from "../../services/libro.service";
import {Libro} from "../../models/libro";
import {Router, RouterLink} from "@angular/router";
import {Categoria} from "../../models/categoria";
import {CategoriaService} from "../../services/categoria.service";
import {environment} from "../../../environments/environment";
import {AutenticacionService} from "../../services/autenticacion.service";
import {Usuario} from "../../models/usuario";


import { ToastModule } from 'primeng/toast';
import {Button} from "primeng/button";
import {Ripple} from "primeng/ripple";
import {MessageService} from "primeng/api";
import {ToastService} from "../../services/toast.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    LoadingSpinnerComponent,
    NgIf,
    FooterComponent,
    NgForOf,
    NgClass,
    RouterLink,
    ToastModule,
    Button,
    Ripple,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  isLoading: boolean = false;

  listaLibrosTendencia: any [] = [];
  listaLibrosNewArrivals: Libro[] = [];
  listaLibrosRecomendaciones: any [] = [];
  noHayLibrosRecomendados = true;

  listaCategorias: Categoria[] = [];

  usuarioLogueado = false;
  usuario = new Usuario('', '', '', '', '', 1, 0, 1, '');




  protected readonly decodeURIComponent = decodeURIComponent;


  constructor(private spinnerService: SpinnerService, private libroService: LibroService, private route: Router,
              private categoriaService: CategoriaService, private authService: AutenticacionService,
              private toastService: ToastService) {}


  ngOnInit() {
    this.comprobarExistePag();
    this.comprobarExisteBusqueda();
    this.comprobarUsuarioLogueado();
    this.obtenerBestRatings();
    this.obtenerNewArrivalsLibros();
    this.obtenerCategoriasLista();
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


  public comprobarUsuarioLogueado() {
    if (this.authService.comprobarUsuarioLogueado()) {
      this.usuarioLogueado = true;

      this.usuario = this.authService.obtenerUsuarioDelToken();

      this.obtenerRecomendacionesUserLibro();

    } else {
      this.usuarioLogueado = false;
      this.noHayLibrosRecomendados = false;
    }
  }

  public obtenerNewArrivalsLibros() {
    this.libroService.obtenerNewArrivals().subscribe((data) => {
      if (data.message == "Obtenido") {
        this.listaLibrosNewArrivals = data.libros;
        console.log(this.listaLibrosNewArrivals);
      }
    });
  }


  public obtenerBestRatings() {
    this.libroService.obtenerMejoresLibros().subscribe((data) => {

      if (data.message == "Obtenido") {
        this.listaLibrosTendencia = data.libros;

      }
    });
  }

  public obtenerRecomendacionesUserLibro() {
    this.libroService.obtenerRecomendacionesCategoriaUserLibro(this.usuario.id!).subscribe((data: any) => {

      if (data.message == 'Obtenido') {
        this.listaLibrosRecomendaciones = data.libros;
        this.noHayLibrosRecomendados = false
      } else if (data.message == 'No hay libros valorados') {
        this.listaLibrosRecomendaciones = [];
        this.noHayLibrosRecomendados = true;
      }

    });
  }



  public obtenerCategoriasLista() {
    this.categoriaService.obtenerTodasCategorias().subscribe((data) => {
        this.listaCategorias = data;
        console.log("Categorias: ", this.listaCategorias);
    });
  }


  public irAInfoLibro(id_libro: number) {
    this.route.navigate(['/libro-info/', id_libro]);
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


   reducirOpacidad(): void {
    this.isLoading = true;
    this.spinnerService.setOpacidad(0.9);
    setTimeout(() => {
      this.isLoading = false;
    }, 5000);
  }




  public irBuscadorGenero(nombre_categoria: string) {
    this.route.navigate(['/buscador/', nombre_categoria]);
  }


  public irBibliotecaUsuario() {

    if (this.usuarioLogueado) {
      this.route.navigate(['/biblioteca']);
    } else {
      this.toastService.clear();
      this.toastService.add({severity: 'info', summary: 'Información', detail:  'Debes tener una cuenta para poder sumergirte en tu biblioteca',
        life: 5000});
      setTimeout(() => {
        this.route.navigate(['/login']);
      }, 1000);

    }

  }


  protected readonly environment = environment;
}
