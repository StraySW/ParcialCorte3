import { Routes } from '@angular/router';
import { MenuComponent } from './views/menu/menu.component';
import { Inicio } from './views/inicio/inicio';
import { Login } from './views/login/login';
import { Registro } from './views/registro/registro';
import { Materias } from './views/materias/materias';
import { Calificaciones } from './views/calificaciones/calificaciones';
import { Curriculo } from './views/curriculo/curriculo';
import { Horario } from './views/horario/horario';
import { Historico } from './views/historico/historico';
import { Perfil } from './views/perfil/perfil';

export const routes: Routes = [
  // Apenas se abre la página se redirige directamente al Login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Rutas de autenticación (pantalla completa, sin barra de menú)
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },

  // Rutas protegidas con el Menú / Sidenav Institucional
  {
    path: '',
    component: MenuComponent,
    children: [
      { path: 'inicio', component: Inicio },
      { path: 'materias', component: Materias },
      { path: 'calificaciones', component: Calificaciones },
      { path: 'curriculo', component: Curriculo },
      { path: 'horario', component: Horario },
      { path: 'historico', component: Historico },
      { path: 'perfil', component: Perfil },
    ],
  },

  // Ruta por defecto para cualquier ruta no encontrada
  { path: '**', redirectTo: 'login' },
];
