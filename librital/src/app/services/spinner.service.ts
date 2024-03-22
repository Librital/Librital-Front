import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private opacidadSpinner = new BehaviorSubject<number>(1);
  opacidad = this.opacidadSpinner.asObservable();
  constructor() { }

  setOpacidad(opacidad: number) {
    this.opacidadSpinner.next(opacidad);
  }


}
