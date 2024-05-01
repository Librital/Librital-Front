import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";

import {AddLibroComponent} from "../add-libro/add-libro.component";
import {FooterComponent} from "../footer/footer.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-biblioteca',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
    FooterComponent,
    NgClass,
    RouterLink
  ],
  templateUrl: './biblioteca.component.html',
  styleUrl: './biblioteca.component.scss'
})
export class BibliotecaComponent {

  btnRecientePulsado: boolean = false;
  librosUsuario: String[] = ['Hola', 'prueba', 'prueba2', 'prueba3', 'prueba4', 'prueba5', 'prueba6', 'prueba7'];

  constructor() { }

  cambiarIconoReciente(): void {
    this.btnRecientePulsado = !this.btnRecientePulsado;
  }


}
