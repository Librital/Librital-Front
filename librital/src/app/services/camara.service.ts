import { ElementRef, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Html5QrcodeScanner, Html5QrcodeScanType} from "html5-qrcode";

@Injectable({
  providedIn: 'root'
})
export class CamaraService {

  private html5QrcodeScanner: Html5QrcodeScanner | undefined;

  constructor(private httpClient: HttpClient) { }


  public detectarISBN(image: ElementRef<HTMLImageElement>): Observable<any> {
    return this.httpClient.post<any>(environment.apiUrl + 'api/libro/identificarISBN', {"imagen": image});
  }


  startScanner(elementId: string, onScanSuccess: (decodedText: string, decodedResult: any)=> void, anchura: number, altura: number): void {

    let config = {
      fps: 15,
      qrbox: {width: anchura, height: altura},
      rememberLastUsedCamera: true,
      //supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
    };


    this.html5QrcodeScanner = new Html5QrcodeScanner(elementId, config, false);
    this.html5QrcodeScanner.render(onScanSuccess, errorMessage =>
      console.log(`Error scanning QR code: ${errorMessage}`)
    );
  }

  stopScanner(): void {
    if (this.html5QrcodeScanner) {
      this.html5QrcodeScanner.clear().then(r => console.log('Scanner stopped successfully'));
    }
  }




}

