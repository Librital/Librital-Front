import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";

import {AddLibroComponent} from "../add-libro/add-libro.component";
import {FooterComponent} from "../footer/footer.component";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {LibroService} from "../../services/libro.service";

@Component({
  selector: 'app-biblioteca',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
    FooterComponent,
    NgClass,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './biblioteca.component.html',
  styleUrl: './biblioteca.component.scss'
})
export class BibliotecaComponent {

  btnRecientePulsado: boolean = false;
  librosUsuario: String[] = ['Hola', 'prueba', 'prueba2', 'prueba3', 'prueba4', 'prueba5', 'prueba6', 'prueba7'];

  constructor(private libroService: LibroService) { }

  ngOnInit() {

    this.comprobarExistePag();
    this.comprobarExisteBusqueda();

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


  cambiarIconoReciente(): void {
    this.btnRecientePulsado = !this.btnRecientePulsado;
  }


}
