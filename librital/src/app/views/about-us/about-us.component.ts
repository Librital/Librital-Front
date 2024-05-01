import { Component } from '@angular/core';
import {FooterComponent} from "../footer/footer.component";
import {LibroService} from "../../services/libro.service";

@Component({
  selector: 'app-about-us',
  standalone: true,
    imports: [
        FooterComponent
    ],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {

  constructor(private libroService: LibroService) { }

  ngOnInit() {
    this.comprobarExistePag();
  }

  public comprobarExistePag() {

    if (this.libroService.obtenerPaginaActual() != null) {
      this.libroService.eliminarPaginaActual();
    }
  }


}
