import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { MateriasService } from '../../servicios/materias.service';
import { GenericTable } from '../../componentes/table/generic-table';

@Component({
  selector: 'app-calificaciones',
  standalone: true,
  imports: [CommonModule, GenericTable],
  templateUrl: './calificaciones.html',
  styleUrl: './calificaciones.css',
})
export class Calificaciones implements OnInit {
  calificaciones = signal<any[]>([]);

  private readonly materiasService = inject(MateriasService);

  ngOnInit(): void {
    this.materiasService.obtenerCalificaciones().subscribe({
      next: (data) => this.calificaciones.set(data),
      error: (err) => console.error('Error al obtener calificaciones:', err),
    });
  }
}
