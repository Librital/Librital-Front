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



  dropdownAdminVisible = false;
  dropdownPerfilVisible = false;


  constructor(private route: Router, private authService: AutenticacionService, private renderer: Renderer2, private elementRef: ElementRef,
              private usuarioService: UsuarioService, private router: Router) {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Cerrar el dropdown aquí
        this.cerrarDropDowns();
        this.isAdminOptionSelected = false;
        this.isPerfilOptionSelected = false;
      }
    });


  }


  ngOnInit(): void {

    this.isLoading = true;

    this.comprobarToken();

    this.dropdownPerfilVisible = false;
    this.dropdownAdminVisible = false;

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
  }

  public handlePerfilOptionClick(option: string): void {
    this.isPerfilOptionSelected = true;
  }



  /*public cargarNavBar() {
    setTimeout(() => {
      const dropdownBtns = this.elementRef.nativeElement.querySelectorAll('.dropdown-btn');
      const dropdowns = this.elementRef.nativeElement.querySelectorAll('.dropdown');
      const hamburgerBtn = this.elementRef.nativeElement.querySelector('#hamburger');
      const navMenu = this.elementRef.nativeElement.querySelector('.menu');
      const links = this.elementRef.nativeElement.querySelectorAll('.dropdown a');

      function setAriaExpandedFalse(): void {
        dropdownBtns.forEach((btn: HTMLElement) => {
          btn.setAttribute('aria-expanded', 'false');
        });
      }

      function closeDropdownMenu(): void {
        dropdowns.forEach((drop: HTMLElement) => {
          drop.classList.remove('active');
        });
      }

      function toggleHamburger(): void {

        if (navMenu.classList.contains('show')) {
          navMenu.classList.remove('show');
        } else {
          navMenu.classList.toggle('show');
        }

      }

      dropdownBtns.forEach((btn: HTMLElement) => {
        btn.addEventListener('click', (e: Event) => {
          const dropdownIndex = btn.getAttribute('data-dropdown');
          const dropdownElement = this.elementRef.nativeElement.querySelector(`#${dropdownIndex}`);

          if (dropdownElement) {
            dropdownElement.classList.toggle('active');

            dropdowns.forEach((drop: HTMLElement) => {
              if (drop.id !== dropdownIndex) {
                drop.classList.remove('active');
              }
            });

            btn.setAttribute(
              'aria-expanded',
              btn.getAttribute('aria-expanded') === 'false' ? 'true' : 'false'
            );
          }

          e.stopPropagation();
        });
        this.cargarNavBar();
      });

      // Cerrar el menú desplegable al hacer clic en los enlaces dentro del menú desplegable
      links.forEach((link: HTMLElement) => {
        link.addEventListener('click', () => {
          closeDropdownMenu();
          setAriaExpandedFalse();
          toggleHamburger();
        });
      });

      // Cerrar el menú desplegable al hacer clic en cualquier parte del documento
      document.documentElement.addEventListener('click', () => {
        closeDropdownMenu();
        setAriaExpandedFalse();
      });

      // Cerrar el menú desplegable al presionar la tecla Esc
      document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeDropdownMenu();
          setAriaExpandedFalse();
        }
      });
      if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
          toggleHamburger();
        });
      }
    }, 1000);
  }*/

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

    if (dropdownPerfil.classList.contains('active')) {
      dropdownPerfil.classList.remove('active');
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

