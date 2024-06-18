import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {UsuarioService} from "../../services/usuario.service";
import {Usuario} from "../../models/usuario";
import {AutenticacionService} from "../../services/autenticacion.service";
import {LibroService} from "../../services/libro.service";
import {ToastService} from "../../services/toast.service";

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

  constructor(private route: Router, private usuarioService: UsuarioService, private autenticacionService: AutenticacionService,
              private libroService: LibroService, private toastService: ToastService) {}

  ngOnInit(): void {
    if (this.autenticacionService.comprobarUsuarioLogueado() && this.autenticacionService.obtenerUsuarioDelToken().tipo != 3) {
      this.route.navigate(['/']);
    }

    this.comprobarExisteBusqueda();
    this.comprobarExistePag();
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




  public obtenerDatosRegistro() {

    let nombre = (<HTMLInputElement>document.getElementById('form-nombre')).value;
    let apellido = (<HTMLInputElement>document.getElementById('form-apellido')).value;
    let fechaNacimiento = (<HTMLInputElement>document.getElementById('form-date')).value;
    let fechaDate = new Date(fechaNacimiento);
    let email = (<HTMLInputElement>document.getElementById('form-email')).value;
    let contrasenia = (<HTMLInputElement>document.getElementById('form-password')).value;

    if (nombre == '' || apellido == '' || fechaNacimiento == '' || email == '' || contrasenia == '') {
      this.toastService.clear();
      this.toastService.add({severity:'error', summary: 'Error', detail: 'Debes rellenar todos los campos'});
    } else if (!this.expresionEmail.test(email)) {
      this.toastService.clear();
      this.toastService.add({severity:'error', summary: 'Error', detail: 'El email no es correcto'});
    } else if (fechaDate >= this.fechaActual) {
      this.toastService.clear();
      this.toastService.add({severity:'error', summary: 'Error', detail: 'La fecha de nacimiento no puede ser superior a la actual'});
    }
    else if (contrasenia.length < 8) {
      this.toastService.clear();
      this.toastService.add({severity:'error', summary: 'Error', detail: 'La contraseña debe tener al menos 8 caracteres'});
    }
    else {
      this.registrarUsuario(nombre, apellido, fechaNacimiento, email, contrasenia);
    }
  }

  private registrarUsuario(nombre : string, apellido : string, fechaNacimiento : string, email : string, contrasenia : string) {

    let usuarioNuevo: Usuario = new Usuario(nombre, apellido, email, contrasenia, fechaNacimiento, 1, 0, 1, 'https://cdn-icons-png.flaticon.com/512/11116/11116689.png');
    this.usuarioService.registrarUsuario(usuarioNuevo).subscribe((data: any) => {
      if (data.message == "Existente") {
        this.toastService.clear();
        this.toastService.add({severity:'error', summary: 'Error', detail: 'El email introducido ya se encuentra en uso'});
      } else {
        this.toastService.clear();
        this.toastService.add({severity:'success', detail: 'Se ha registrado correctamente'});
        setTimeout(() => {
          this.ponerCamposVacios();
          this.route.navigate(['login']);
        }, 1000);

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



