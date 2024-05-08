import {Component, ElementRef, ViewChild, OnInit, Renderer2, HostListener} from '@angular/core';
import { CommonModule } from '@angular/common';
import {NavigationStart, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {AutenticacionService} from "./services/autenticacion.service";
import {LoadingSpinnerComponent} from "./views/loading-spinner/loading-spinner.component";
import {FooterComponent} from "./views/footer/footer.component";

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBook,
  faCaretDown,
  faChevronRight, faGears,
  faHouse, faInfo,
  faMagnifyingGlass, faRightToBracket,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import {faBars} from "@fortawesome/free-solid-svg-icons/faBars";
import {UsuarioService} from "./services/usuario.service";
import {faMapLocation} from "@fortawesome/free-solid-svg-icons/faMapLocation";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    LoadingSpinnerComponent,
    FooterComponent,
    RouterLink,
    RouterLinkActive,
    FontAwesomeModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'librital';



  isAdminOptionSelected = false;
  isPerfilOptionSelected = false;

  dropdownEstadisticaSelected = false;
  dropdownLibroSelected = false;
  dropdownMapaSelected = false;

  dropdownAccederPerfilSelected = false;

  dropdownBibliotecaSelected = false;
  dropdownAddLibroSelected = false;

  isLoading: boolean = true;
  cargaPrimera: boolean = true;

  dropdownIcon = faCaretDown;
  optionsMenu = faBars
  userProfile = faUser;
  houseInicio = faHouse;
  lupaBuscador = faMagnifyingGlass;
  mapMapas = faMapLocation;
  libroBibliotecas = faBook;
  infoAcerca = faInfo;
  tuercaAdmin = faGears;
  loginAcceder = faRightToBracket;

  showGifAdmin = false;
  showGifPerfil = false;

  dropdownAdminVisible = false;
  dropdownPerfilVisible = false;
  dropdownBibliotecaVisible = false;


  constructor(private route: Router, private authService: AutenticacionService, private renderer: Renderer2, private elementRef: ElementRef,
              private usuarioService: UsuarioService, private router: Router) {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Cerrar el dropdown aquí
        this.cerrarDropDowns();
        this.isAdminOptionSelected = false;
        this.isPerfilOptionSelected = false;

        this.showGifAdmin = false;
        this.showGifPerfil = false;

      }
    });


  }


  ngOnInit(): void {

    this.isLoading = true;

    this.comprobarToken();

    this.dropdownPerfilVisible = false;
    this.dropdownAdminVisible = false;
    this.dropdownBibliotecaVisible = false;

    setTimeout(() => {
      this.isLoading = false;
    }, 1000);

    /*this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.cargarNavBar();
        console.log('Se produjo una navegación');
        // Puedes recargar o ejecutar otras acciones aquí
      }
    });*/
  }


  handleAdminOptionClick(option: string): void {
    this.isAdminOptionSelected = true;

    if (option == 'mapa-admin') {
      this.dropdownMapaSelected = true;

      this.dropdownEstadisticaSelected = false;
      this.dropdownLibroSelected = false;

    }

    if (option == 'admin') {
      this.dropdownEstadisticaSelected = true;

      this.dropdownMapaSelected = false;
      this.dropdownLibroSelected = false;

    }

    if (option == 'libros-admin') {
      this.dropdownLibroSelected = true;

      this.dropdownEstadisticaSelected = false;
      this.dropdownMapaSelected = false;
    }

    this.dropdownAccederPerfilSelected = false;
    this.dropdownBibliotecaSelected = false;
    this.dropdownAddLibroSelected = false;

    this.dropdownAccederPerfilSelected = false;

  }

  public handlePerfilOptionClick(option: string): void {
    this.isPerfilOptionSelected = true;

    if (option == 'acceder-perfil') {
      this.dropdownAccederPerfilSelected = true;
    }

    this.dropdownEstadisticaSelected = false;
    this.dropdownLibroSelected = false;
    this.dropdownMapaSelected = false;

    this.dropdownBibliotecaSelected = false;
    this.dropdownAddLibroSelected = false;

  }

  public cerrarDropDowns() {
    const dropdownAdmin = this.elementRef.nativeElement.querySelector('#dropdown1');
    const dropdownPerfil = this.elementRef.nativeElement.querySelector('#dropdown2');

    if (dropdownAdmin !== null) {
      if (dropdownAdmin.classList.contains('active')) {
        dropdownAdmin.classList.remove('active');


      }
    }

    if (dropdownPerfil != null) {

      if (dropdownPerfil.classList.contains('active')) {
        dropdownPerfil.classList.remove('active');
      }
    }
  }


  public displayAdminOptions() {
    const dropdownAdmin = this.elementRef.nativeElement.querySelector('#dropdown1');
    const dropdownPerfil = this.elementRef.nativeElement.querySelector('#dropdown2');

    this.showGifAdmin = !this.showGifAdmin;
    this.showGifPerfil = false;

    if (dropdownPerfil != null) {
      if (dropdownPerfil.classList.contains('active')) {
        dropdownPerfil.classList.remove('active');
      }
    }

    if (dropdownAdmin.classList.contains('active')) {
      dropdownAdmin.classList.remove('active');
    } else {
      dropdownAdmin.classList.toggle('active');
      this.dropdownAdminVisible = !this.dropdownAdminVisible;
    }

  }

  public displayPerfilOptions() {
    const dropdownAdmin = this.elementRef.nativeElement.querySelector('#dropdown1');
    const dropdownPerfil = this.elementRef.nativeElement.querySelector('#dropdown2');

    this.showGifPerfil = !this.showGifPerfil;
    this.showGifAdmin = false;

    if (dropdownAdmin != null) {

      if (dropdownAdmin.classList.contains('active')) {
        dropdownAdmin.classList.remove('active');
      }
    }

    if (dropdownPerfil.classList.contains('active')) {
      dropdownPerfil.classList.remove('active');
    } else {
      dropdownPerfil.classList.toggle('active');
      this.dropdownPerfilVisible = !this.dropdownPerfilVisible;
    }

  }


  public toogleNavBarResponsive() {

    const navMenu = this.elementRef.nativeElement.querySelector('.menu');
    if (navMenu.classList.contains('show')) {
      navMenu.classList.remove('show');
    } else {
      navMenu.classList.toggle('show');
    }

  }


  public comprobarToken() {
    if (this.authService.getToken()) {
      if (this.authService.comprobarExpToken()) {
        this.authService.refrescarToken().subscribe((data: any) => {
          this.authService.eliminarToken();
          this.authService.guardarToken(data.access)

        });
      } else {
        alert('Debe iniciar sesión');
        if (this.authService.getToken()) {
          this.authService.logout();
        }
        this.route.navigate(['/login']);
      }
    }
  }


  public isUsuarioLogueado() {
    if (this.authService.comprobarUsuarioLogueado()) {
      return true;
    } else {
      return false;
    }

  }

  public isAdministrador() {
    return this.authService.comprobarAdministrador();
  }

  public cerrarSesion() {
    alert('Se ha cerrado sesión');
    this.authService.logout();
    this.route.navigate(['/']);
  }













}

