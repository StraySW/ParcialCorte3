import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-url.generated';

@Injectable({ providedIn: 'root' })
export class MateriasService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}`;

  obtenerMaterias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/materias`);
  }

  obtenerCalificaciones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/materias/calificaciones`);
  }

  obtenerHorario(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/materias/horario`);
  }

  obtenerCurriculo(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/materias/curriculo`);
  }

  obtenerPerfil(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/estudiante/perfil`);
  }

  obtenerHistorico(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/estudiante/historico`);
  }
}
