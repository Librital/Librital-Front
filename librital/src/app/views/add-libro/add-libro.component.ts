import {Component, ElementRef, ViewChild} from '@angular/core';
import {LibroService} from "../../services/libro.service";
import {CamaraService} from "../../services/camara.service";
import {NavigationStart, Router} from "@angular/router";
import {SpinnerService} from "../../services/spinner.service";
import {Subscription} from "rxjs";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {LoadingSpinnerComponent} from "../loading-spinner/loading-spinner.component";
import {Categoria} from "../../models/categoria";
import {CategoriaService} from "../../services/categoria.service";
import {FooterComponent} from "../footer/footer.component";
import {Libro} from "../../models/libro";
import {AutenticacionService} from "../../services/autenticacion.service";





@Component({
  selector: 'app-add-libro',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    LoadingSpinnerComponent,
    NgForOf,
    FooterComponent,
  ],
  templateUrl: './add-libro.component.html',
  styleUrl: './add-libro.component.scss'
})
export class AddLibroComponent {

  isLoading = false;
  camaraEncendida = false;
  btnCamaraOn = false;
  tieneImagenPortada = false;
  tieneFotoSacada = false;

  displayCameras = true;

  escanearCover = false;


  @ViewChild('camara') videoElement!: ElementRef;
  @ViewChild('canvas') canvas!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  portadaLibro = ""
  tituloData = '';
  autorData = '';
  editorialData = '';
  categoriaData = '';
  fechaData = '';
  isbnData = '';

  generos: Categoria[] = [];

  public captures: Array<any> = [];
  private navigationStartSubscription!: Subscription;
  private captureInterval: any; // Variable para almacenar el intervalo de captura

  inputTituloVacio = false;
  inputEditorialVacio = false;
  inputCategoriaVacia = false;
  inputFechaVacia = false;
  inputIsbnVacio = false;


