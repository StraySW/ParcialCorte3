import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { API_BASE_URL } from './api-url.generated';

export interface UserSession {
  id?: string;
  cc?: string;
  nombre?: string;
  apellido?: string;
  email: string;
  rol?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly apiUrl = `${API_BASE_URL}/auth`;

  readonly currentUser = signal<UserSession | null>(this.getInitialUser());
  readonly isLoggedIn = computed(() => this.currentUser() !== null);

  private getInitialUser(): UserSession | null {
    if (!this.isBrowser) return null;
    const stored = localStorage.getItem('estudiante_sesion');
    if (!stored) return null;
    try {
      return JSON.parse(stored) as UserSession;
    } catch {
      return null;
    }
  }

  login(email: string, password: string): Observable<{ success: boolean; message: string; usuario?: any }> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((res) => {
        if (res && res.usuario) {
          this.currentUser.set(res.usuario);
          if (this.isBrowser) {
            localStorage.setItem('estudiante_sesion', JSON.stringify(res.usuario));
          }
        }
      }),
      catchError((err) => {
        const msg = err?.error?.message || 'Error al conectar con el servidor de autenticación';
        return of({ success: false, message: msg });
      })
    );
  }

  registro(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registro`, user);
  }

  logout(): void {
    this.currentUser.set(null);
    if (this.isBrowser) {
      localStorage.removeItem('estudiante_sesion');
    }
    this.router.navigate(['/login']);
  }
}
