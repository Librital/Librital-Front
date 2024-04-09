import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {UsuarioService} from "../../services/usuario.service";
import {Usuario} from "../../models/usuario";
import {AutenticacionService} from "../../services/autenticacion.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private route: Router, private usuarioService: UsuarioService, private autenticacionService: AutenticacionService) { }

  ngOnInit(): void {
    if (this.autenticacionService.comprobarUsuarioLogueado() && this.autenticacionService.obtenerUsuarioDelToken().tipo != 3) {
      this.route.navigate(['/']);
    }
  }

  public comprobarCampos() {
    let email = (<HTMLInputElement>document.getElementById('email-login')).value;
    let contrasenia = (<HTMLInputElement>document.getElementById('password-login')).value;

    if (email == "" || contrasenia == "") {
      alert("No puede haber campos vacíos.");
    } else {
      this.loginUsuario();
    }
  }


  private loginUsuario() {
    let email = (<HTMLInputElement>document.getElementById('email-login')).value;
    let contrasenia = (<HTMLInputElement>document.getElementById('password-login')).value;

    let usuarioLogin = new Usuario('', '', email, contrasenia, '', 1, 1, 1, '');

    this.usuarioService.loginUsuario(usuarioLogin).subscribe((data: any) => {
      if (data.message == "No existe") {
        alert("No se ha encontrado el usuario con el email introducido.");
      } else if (data.message == "Credenciales incorrectas") {
          alert("Error al iniciar sesión.");
      } else if (data.message == "Correcto")  {
          alert("Se ha logeado correctamente");
          this.autenticacionService.guardarToken(data.access_token);
          this.autenticacionService.guardarRefreshToken(data.refresh);
          this.route.navigate(['/']);
      }
    });
  }

}
