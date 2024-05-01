import {Component, ElementRef, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {LoadingSpinnerComponent} from "../loading-spinner/loading-spinner.component";
import {AsyncPipe, JsonPipe, NgIf} from "@angular/common";
import {LOAD_WASM, NgxScannerQrcodeModule} from 'ngx-scanner-qrcode';
import {ZXingScannerComponent, ZXingScannerModule} from '@zxing/ngx-scanner';
import {Result} from '@zxing/library';
import {BarcodeFormat} from "html5-qrcode/third_party/zxing-js.umd";

LOAD_WASM().subscribe();

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [
    LoadingSpinnerComponent,
    NgIf,
    NgxScannerQrcodeModule,
    JsonPipe,
    AsyncPipe,
    ZXingScannerModule
  ],
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.scss'
})
export class CameraComponent {

  isLoading: boolean = false;

  @ViewChild('camara') videoElement!: ElementRef;
  @ViewChild('canvas') canvas!: ElementRef;

  public captures: Array<any> = [];
  private navigationStartSubscription!: Subscription;
  private captureInterval: any; // Variable para almacenar el intervalo de captura




/*
  constructor(private spinnerService: SpinnerService, private cameraService: CamaraService, private router: Router
  ) {
    this.captures = [];
    this.navigationStartSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.stopCamera();
      }
    });
  }

  ngOnDestroy(): void {
    this.navigationStartSubscription.unsubscribe();
    this.stopCamera();
    this.stopCaptureInterval(); // Detener el intervalo al destruir el componente
  }

  ngOnInit(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.startCamera();
      this.isLoading = false;
      this.startCaptureInterval(); // Iniciar intervalo de captura al inicializar el componente
    }, 2000);

  }

  startCamera(): void {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.videoElement.nativeElement.srcObject = stream;
        this.videoElement.nativeElement.play();
      })
      .catch(error => {
        console.error('Error al acceder a la cámara:', error);
        alert('Error al acceder a la cámara');
      });
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

  startCaptureInterval(): void {
    this.captureInterval = setInterval(() => {
      this.capturarFoto();
    }, 100); // Capturar cada 1 segundos (1000 milisegundos)
  }

  stopCaptureInterval(): void {
    clearInterval(this.captureInterval); // Detener el intervalo de captura
  }

  capturarFoto(): void {
    const canvas = this.canvas.nativeElement;
    const context = canvas.getContext('2d');
    const videoElement = this.videoElement.nativeElement;

    // Asegurarse de que el canvas tenga el mismo tamaño que el video
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    // Dibujar el fotograma actual del video en el canvas
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Obtener la imagen del canvas como base64 y almacenarla en captures
    const imageData = canvas.toDataURL('image/png');
    this.captures.push(imageData);

    this.cameraService.detectarISBN(imageData).subscribe(response => {

    });

    console.log('Captura realizada:', imageData);
  }*/

}
