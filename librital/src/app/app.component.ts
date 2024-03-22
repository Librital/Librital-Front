import {Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {AutenticacionService} from "./services/autenticacion.service";
import { Application } from '@splinetool/runtime';
import {LoadingSpinnerComponent} from "./views/loading-spinner/loading-spinner.component";
import {FaIconComponent, FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {FooterComponent} from "./views/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    LoadingSpinnerComponent,
    FaIconComponent,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'librital';

  isLoading: boolean = true; // Inicialmente, mostrar el spinner
  cargaPrimera: boolean = true; // Inicialmente, mostrar el spinner

  constructor(private authService: AutenticacionService) {}

  ngOnInit() {
    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
    }, 1000);


  }


/*  public getLocations() {
    this.authService.obtenerMensaje().subscribe((res) => {
      console.log(res);
      console.log(res[0].nombre);
      this.usuarios = res;
    });
  }

  public sendTexto() {
    let a = {
      "nombre": "prueba2",
    };
    this.authService.recibir(a).subscribe((res) => {
      console.log(res);
    });
  }*/

}

