import {Component, ElementRef, ViewChild, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {AutenticacionService} from "./services/autenticacion.service";
import { Application } from '@splinetool/runtime';
import {LoadingSpinnerComponent} from "./views/loading-spinner/loading-spinner.component";
import {FaIconComponent, FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {FooterComponent} from "./views/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    LoadingSpinnerComponent,
    FaIconComponent,
    FooterComponent,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'librital';

  isLoading: boolean = true; // Inicialmente, mostrar el spinner
  cargaPrimera: boolean = true; // Inicialmente, mostrar el spinner

  constructor(private route: Router, private authService: AutenticacionService) {}

  ngOnInit() {
    this.isLoading = true;

    this.comprobarToken();

    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
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
    return this.authService.comprobarUsuarioLogueado();
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

