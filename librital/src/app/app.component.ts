import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {AutenticacionService} from "./services/autenticacion.service";
import { Application } from '@splinetool/runtime';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'librital';

  ultimoMensaje: any = "";

  constructor(private authService: AutenticacionService) {}


  ngOnInit() {


    //const canvas = document.getElementById('canvas3d');
    //const app = new Application(<HTMLCanvasElement>canvas);
    //app.load('https://prod.spline.design/wXjR3Q1zyAeZc12f/scene.splinecode');


    this.getLocations();
    this.sendTexto();
  }






  public getLocations() {
    this.authService.obtenerMensaje().subscribe((res) => {
      console.log(res);
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

