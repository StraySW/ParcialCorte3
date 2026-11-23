import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { MateriasService } from '../../servicios/materias.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {
  perfil = signal<any>({
    nombres: 'Santiago',
    apellidos: 'Waltero Olaya',
    nombre_completo: 'SANTIAGO WALTERO OLAYA',
    email: 'santiago.waltero@uniminuto.edu.co',
    sexo: 'Masculino',
    ciudadania: 'Ciudadano Colombiano',
    contacto_emergencia: 'Olaya Gamez, Rosalba',
    telefono_emergencia: '3017206200',
    nivel: 'Pregrado',
    semestre: 'Sexto Semestre',
    estatus: 'Activo',
    tipo_alumno: 'Continuo',
    campus: 'ENGATIVA PRESENCIAL / UMD',
    primer_periodo: 'Pregrado Presencial 2023-1',
    ultimo_periodo: 'Pregrado Presencial 2026-1',
    programa: 'INGENIERÍA DE SISTEMAS',
    plan_estudios: '1-BGISUM20182-INGENIERIA DE SISTEMAS',
  });

  private readonly materiasService = inject(MateriasService);

  ngOnInit(): void {
    this.materiasService.obtenerPerfil().subscribe({
      next: (data) => {
        if (data) {
          this.perfil.update((curr) => ({ ...curr, ...data }));
        }
      },
      error: (err) => console.error('Error al obtener perfil:', err),
    });
  }
}
