import { Component } from '@angular/core';
import {FooterComponent} from "../footer/footer.component";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-libro-info',
  standalone: true,
  imports: [
    FooterComponent,
    NgForOf
  ],
  templateUrl: './libro-info.component.html',
  styleUrl: './libro-info.component.scss'
})
export class LibroInfoComponent {

  listaGeneros: string[] = ['Ciencia', 'Acción', 'Romancce'];
  listaEtiquetas: string[] = ['A comprar', 'Vendido'];

}
