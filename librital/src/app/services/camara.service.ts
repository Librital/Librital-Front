import { ElementRef, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CamaraService {

  constructor(private httpClient: HttpClient) { }


  public detectarISBN(image: ElementRef<HTMLImageElement>): Observable<any> {
    return this.httpClient.post<any>(environment.apiUrl + 'api/libro/identificarISBN', {"imagen": image});
  }


}

