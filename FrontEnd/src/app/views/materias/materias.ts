import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { MateriasService } from '../../servicios/materias.service';
import { GenericTable } from '../../componentes/table/generic-table';

@Component({
  selector: 'app-materias',
  standalone: true,
  imports: [CommonModule, GenericTable],
  templateUrl: './materias.html',
  styleUrl: './materias.css',
})
export class Materias implements OnInit {
  todasLasMaterias = signal<any[]>([]);
  materiasFiltradas = signal<any[]>([]);

  private readonly materiasService = inject(MateriasService);

  ngOnInit(): void {
    this.materiasService.obtenerMaterias().subscribe({
      next: (data) => {
        this.todasLasMaterias.set(data);
        this.materiasFiltradas.set(data);
      },
      error: (err) => console.error('Error al obtener materias:', err),
    });
  }

  filtrar(termino: string): void {
    const q = (termino || '').toLowerCase().trim();
    if (!q) {
      this.materiasFiltradas.set(this.todasLasMaterias());
      return;
    }
    const filtrado = this.todasLasMaterias().filter((item) =>
      Object.values(item).some((val) => String(val).toLowerCase().includes(q))
    );
    this.materiasFiltradas.set(filtrado);
  }
}
