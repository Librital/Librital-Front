import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {UsuarioService} from "../../services/usuario.service";
import {Usuario} from "../../models/usuario";
import {AutenticacionService} from "../../services/autenticacion.service";

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  expresionEmail: RegExp = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
  nombreUsuario: string = '';
  apellidoUsuario: string = '';
  fechaActual: Date = new Date();
  emailUsuario: string = '';
  contraseniaUsuario: string = '';

  constructor(private route: Router, private usuarioService: UsuarioService, private autenticacionService: AutenticacionService) {}

  ngOnInit(): void {
    if (this.autenticacionService.comprobarUsuarioLogueado() && this.autenticacionService.obtenerUsuarioDelToken().tipo != 3) {
      this.route.navigate(['/']);
    }
  }


  public obtenerDatosRegistro() {

    let nombre = (<HTMLInputElement>document.getElementById('form-nombre')).value;
    let apellido = (<HTMLInputElement>document.getElementById('form-apellido')).value;
    let fechaNacimiento = (<HTMLInputElement>document.getElementById('form-date')).value;
    let fechaDate = new Date(fechaNacimiento);
    let email = (<HTMLInputElement>document.getElementById('form-email')).value;
    let contrasenia = (<HTMLInputElement>document.getElementById('form-password')).value;

    if (nombre == '' || apellido == '' || fechaNacimiento == '' || email == '' || contrasenia == '') {
      alert("No puede haber campos vacios");
    } else if (!this.expresionEmail.test(email)) {
      alert("El email introducido no es valido");
    } else if (fechaDate >= this.fechaActual) {
      alert("La fecha de nacimiento no puede ser superior a la fecha actual");
    }
    else if (contrasenia.length < 8) {
      alert("La contraseña debe tener al menos 8 caracteres");
    }
    else {
      this.registrarUsuario(nombre, apellido, fechaNacimiento, email, contrasenia);
    }
  }

  private registrarUsuario(nombre : string, apellido : string, fechaNacimiento : string, email : string, contrasenia : string) {

    let usuarioNuevo: Usuario = new Usuario(nombre, apellido, email, contrasenia, fechaNacimiento, 1, 0, 1, 'https://cdn-icons-png.flaticon.com/512/11116/11116689.png');
    this.usuarioService.registrarUsuario(usuarioNuevo).subscribe((data: any) => {
      if (data.message == "Existente") {
        alert("El email introducido ya se encuentra en uso.");
      } else {
        alert("Se ha registrado correctamente");
        this.route.navigate(['login']);
        this.ponerCamposVacios();
      }
    });

  }


  private ponerCamposVacios() {
    (<HTMLInputElement>document.getElementById('form-nombre')).value = "";
    (<HTMLInputElement>document.getElementById('form-apellido')).value = "";
    (<HTMLInputElement>document.getElementById('form-date')).value = "";
    (<HTMLInputElement>document.getElementById('form-email')).value = "";
    (<HTMLInputElement>document.getElementById('form-password')).value = "";
  }
}



