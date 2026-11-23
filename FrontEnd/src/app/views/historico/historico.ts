import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { MateriasService } from '../../servicios/materias.service';
import { GenericTable } from '../../componentes/table/generic-table';

@Component({
  selector: 'app-historico',
  standalone: true,
  imports: [CommonModule, GenericTable],
  templateUrl: './historico.html',
  styleUrl: './historico.css',
})
export class Historico implements OnInit {
  historico = signal<any[]>([]);

  private readonly materiasService = inject(MateriasService);

  ngOnInit(): void {
    this.materiasService.obtenerHistorico().subscribe({
      next: (data) => this.historico.set(data),
      error: (err) => console.error('Error al obtener histórico:', err),
    });
  }
}
