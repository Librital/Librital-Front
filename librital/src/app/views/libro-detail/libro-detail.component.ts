import {Component, ElementRef, ViewChild} from '@angular/core';
import {FooterComponent} from "../footer/footer.component";
import {ActivatedRoute, Router} from "@angular/router";
import {LibroService} from "../../services/libro.service";
import {environment} from "../../../environments/environment";
import {FormsModule} from "@angular/forms";
import {Categoria} from "../../models/categoria";
import {NgForOf, NgIf} from "@angular/common";
import {CategoriaService} from "../../services/categoria.service";
import {LoadingSpinnerComponent} from "../loading-spinner/loading-spinner.component";
import {Libro} from "../../models/libro";

@Component({
  selector: 'app-libro-detail',
  standalone: true,
  imports: [
    FooterComponent,
    FormsModule,
    NgForOf,
    LoadingSpinnerComponent,
    NgIf
  ],
  templateUrl: './libro-detail.component.html',
  styleUrl: './libro-detail.component.scss'
})
export class LibroDetailComponent {

  isLoading = false;

  hayImagenLocal = false;

  libro: any = {};

  tituloData = '';
  autorData = '';
  editorialData = '';
  fechaData = '';
  descripcionData = '';
  isbn13Data = '';
  isbn10Data = '';
  activoData = false;
  categoriaData = '';
  portadaData = '';

  listaGeneros: Categoria[] = [];

  archivoSeleccionadoFormData = new FormData();


  @ViewChild('fileInput') fileInput!: ElementRef;


  private sub: any;
  protected readonly decodeURIComponent = decodeURIComponent;
  protected readonly environment = environment;

  constructor(private activatedRoute: ActivatedRoute, private libroService: LibroService,
              private categoriaService: CategoriaService, private route: Router) { }


  ngOnInit(): void {

    window.scrollTo(0, 0);

    this.cargarInformacionLibroParam();

    this.obtenerTodasCategoriasLibroAdmin();
  }


  public cargarInformacionLibroParam() {

    this.isLoading = true;

    setTimeout(() => {
      this.sub = this.activatedRoute.params.subscribe(params => {
        const id = +params['id'];
        this.libroService.obtenerTodosLibrosActivosNoActivosAdmin(id).subscribe((data: any) => {

          if (data.message == 'Obtenido') {
            this.libro = data.libro;
            this.tituloData = this.libro.titulo;
            this.autorData = this.libro.autor;
            this.editorialData = this.libro.editorial;
            this.descripcionData = this.libro.descripcion;
            this.isbn13Data = this.libro.isbn13;
            this.isbn10Data = this.libro.isbn10;
            this.activoData = this.libro.es_activo;
            this.portadaData = this.libro.portada;

            let fechaNueva = this.libro.fecha.split('/');

            if (fechaNueva.length > 0) {
              this.fechaData = fechaNueva[2] + '-' + fechaNueva[1] + '-' + fechaNueva[0];
            } else {
              this.fechaData = data.fecha;
            }


            this.obtenerCategoriaLibroId();

          } else if (data.message == 'Error') {
            alert('Error al obtener el libro');
          }
          this.isLoading = false;
        });
      });
    }, 1000);
  }

  public obtenerTodasCategoriasLibroAdmin() {
    this.categoriaService.obtenerTodasCategoriasAdmin().subscribe((data: any) => {
      this.listaGeneros = data;
    });
  }


  public obtenerCategoriaLibroId() {
    this.categoriaService.obtenerCategoriaLibroAdmin(this.libro.id_libro).subscribe((data: any) => {

      if (data.message == 'Obtenido') {
        this.categoriaData = data.categoria.nombre;
      } else if (data.message == 'No encontrado') {
        this.categoriaData = data.categoria.nombre;
      }
    });
  }


  public subirLibroCoverLocal() {

    const fileInput = this.fileInput.nativeElement;

    const archivoSeleccionado = fileInput.files[0];

    if (archivoSeleccionado) {

      if (archivoSeleccionado.type.indexOf('image') < 0) {
        alert('El archivo seleccionado no es una imagen')
        //this.hayImagenLocal = false;
      } else {
       /* const formData = new FormData();
        formData.append('cover', archivoSeleccionado);

        this.archivoSeleccionadoFormData = formData;
*/
        this.hayImagenLocal = true;

        this.portadaData = URL.createObjectURL(archivoSeleccionado);
      }
    } else {
      console.log('No se ha seleccionado un archivo');
      this.hayImagenLocal = false;
    }

  }


  public cancelarCambios() {
    this.route.navigate(['/libro-admin'])
  }


