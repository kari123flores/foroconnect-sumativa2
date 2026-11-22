
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { RecuperarPasswordComponent } from './pages/recuperar-password/recuperar-password.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { ForoComponent } from './pages/foro/foro.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'registro',
    component: RegistroComponent
  },
  {
    path: 'recuperar-password',
    component: RecuperarPasswordComponent
  },
  {
    path: 'perfil',
    component: PerfilComponent,
    canActivate: [authGuard]
  },
  {
    path: 'foro',
    component: ForoComponent,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
