import { Routes } from '@angular/router';
import { MenuComponent } from './componentes/menu/menu.component';
import { Login } from './views/login/login';
import { Registro } from './views/registro/registro';
import { Materias } from './views/materias/materias';
import { Perfil } from './views/perfil/perfil';

export const routes: Routes = [
  // Apenas se entra al proyecto, abre directamente la vista de Login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Vistas sin menú
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },

  // Vistas con menú institucional
  {
    path: '',
    component: MenuComponent,
    children: [
      { path: 'materias', component: Materias },
      { path: 'perfil', component: Perfil },
    ],
  },

  // Ruta por defecto
  { path: '**', redirectTo: 'login' },
];
