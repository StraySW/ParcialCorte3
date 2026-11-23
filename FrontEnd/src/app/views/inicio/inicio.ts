import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MateriasService } from '../../servicios/materias.service';
import { GenericTable } from '../../componentes/table/generic-table';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink, GenericTable],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit {
  resumenMaterias = signal<any[]>([]);
  promedioActual = signal<number>(3.65);
  totalHoras = signal<number>(16);

  private readonly materiasService = inject(MateriasService);

  ngOnInit(): void {
    this.materiasService.obtenerMaterias().subscribe({
      next: (data) => {
        this.resumenMaterias.set(data.slice(0, 4));
      },
      error: (err) => console.error('Error al cargar resumen:', err),
    });
  }
}
