import { Component } from '@angular/core';
import {FooterComponent} from "../footer/footer.component";
import {NgForOf, NgIf} from "@angular/common";
import {LibroService} from "../../services/libro.service";
import {ActivatedRoute, NavigationStart, Router} from "@angular/router";
import {Libro} from "../../models/libro";
import {UsuarioService} from "../../services/usuario.service";
import {AutenticacionService} from "../../services/autenticacion.service";
import {Usuario} from "../../models/usuario";
import {Categoria} from "../../models/categoria";

@Component({
  selector: 'app-libro-info',
  standalone: true,
  imports: [
    FooterComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './libro-info.component.html',
  styleUrl: './libro-info.component.scss'
})
export class LibroInfoComponent {

  listaGeneros: any[] = [];
  categoriaLibro = new Categoria("","");
  masCategorias: boolean = false;
  categoriasVacia: boolean = false;

  listaEtiquetas: string[] = ['A comprar', 'Vendido'];

  valoracionLibro:number = 0;
  valoracionUserLibro: number = 0;
  numResenas: number = 0;

  existeDescripcion: boolean = false;
  existeAutor: boolean = false;
  existeEditorial: boolean = false;
  existeFecha: boolean = false;
  existeIsbn10: boolean = false;
  existeIsbn13: boolean = false;

  usuarioLogueado: boolean = false;
  usuario: Usuario = new Usuario('', '', '', '', '', 1, 0, 1, '');

  libroMostrar: Libro = new Libro('','','', '', '', '', '', '', true);




  private sub: any;
  protected readonly decodeURIComponent = decodeURIComponent;






  constructor(private libroService: LibroService, private activatedRoute: ActivatedRoute, private route: Router, private authService: AutenticacionService) {}

  ngOnInit() {
    this.cargarLibroSelected();
  }


  public comprobarUsuarioLogin() {
    if (this.authService.comprobarUsuarioLogueado()) {
      this.usuarioLogueado = true;
      let usuarioLoad = this.authService.obtenerUsuarioDelToken();
      if (usuarioLoad != null) {
        this.usuario = usuarioLoad;
        this.cargarInfoLibroUsuario();
      }
    }
  }


  public cargarLibroSelected() {

    window.scrollTo(0, 0);

    this.sub = this.activatedRoute.params.subscribe(params => {
      const id = +params['id'];
      this.libroService.obtenerLibroPorId(id).subscribe((data: any) => {

        if (data.message == "Error") {
          alert("No se ha encontrado el libro");
          this.route.navigate(['/buscador']);
        } else if (data.message == "Obtenido") {
          this.libroMostrar = data.libro;

          if (this.libroMostrar.descripcion != null && this.libroMostrar.descripcion != '') {
            this.existeDescripcion = true;
          }

          if (this.libroMostrar.autor != null && this.libroMostrar.autor != '') {
            this.existeAutor = true;
          }

          if (this.libroMostrar.editorial != null && this.libroMostrar.editorial != '') {
            this.existeEditorial = true;
          }

          if (this.libroMostrar.fecha != null && this.libroMostrar.fecha != '') {
            this.existeFecha = true;
          }

          if (this.libroMostrar.isbn10 != null && this.libroMostrar.isbn10 != '' && this.libroMostrar.isbn10 != 'No ISBN') {
            this.existeIsbn10 = true;
          }

          if (this.libroMostrar.isbn13 != null && this.libroMostrar.isbn13 != '' && this.libroMostrar.isbn13 != 'No ISBN') {
            this.existeIsbn13 = true;
          }

          this.comprobarUsuarioLogin();
          this.cargarInfoLibro();
          this.cargarCategoriasLibro();
        }
      })
    });
  }

  /**
   * Carga la información del libro seleccionado como el número de valoraciones, la media de las mismas, generos
   *
   * @param id_libro
   * @private
   */
  private cargarInfoLibro() {
    this.libroService.obtenerInfoLibro(this.libroMostrar.id_libro!).subscribe((data: any) => {
      if (data.message == "Obtenido") {
        this.valoracionLibro = data.mediaLibro;
        this.numResenas = data.numResenas;
      } else if (data.message = "Sin valoracion") {
        this.valoracionLibro = 0;
        this.numResenas = 0;
      }
    });
  }

  public cargarCategoriasLibro() {
    this.libroService.obtenerCategoriasLibro(this.libroMostrar.id_libro!).subscribe((data: any) => {
      if (data.message == "Obtenido") {

        this.categoriaLibro = data.categoria
        this.masCategorias = false;
        this.categoriasVacia = false;

      } else if (data.message == "Obtenida lista") {

        this.masCategorias = true;
        this.categoriasVacia = false;

        this.listaGeneros = data.categoria;

      } else if (data.message == "No encontrado") {

        this.masCategorias = false;
        this.categoriasVacia = true;

        this.listaGeneros = [];

      }
    });
  }

  private cargarInfoLibroUsuario() {
    this.libroService.obtenerValoracionLibroUser(this.usuario.id!, this.libroMostrar.id_libro!).subscribe((data: any) => {
      if (data.message == "Obtenido") {
        this.valoracionUserLibro = data.userLibro.calificacion;
      }
    });
  }

  public valorarLibro(valoracion: number) {

    if (!this.usuarioLogueado) {
      alert("Debes estar logueado para poder realizar esta acción");
    } else {
      this.valoracionUserLibro = valoracion;

      if (this.usuario.id != null && this.libroMostrar.id_libro != null) {
        this.libroService.guardarValoracionLibroUser(this.usuario.id, this.libroMostrar.id_libro, valoracion).subscribe((data: any) => {
          if (data.message == "Guardado") {
            alert("Valoración guardada correctamente");
            this.cargarInfoLibro();
          } else if (data.message == "Error") {
            alert("Error al guardar la valoración");
          }
        });
      } else {
        alert("Error al guardar la valoración");
      }
    }

  }

  public eliminarValoracion() {

    if (this.valoracionUserLibro != 0) {
      this.libroService.eliminarValoracionLibroUser(this.usuario.id!, this.libroMostrar.id_libro!, 0).subscribe((data: any) => {
        if (data.message == "Eliminado") {
          alert("Se ha eliminado la valoración");
          this.valoracionUserLibro = 0;
          this.cargarInfoLibro();
        } else if (data.message = "Error") {
          alert("Error al eliminar la valoración");
        }
      });
    } else {
      alert("No tienes una valoración guardada para este libro");
    }

  }





}
