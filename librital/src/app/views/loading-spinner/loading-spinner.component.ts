import { Component } from '@angular/core';
import {NgIf} from "@angular/common";
import {SpinnerService} from "../../services/spinner.service";

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.scss'
})
export class LoadingSpinnerComponent {

  opacidadIni: number = 1;

  constructor(private spinnerService: SpinnerService) {}

  ngOnInit() {
    this.spinnerService.opacidad.subscribe((opacidad: number) => {
      this.opacidadIni = opacidad;
    });
  }

}
