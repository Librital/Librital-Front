import {Component, ElementRef, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {LoadingSpinnerComponent} from "../loading-spinner/loading-spinner.component";
import {SpinnerService} from "../../services/spinner.service";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {Application} from "@splinetool/runtime";
import {FooterComponent} from "../footer/footer.component";
import {LibroService} from "../../services/libro.service";
import {Libro} from "../../models/libro";
import {Router} from "@angular/router";

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
  listaLibrosNewArrivals2: Libro[] = [];


  listaGeneros: string[] = [
    'https://cdn-icons-png.flaticon.com/256/4289/4289411.png',
    'https://cdn-icons-png.flaticon.com/256/8511/8511575.png',
    'https://cdn-icons-png.flaticon.com/256/9764/9764185.png',
    'https://cdn-icons-png.flaticon.com/256/10096/10096579.png',
    'https://cdn-icons-png.flaticon.com/256/7143/7143843.png',
    'https://cdn-icons-png.flaticon.com/256/4961/4961572.png',
    'https://cdn-icons-png.flaticon.com/256/6347/6347139.png',
    'https://cdn-icons-png.flaticon.com/256/7649/7649385.png',
    'https://cdn-icons-png.flaticon.com/256/9254/9254628.png',
    'https://cdn-icons-png.flaticon.com/512/4114/4114757.png',
    'https://cdn-icons-png.flaticon.com/256/10541/10541811.png',
    'https://cdn-icons-png.flaticon.com/256/4359/4359772.png',
    'https://cdn-icons-png.flaticon.com/256/9496/9496794.png',
    'https://cdn-icons-png.flaticon.com/256/7578/7578697.png',

  ]

  constructor(private spinnerService: SpinnerService, private libroService: LibroService, private route: Router) {}


  ngOnInit() {
    this.comprobarExistePag();
    this.obtenerBestRatings();
    this.obtenerNewArrivalsLibros();
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

  public irAInfoLibro(id_libro: number) {
    console.log("id_libro: ", id_libro);
    this.route.navigate(['/libro-info/', id_libro]);
  }



  public comprobarExistePag() {

    if (this.libroService.obtenerPaginaActual() != null) {
      this.libroService.eliminarPaginaActual();
    }
  }


   reducirOpacidad(): void {
    this.isLoading = true;
    this.spinnerService.setOpacidad(0.9);
    setTimeout(() => {
      this.isLoading = false;
    }, 5000);
  }


  protected readonly Array = Array;
  protected readonly decodeURIComponent = decodeURIComponent;
}
