import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {AutenticacionService} from "./services/autenticacion.service";
import {HttpClientXsrfModule} from "@angular/common/http";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'librital';

  ultimoMensaje: any = "";
  constructor(private authService: AutenticacionService) {}

  ngOnInit() {
    this.getLocations();
    this.sendTexto();
  }

  public getLocations() {
    this.authService.obtenerMensaje().subscribe((res) => {
      console.log(res);

      let a :any = localStorage.getItem('token');
      alert(a);
      localStorage.setItem('X-Csrftoken', a);

      this.ultimoMensaje = res;
    });
  }

  public sendTexto() {
    let a = "Hola";
    this.authService.recibir(a).subscribe((res) => {
      console.log(res);
    });
  }

}