  constructor(private libroService: LibroService, private spinnerService: SpinnerService,
              private cameraService: CamaraService, private router: Router, private categoriaService: CategoriaService,
              private authService: AutenticacionService) {
    this.captures = [];
    this.navigationStartSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.camaraEncendida) {
          this.stopCamera();
        }
      }
    });
  }

  ngOnInit() {

    this.comprobarExistePag();
    this.comprobarExisteBusqueda();
    this.cargarTodasCategoriasAddLibro();

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

  public cargarTodasCategoriasAddLibro() {
    this.categoriaService.obtenerTodasCategorias().subscribe((data: Categoria[]) => {
      this.generos = data;
      console.log(data);
    });
  }


  ngOnDestroy(): void {
    this.navigationStartSubscription.unsubscribe();
    if (this.camaraEncendida) {
      this.stopCamera();
    }
  }


  public maximaFecha() {
    const hoy = new Date();
    const mes = hoy.getMonth() + 1;
    const dia = hoy.getDate();
    const anio = hoy.getFullYear();
    return `${anio}-${mes < 10 ? '0' + mes : mes}-${dia < 10 ? '0' + dia : dia}`;
  }


  public permitirEscaneoCover() {
    this.escanearCover = !this.escanearCover;
  }

  startCamera(): void {

    if (this.camaraEncendida) {
      console.log('Apagando la camara');
      this.camaraEncendida = false;
      this.stopCamera();
      this.btnCamaraOn = false;
      this.tieneFotoSacada = false;
    } else {
      console.log('Encendiendo cámara...');
      this.camaraEncendida = true;
      this.btnCamaraOn = true;
      this.tieneFotoSacada = true;

      this.displayCameras = true;
      this.tieneImagenPortada = false;


      navigator.mediaDevices.getUserMedia({video: true})
        .then(stream => {
          this.videoElement.nativeElement.srcObject = stream;
          this.videoElement.nativeElement.play();

          const canvas = this.canvas.nativeElement;
          const context = canvas.getContext('2d');

          context.clearRect(0, 0, canvas.width, canvas.height);
        })


      /*if (this.camaraEncendida) {
        this.stopCamera();
        this.camaraEncendida = false;
        this.tieneImagenPortada = false;
        this.tieneFotoSacada = false;
        this.btnCamaraOn = false;

        const canvas = this.canvas.nativeElement;
        const context = canvas.getContext('2d');
        const videoElement = this.videoElement.nativeElement;

        // Asegurarse de que el canvas tenga el mismo tamaño que el video
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;

        canvas.clearRect(0, 0, canvas.width, canvas.height);

      } else {
        this.camaraEncendida = true;
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(stream => {
            this.videoElement.nativeElement.srcObject = stream;
            this.videoElement.nativeElement.play();

            const canvas = this.canvas.nativeElement;
            const context = canvas.getContext('2d');

            context.clearRect(0, 0, canvas.width, canvas.height);



          })
      }
      */
    }
  }

  stopCamera(): void {
    const videoElement = this.videoElement.nativeElement;
    const stream = videoElement.srcObject as MediaStream;

    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoElement.srcObject = null;
    }
  }


  capturarFoto(): void {

    if (!this.camaraEncendida) {
      alert('Enciende la cámara antes de capturar una foto');
    } else {

      const canvas = this.canvas.nativeElement;
      const context = canvas.getContext('2d');
      const videoElement = this.videoElement.nativeElement;

      // Asegurarse de que el canvas tenga el mismo tamaño que el video
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      console.log(canvas.width, canvas.height);

      //canvas.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar el fotograma actual del video en el canvas
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      // Obtener la imagen del canvas como base64 y almacenarla en captures
      const imageData = canvas.toDataURL('image/png');
      this.captures.push(imageData);

      this.stopCamera();
      this.camaraEncendida = false;
      this.btnCamaraOn = false;

      // Convertir la imagen base64 a un blob
      const byteString = atob(imageData.split(',')[1]);
      const mimeString = imageData.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });

      const nombreArchivo = 'libro_' + Date.now() + '.png';

      // Crear un FormData y añadir la imagen como archivo
      const formData = new FormData();
      formData.append('cover', blob, nombreArchivo);

      if (this.escanearCover) {
        this.enviarImagen(formData);
      } else {
        console.log('Imagen capturada');
      }

    }

  }


  public enviarImagenLocal() {

    const fileInput = this.fileInput.nativeElement;

    const archivoSeleccionado = fileInput.files[0];

    if (archivoSeleccionado) {

      this.fileInput.nativeElement.value = '';

      if (archivoSeleccionado.type.indexOf('image') < 0) {
        alert('El archivo seleccionado no es una imagen')
      } else {
        const formData = new FormData();
        formData.append('cover', archivoSeleccionado);

        if (this.escanearCover) {
          this.enviarImagen(formData);
        } else {
          this.tieneImagenPortada = true;
          this.displayCameras = false;
          this.portadaLibro = URL.createObjectURL(archivoSeleccionado);
        }
      }
    } else {
      console.log("No se ha seleccionado ningún archivo");
    }
  }

  public enviarImagen(formData: FormData): void {

    this.isLoading = true;

    this.spinnerService.setOpacidad(0.8);

    setTimeout(() => {
      this.libroService.obtenerInfoLibroPorImagen(formData).subscribe((data: any) => {

        if (data.message == 'Encontrado') {

          this.tituloData = data.titulo;
          this.autorData = data.autor;
          this.editorialData = data.editorial;
          this.portadaLibro = data.image_url.replace('unsagfe ', '');

          this.tieneImagenPortada = true;
          this.camaraEncendida = false;
          this.tieneFotoSacada = false;
          this.displayCameras = false;
          this.btnCamaraOn = false;

          alert('Libro encontrado');

          if (data.isbn13 != "") {
            this.isbnData = data.isbn13;
          } else if (data.isbn10 != "") {
            this.isbnData = data.isbn10;
          }

          for (let i = 0; i < this.generos.length; i++) {
            if (this.generos[i].nombre == data.categoria) {
              this.categoriaData = this.generos[i].nombre;
            }
          }

          let fechaNueva = data.fecha.split('/');

          if (fechaNueva.length > 0) {
            this.fechaData = fechaNueva[2] + '-' + fechaNueva[1] + '-' + fechaNueva[0];
          } else {
            this.fechaData = data.fecha;
          }


        } else if (data.message == 'No encontrado') {
          this.tieneImagenPortada = false;
          this.camaraEncendida = true;
          this.tieneFotoSacada = true
          this.displayCameras = true;
          this.btnCamaraOn = false;

          this.tituloData = '';
          this.autorData = '';
          this.editorialData = '';
          this.categoriaData = '';
          this.fechaData = '';
          this.isbnData = '';


          this.stopCamera();
          alert('No se ha encontrado ningún libro');
        }
        this.isLoading = false;
      });
    }, 1000);
  }




  public addLibroBiblioteca() {

    let tituloInput = <HTMLInputElement>(document.getElementById('input-titulo'));
    let autorInput = <HTMLInputElement>(document.getElementById('input-autor'));
    let editorialInput = <HTMLInputElement>(document.getElementById('input-editorial'));
    let categoriaSelect = <HTMLSelectElement>(document.getElementById('select-categoria'));
    let fechaInput = <HTMLInputElement>(document.getElementById('input-fecha'));
    let inputIsbn = <HTMLInputElement>(document.getElementById('input-isbn'));

    let tipTitulo = <HTMLElement>(document.getElementById('tip-titulo'));
    let tipEditorial = <HTMLElement>(document.getElementById('tip-editorial'));
    let tipCategoria = <HTMLElement>(document.getElementById('tip-categoria'));
    let tipFecha = <HTMLElement>(document.getElementById('tip-fecha'));
    let tipIsbn = <HTMLElement>(document.getElementById('tip-isbn'));

    let camposCorrectos = true;


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

    if (inputIsbn.value == '') {
      tipIsbn.style.color = 'red';
      inputIsbn.placeholder = 'Campo obligatorio';
    } else {
      tipIsbn.style.color = '#333131b5';
      inputIsbn.placeholder = '';
    }

    if (categoriaSelect.value == '') {
      tipCategoria.style.color = 'red';
    } else {
      tipCategoria.style.color = '#333131b5';
    }

    if (fechaInput.value == '') {
      tipFecha.style.color = 'red';
    } else {
      tipFecha.style.color = '#333131b5';
    }



    if (tituloInput.value != '' && editorialInput.value != '' && fechaInput.value != '' && inputIsbn.value != '' && categoriaSelect.value != '') {

      console.log('Añadiendo libro a la biblioteca');

      if (autorInput.value != '') {
        if (autorInput.value.length > 100) {
          alert('El autor sobrepasa el límite de caracteres permitidos');
          camposCorrectos = false;
        }
      }

      if (inputIsbn.value.length > 13 || inputIsbn.value.length < 10) {
        alert('El formato del ISBN no es correcto');
        camposCorrectos = false;
      }


      if (camposCorrectos) {
        console.log("Todos campso correctos");

        let usuario = this.authService.obtenerUsuarioDelToken();

        let libroNuevo: Libro = new Libro('', '', '', '', '', '', '', '', true);
        let categoriaLibro = categoriaSelect.value;
        if (inputIsbn.value.length == 10) {
          libroNuevo = new Libro(tituloInput.value, autorInput.value, editorialInput.value, fechaInput.value, '', this.portadaLibro, 'No ISBN', inputIsbn.value, true);
        } else if (inputIsbn.value.length == 13) {
          libroNuevo = new Libro(tituloInput.value, autorInput.value, editorialInput.value, fechaInput.value, '', this.portadaLibro, inputIsbn.value, 'No ISBN', true);
        }

        this.libroService.addLibroNuevoBiblioteca(libroNuevo, categoriaLibro, usuario).subscribe((data: any) => {
          if (data.message == 'Guardado') {
            alert('Libro añadido a la biblioteca');
            //this.router.navigate(['/biblioteca']);
          } else if (data.message == 'Error') {
            alert('Error al añadir el libro a la biblioteca');
          }
        });

      }




    }


  }



}
