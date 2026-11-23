import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { MateriasService } from '../../servicios/materias.service';
import { GenericTable } from '../../componentes/table/generic-table';

@Component({
  selector: 'app-curriculo',
  standalone: true,
  imports: [CommonModule, GenericTable],
  templateUrl: './curriculo.html',
  styleUrl: './curriculo.css',
})
export class Curriculo implements OnInit {
  curriculo = signal<any[]>([]);

  private readonly materiasService = inject(MateriasService);

  ngOnInit(): void {
    this.materiasService.obtenerCurriculo().subscribe({
      next: (data) => this.curriculo.set(data),
      error: (err) => console.error('Error al obtener currículo:', err),
    });
  }
}