  public comprobarCampos() {

    let tituloInput = document.getElementById('title') as HTMLInputElement;
    let autorInput = document.getElementById('autor') as HTMLInputElement;
    let editorialInput = document.getElementById('editorial') as HTMLInputElement;
    let fechaInput = document.getElementById('fecha') as HTMLInputElement;
    let descripcionInput = document.getElementById('desc') as HTMLTextAreaElement;
    let isbn13Input = document.getElementById('isbn13') as HTMLInputElement;
    let isbn10Input = document.getElementById('isbn10') as HTMLInputElement;
    let categoriaInput = document.getElementById('categorias') as HTMLSelectElement;
    let portadaInput = document.getElementById('portada') as HTMLImageElement;
    let portadaInput2 = document.getElementById('portada-local') as HTMLImageElement;
    let activoInput = document.getElementById('activo') as HTMLInputElement;


    let tipTitulo = <HTMLElement>(document.getElementById('tip-titulo'));
    let tipEditorial = <HTMLElement>(document.getElementById('tip-editorial'));
    let tipCategoria = <HTMLElement>(document.getElementById('tip-categoria'));
    let tipFecha = <HTMLElement>(document.getElementById('tip-fecha'));
    let tipIsbn = <HTMLElement>(document.getElementById('tip-isbn'));

    let camposCorrectos = true;
    let es_activo = true;


    if (tituloInput.value == '') {
      tipTitulo.style.color = 'red';
      tituloInput.placeholder = 'Campo obligatorio';
    } else {
      tipTitulo.style.color = '#333131b5';
      tituloInput.placeholder = '';
    }

    if (editorialInput.value == '') {
      tipEditorial.style.color = 'red';
      editorialInput.placeholder = 'Campo obligatorio';
    } else {
      tipEditorial.style.color = '#333131b5';
      editorialInput.placeholder = '';
    }

    if (isbn13Input.value == '' && isbn10Input.value == '') {
      tipIsbn.style.color = 'red';
      isbn13Input.placeholder = 'Un ISBN es obligatorio';
      isbn10Input.placeholder = 'Un ISBN es obligatorio';
    } else {
      tipIsbn.style.color = '#333131b5';
      isbn13Input.placeholder = '';
    }

    if (categoriaInput.value == '') {
      tipCategoria.style.color = 'red';
    } else {
      tipCategoria.style.color = '#333131b5';
    }

    if (fechaInput.value == '') {
      tipFecha.style.color = 'red';
    } else {
      tipFecha.style.color = '#333131b5';
    }


    if (tituloInput.value != '' && editorialInput.value != '' && fechaInput.value != '' && isbn13Input.value != '' && isbn10Input.value != '' && categoriaInput.value != '') {

      if (autorInput.value.length > 100) {
        alert('El autor no puede tener más de 100 caracteres');
        camposCorrectos = false;
      }

      if (isbn13Input.value != 'No ISBN') {
        if (isbn13Input.value.length != 13) {
          alert('El ISBN-13 debe tener 13 caracteres');
          camposCorrectos = false;
        }
      }

      if (isbn10Input.value != 'No ISBN') {
        if (isbn10Input.value.length != 10) {
          alert('El ISBN-10 debe tener 10 caracteres');
          camposCorrectos = false;
        }
      }


      if (camposCorrectos) {

        if (this.hayImagenLocal) {

          const fileInput = this.fileInput.nativeElement;
          const archivoSeleccionado = fileInput.files[0];

          const nombreArchivo = archivoSeleccionado.name +'_'+ new Date().getTime()+ '.png';

          this.archivoSeleccionadoFormData.append('cover', archivoSeleccionado, nombreArchivo);

        } else {
          this.archivoSeleccionadoFormData.append('cover', '');
        }

        let liboModificado = new Libro(tituloInput.value, autorInput.value, editorialInput.value, fechaInput.value, descripcionInput.value, '', isbn13Input.value, isbn10Input.value, this.activoData);
        let portadaLibro = this.archivoSeleccionadoFormData;
        let categoria = categoriaInput.value;

        this.guardarCambiosLibro(liboModificado, this.libro.id_libro, categoria, portadaLibro);
      }
    } else {
      alert('Faltan campos por completar');
    }

  }


  private guardarCambiosLibro(libro: Libro, id_libro: number, categoria: string, portada: FormData) {
    this.libroService.modificarLibro(libro, id_libro, categoria, portada).subscribe((data: any) => {

      if (data.message == 'Modificado') {
        alert('Libro modificado correctamente');
        this.route.navigate(['/libro-admin']);
      }

    });
  }


}
