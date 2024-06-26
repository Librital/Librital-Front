import { Component, OnInit } from '@angular/core';
import {FooterComponent} from "../footer/footer.component";
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {AutenticacionService} from "../../services/autenticacion.service";
import {Usuario} from "../../models/usuario";
import {UsuarioService} from "../../services/usuario.service";
import {LoadingSpinnerComponent} from "../loading-spinner/loading-spinner.component";
import {LibroService} from "../../services/libro.service";
import {MapaService} from "../../services/mapa.service";
import {Mapa} from "../../models/mapa";
import {ToastService} from "../../services/toast.service";

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    FooterComponent,
    FormsModule,
    NgIf,
    MatTabGroup,
    MatTab,
    LoadingSpinnerComponent,
    NgForOf,
    NgOptimizedImage
  ],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent {

  isLoading: boolean = true;

  // hoja 1
  editarInformacionPerfil: boolean = false;

  expresionEmail: RegExp = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;

  usuario: Usuario = new Usuario('', '', '', '', '', 1, 1, 1, '');

  nombreIni = '';
  apellidoIni = '';
  fechaNacimientoIni = '';
  emailIni = '';
  passwordIni = '';
  passwordConfirmacionIni = '';
  fotoPerfil: string = ''
  fotoPerfilInicial: string = '';

  listaMarcadores: Mapa[] = [];
  tieneDesc = false;
  puntoActivo = true;

  estadoMarcadores: { [key: string]: boolean } = {};


  // hoja 2
  cambiarPassword: boolean = false;
  cambiarImgProfile: boolean = false;

  listaAvatares: string[] = ['https://cdn-icons-png.flaticon.com/512/11116/11116689.png',
    'https://cdn-icons-png.flaticon.com/512/5722/5722116.png',
    'https://cdn-icons-png.flaticon.com/512/12540/12540328.png',
    'https://cdn-icons-png.flaticon.com/512/7183/7183470.png',
    'https://cdn-icons-png.flaticon.com/512/5721/5721099.png',
    'https://cdn-icons-png.flaticon.com/512/7186/7186924.png',
    'https://cdn-icons-png.flaticon.com/512/8731/8731755.png',
    'https://cdn-icons-png.flaticon.com/512/4681/4681519.png',
    'https://cdn-icons-png.flaticon.com/512/12817/12817725.png'];


  constructor(private autenticacionService: AutenticacionService, private usuarioService: UsuarioService,
              private libroService: LibroService, private mapaService: MapaService, private toastService: ToastService) { }


  ngOnInit() {

    this.cargarInformacionUsuarioPerfil();
    this.comprobarExistePag();
    this.comprobarExisteBusqueda();

    this.obtenerTodosMarkerUserMapa();

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




  private cargarInformacionUsuarioPerfil() {

    this.isLoading = true;

    let nombre = document.getElementById("nombre-perfil") as HTMLInputElement;
    let apellido = document.getElementById("apellido-perfil") as HTMLInputElement;
    let fechaNacimiento = document.getElementById("date-perfil") as HTMLInputElement;
    let email = document.getElementById("email-perfil") as HTMLInputElement;

    this.usuario = this.autenticacionService.obtenerUsuarioDelToken();

    this.nombreIni = this.usuario.nombre;
    this.apellidoIni = this.usuario.apellido;
    this.fechaNacimientoIni = this.usuario.fecha_nacimiento;
    this.emailIni = this.usuario.email;
    this.fotoPerfilInicial = this.usuario.img;
    this.fotoPerfil = this.usuario.img;

    if (this.usuario.tipo == 3) {
      let perfil_span = document.getElementById('perfil-foto') as HTMLElement;
      perfil_span.style.setProperty('border', '2px solid #52b788');
    }

    nombre.value = this.usuario.nombre;
    apellido.value = this.usuario.apellido;
    fechaNacimiento.value = this.usuario.fecha_nacimiento;
    email.value = this.usuario.email;

  }

  public editarInformacion(){
    this.editarInformacionPerfil = true;

    let nombre = document.getElementById("nombre-perfil") as HTMLInputElement;
    let apellido = document.getElementById("apellido-perfil") as HTMLInputElement;
    let fechaNacimiento = document.getElementById("date-perfil") as HTMLInputElement;
    let email = document.getElementById("email-perfil") as HTMLInputElement;

    nombre.disabled = false;
    apellido.disabled = false;
    fechaNacimiento.disabled = false;
    email.disabled = false;
  }

  public cancelarCambios() {
    this.editarInformacionPerfil = false;

    let nombre = document.getElementById("nombre-perfil") as HTMLInputElement;
    let apellido = document.getElementById("apellido-perfil") as HTMLInputElement;
    let fechaNacimiento = document.getElementById("date-perfil") as HTMLInputElement;
    let email = document.getElementById("email-perfil") as HTMLInputElement;

    if (this.nombreIni != nombre.value || this.apellidoIni != apellido.value
      || this.fechaNacimientoIni != fechaNacimiento.value || this.emailIni != email.value) {
      this.ponerCamposDefault();
    }

    nombre.disabled = true;
    apellido.disabled = true;
    fechaNacimiento.disabled = true;
    email.disabled = true;
  }

  public guardarCambios() {

    let nombre = document.getElementById("nombre-perfil") as HTMLInputElement;
    let apellido = document.getElementById("apellido-perfil") as HTMLInputElement;
    let fechaNacimiento = document.getElementById("date-perfil") as HTMLInputElement;
    let fechaDate = new Date(fechaNacimiento.value);
    let email = document.getElementById("email-perfil") as HTMLInputElement
    let password = document.getElementById("password-perfil") as HTMLInputElement;
    let passwordConfirmacion = document.getElementById("password-confirm-perfil") as HTMLInputElement;

    if (this.nombreIni == nombre.value && this.apellidoIni == apellido.value && this.fechaNacimientoIni == fechaNacimiento.value && this.emailIni == email.value) {
      this.toastService.clear();
      this.toastService.add({severity:'info', summary:'Información', detail:'No se ha realizado ningún cambio'});
    } else if (nombre.value == '' || apellido.value == '' || fechaNacimiento.value == '' || email.value == ''
      || password.value == '' || passwordConfirmacion.value == '') {
      this.toastService.clear();
      this.toastService.add({severity:'error', summary:'Error', detail:'Todos los campos son obligatorios'});
    } else if (!this.expresionEmail.test(email.value)) {
      this.toastService.clear();
      this.toastService.add({severity:'error', summary:'Error', detail:'El email no tiene un formato válido'});
    } else if (fechaDate > new Date()) {
      this.toastService.clear();
      this.toastService.add({severity:'error', summary:'Error', detail:'La fecha de nacimiento no puede ser mayor a la actual'});
    } else if (password.value != passwordConfirmacion.value) {
      this.toastService.clear();
      this.toastService.add({severity:'error', summary:'Error', detail:'Las contraseñas no coinciden'});
    } else {
      let usuario = new Usuario(nombre.value, apellido.value, email.value, password.value, fechaNacimiento.value, 1, 0, 1, '');
      this.actualizarInformacionUsuario(usuario, this.emailIni);

      this.editarInformacionPerfil = false;

      nombre.disabled = true;
      apellido.disabled = true;
      fechaNacimiento.disabled = true;
      email.disabled = true;
      //password.value = '';
      //passwordConfirmacion.value = '';

    }
  }

  public ponerCamposDefault() {
    let nombre = document.getElementById("nombre-perfil") as HTMLInputElement;
    let apellido = document.getElementById("apellido-perfil") as HTMLInputElement;
    let fechaNacimiento = document.getElementById("date-perfil") as HTMLInputElement;
    let email = document.getElementById("email-perfil") as HTMLInputElement;
    let password = document.getElementById("password-perfil") as HTMLInputElement;
    let passwordConfirmacion = document.getElementById("password-confirm-perfil") as HTMLInputElement;

    nombre.value = this.nombreIni;
    apellido.value = this.apellidoIni;
    fechaNacimiento.value = this.fechaNacimientoIni;
    email.value = this.emailIni;
    //password.value = '';
    //passwordConfirmacion.value = '';

  }


  private actualizarInformacionUsuario(usuario: Usuario, emailInicial: string) {
    this.usuarioService.actualizarInformacionUsuario(usuario, emailInicial).subscribe((data: any) => {
      if (data.message == "Actualizado") {
        this.autenticacionService.logout();
        this.autenticacionService.guardarToken(data.access_token);
        this.autenticacionService.guardarRefreshToken(data.refresh);
        this.cargarInformacionUsuarioPerfil();
        this.toastService.clear();
        this.toastService.add({severity:'success', detail:'Se ha actualizado la información del usuario correctamente'});
      } else if (data.message == "Contraseña incorrecta") {
        this.toastService.clear();
        this.toastService.add({severity:'error', detail:'La contraseña introducida es incorrecta'});
        this.ponerCamposDefault();
      } else if (data.message == "Correo ya existe") {
        this.toastService.clear();
        this.toastService.add({severity:'error', detail:'El correo introducido ya existe'});
        this.ponerCamposDefault();
      }
    });
  }



  public mostrarFormPassword() {
    this.cambiarPassword = true;
  }

  public cancelarPasswordChange() {
    this.cambiarPassword = false;
  }

  public mostrarCambioAvatar() {
    this.cambiarImgProfile = true;
  }

  public cancelarAvatarChange() {
    this.fotoPerfil = this.fotoPerfilInicial;
    this.cambiarImgProfile = false;
  }


  public cambiarPasswordChange() {

    let email = document.getElementById("email-perfil") as HTMLInputElement;
    let passwordInicial = document.getElementById("password-anitgua") as HTMLInputElement;
    let passwordChange = document.getElementById("password-change") as HTMLInputElement;
    let passwordConfirmacion = document.getElementById("password-confirm-change") as HTMLInputElement;


    if (passwordInicial.value == '' || passwordChange.value == '' || passwordConfirmacion.value == '') {
      this.toastService.clear();
      this.toastService.add({severity:'error', summary:'Error', detail:'Todos los campos son obligatorios'});
    } else if (passwordChange.value != passwordConfirmacion.value) {
      this.toastService.clear();
      this.toastService.add({severity:'error', summary:'Error', detail:'Las contraseñas no coincide con la confirmación'});
    } else {
      let usuario = new Usuario('', '', email.value, passwordChange.value, '', 1, 0, 1, '');
      this.usuarioService.cambiarPassword(usuario, passwordInicial.value).subscribe((data: any) => {
        if (data.message == "Actualizada") {
          this.toastService.clear();
          this.toastService.add({severity:'success', detail:'Se ha cambiado la contraseña con éxito'});
          this.cancelarPasswordChange();
          passwordInicial.value = '';
          passwordChange.value = '';
          passwordConfirmacion.value = '';

          this.autenticacionService.guardarToken(data.access_token);
          this.autenticacionService.guardarRefreshToken(data.refresh);

        } else if (data.message == "Incorrecta") {
          this.toastService.clear();
          this.toastService.add({severity:'error', detail:'La contraseña introducida es incorrecta'});
          passwordInicial.value = '';
        }
      });
    }
  }

  public isImagenSeleccionada(avatar: string) {
    return this.fotoPerfil === avatar;
  }

  public seleccionarAvatar(avatar: string) {
    this.fotoPerfil = avatar;

  }

  public guardarCambioAvatar() {

    if (this.fotoPerfil == this.fotoPerfilInicial) {
      this.toastService.clear();
      this.toastService.add({severity:'info', summary:'Información', detail:'No se ha realizado ningún cambio en la imagen de perfil'});
      this.cambiarImgProfile = false;
    } else {
      let usuario = new Usuario('', '', this.emailIni, '', '', 1, 1, 1, this.fotoPerfil);
      this.usuarioService.cambiarImagenPerfil(usuario).subscribe((data: any) => {
        if (data.message == "Actualizada") {
          this.autenticacionService.guardarToken(data.access_token);
          this.autenticacionService.guardarRefreshToken(data.refresh);
          this.cargarInformacionUsuarioPerfil();
          this.toastService.clear();
          this.toastService.add({severity:'success', detail:'Se ha cambiado la imagen de perfil con éxito'});
          this.cambiarImgProfile = false;
          this.isLoading = false;
        } else {
          this.toastService.clear();
          this.toastService.add({severity:'error', detail:'No se ha podido cambiar la imagen de perfil'});
        }
      });
    }
  }


  public obtenerTodosMarkerUserMapa() {

    this.mapaService.obtenerMarkersUserMapa(this.usuario.id!).subscribe((data: any) => {
      if (data.message == "Obtenidos") {
        this.listaMarcadores = data.marcadores;

        this.listaMarcadores.forEach(puntoMapa => {
          this.estadoMarcadores[puntoMapa.id_marker!] = puntoMapa.activo; // Inicialmente, todos los marcadores están desactivados
        });

      } else if (data.message == "No hay marcadores") {
        this.listaMarcadores = [];
      }
      this.isLoading = false;
    });

  }


  public desactivarPuntoUserMapa(id_punto: number) {

    this.estadoMarcadores[id_punto] = !this.estadoMarcadores[id_punto];

    this.mapaService.desactivarPuntoMapaUser(id_punto, this.estadoMarcadores[id_punto]).subscribe((data: any) => {

      if (data.message == 'Correcto') {
        this.toastService.clear();
        this.toastService.add({severity:'success', detail:'Se ha desactivado el marcador correctamente'});
        this.obtenerTodosMarkerUserMapa();
      } else {
        this.toastService.clear();
        this.toastService.add({severity:'error', summary: 'Error', detail:'No se ha podido desactivar el marcador'});
      }
    });
  }


}
