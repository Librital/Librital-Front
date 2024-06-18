import { Component } from '@angular/core';
import {NavigationEnd, Router, RouterLink} from "@angular/router";
import {UsuarioService} from "../../services/usuario.service";
import {Usuario} from "../../models/usuario";
import {AutenticacionService} from "../../services/autenticacion.service";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {LibroService} from "../../services/libro.service";
import {ToastService} from "../../services/toast.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    FontAwesomeModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private route: Router, private usuarioService: UsuarioService, private autenticacionService: AutenticacionService,
              private libroService: LibroService, private toastService: ToastService) { }

  ngOnInit(): void {
    if (this.autenticacionService.comprobarUsuarioLogueado() && this.autenticacionService.obtenerUsuarioDelToken().tipo != 3) {
      this.route.navigate(['/']);
    }

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



  public comprobarCampos() {
    let email = (<HTMLInputElement>document.getElementById('email-login')).value;
    let contrasenia = (<HTMLInputElement>document.getElementById('password-login')).value;

    if (email == "" || contrasenia == "") {
      this.toastService.clear();
      this.toastService.add({severity:'error', summary:'Error', detail:'Debes rellenar todos los campos.'});
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
        this.toastService.clear();
        this.toastService.add({severity:'error', summary:'Error', detail:'No se ha encontrado el usuario con el email introducido.'});
      } else if (data.message == "Credenciales incorrectas") {
          this.toastService.clear();
          this.toastService.add({severity:'error', summary:'Error', detail:'Error al iniciar sesión.'});
      } else if (data.message == "Correcto")  {

          this.toastService.clear();
          this.toastService.add({severity:'success', detail:'Se ha logeado correctamente.'});

          this.autenticacionService.guardarToken(data.access_token);
          this.autenticacionService.guardarRefreshToken(data.refresh);
          setTimeout(() => {
            this.route.navigate(['/']);
          }, 1000);



      }
    });
  }

}
