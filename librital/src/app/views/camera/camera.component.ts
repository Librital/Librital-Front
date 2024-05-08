import {Component, ElementRef, ViewChild} from '@angular/core';
import {Subscription} from "rxjs";
import {LoadingSpinnerComponent} from "../loading-spinner/loading-spinner.component";
import {AsyncPipe, JsonPipe, NgIf} from "@angular/common";
import {LOAD_WASM, NgxScannerQrcodeModule} from 'ngx-scanner-qrcode';
import {ZXingScannerComponent, ZXingScannerModule} from '@zxing/ngx-scanner';
import {Result} from '@zxing/library';
import {BarcodeFormat} from "html5-qrcode/third_party/zxing-js.umd";
import {NavigationStart, Router} from "@angular/router";
import {CamaraService} from "../../services/camara.service";
import {LibroService} from "../../services/libro.service";

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

  private navigationStartSubscription!: Subscription;

  constructor(private camaraService: CamaraService, private libroService: LibroService, private router: Router) {
    this.navigationStartSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.stopCamera();
      }
    });
  }



  ngOnInit(): void {

    const elementId = 'camara'; // ID del elemento HTML donde se renderizará el escáner

    const onScanSuccess = (decodedText: string, decodedResult: any) => {
      // Manejar el resultado del escaneo de código QR
      console.log(`Scan result: ${decodedText}`, decodedResult);
      if (decodedText) {
        //this.qrScannerService.stopScanner();
        //alert(`Scan result: ${decodedText}`);
        this.libroService.obtenerLibroPorScanIsbn(decodedText).subscribe((data: any) => {
          if (data.message == "No encontrado") {
            alert("Libro no encontrado");
          } else if (data.message == "Encontrado") {
            this.router.navigate(['/libro-info/', data.libro['id_libro']]);
          }
        });
      }
    };

    this.camaraService.startScanner(elementId, onScanSuccess, 400, 200);
  }

  stopCamera() {
    this.camaraService.stopScanner();
  }

  ngOnDestroy(): void {
    this.camaraService.stopScanner();
  }

}
