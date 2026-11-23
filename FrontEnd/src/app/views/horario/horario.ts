import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { MateriasService } from '../../servicios/materias.service';
import { GenericTable } from '../../componentes/table/generic-table';

@Component({
  selector: 'app-horario',
  standalone: true,
  imports: [CommonModule, GenericTable],
  templateUrl: './horario.html',
  styleUrl: './horario.css',
})
export class Horario implements OnInit {
  horario = signal<any[]>([]);

  private readonly materiasService = inject(MateriasService);

  ngOnInit(): void {
    this.materiasService.obtenerHorario().subscribe({
      next: (data) => this.horario.set(data),
      error: (err) => console.error('Error al obtener horario:', err),
    });
  }
}
