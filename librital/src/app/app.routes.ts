import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from "./views/login/login.component";
import { SignUpComponent } from "./views/sign-up/sign-up.component";
import { AboutUsComponent } from "./views/about-us/about-us.component";
import { PerfilComponent } from "./views/perfil/perfil.component";
import { LibroInfoComponent } from "./views/libro-info/libro-info.component";
import { LibroDetailComponent } from "./views/libro-detail/libro-detail.component";
import { BibliotecaComponent } from "./views/biblioteca/biblioteca.component";
import { BuscadorComponent } from "./views/buscador/buscador.component";

export const routes: Routes = [
  {path: '', component:HomeComponent},
  {path: 'login', component:LoginComponent},
  {path: 'sign-up', component:SignUpComponent},
  {path: 'about-us', component:AboutUsComponent},
  {path: 'perfil', component:PerfilComponent},
  {path: 'libro-info', component:LibroInfoComponent},
  {path: 'libro-detail', component:LibroDetailComponent},
  {path: 'biblioteca', component:BibliotecaComponent},
  {path: 'buscador', component:BuscadorComponent},

];
