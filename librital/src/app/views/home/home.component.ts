import {Component, ElementRef, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {LoadingSpinnerComponent} from "../loading-spinner/loading-spinner.component";
import {SpinnerService} from "../../services/spinner.service";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {Application} from "@splinetool/runtime";
import {FooterComponent} from "../footer/footer.component";
import {LibroService} from "../../services/libro.service";
import {Libro} from "../../models/libro";
import {Router} from "@angular/router";
import {Categoria} from "../../models/categoria";
import {CategoriaService} from "../../services/categoria.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    LoadingSpinnerComponent,
    NgIf,
    FooterComponent,
    NgForOf,
    NgClass,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  isLoading: boolean = false;

  listaLibrosTendencia: any [] = [];
  listaLibrosNewArrivals: Libro[] = [];


  listaCategorias: Categoria[] = [];



  protected readonly decodeURIComponent = decodeURIComponent;


  constructor(private spinnerService: SpinnerService, private libroService: LibroService, private route: Router, private categoriaService: CategoriaService) {}


  ngOnInit() {
    this.comprobarExistePag();
    this.comprobarExisteBusqueda();
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


  public obtenerNewArrivalsLibros() {
    this.libroService.obtenerNewArrivals().subscribe((data) => {
      if (data.message == "Obtenido") {
        this.listaLibrosNewArrivals = data.libros;
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

  public obtenerCategoriasLista() {
    this.categoriaService.obtenerTodasCategorias().subscribe((data) => {
        this.listaCategorias = data;
        console.log("Categorias: ", this.listaCategorias);
    });
  }


  public irAInfoLibro(id_libro: number) {
    console.log("id_libro: ", id_libro);
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



}
