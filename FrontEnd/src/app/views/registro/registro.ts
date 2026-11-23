import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  registroForm: FormGroup = this.fb.group({
    cc: ['', [Validators.required, Validators.pattern(/^[0-9]{6,12}$/)]],
    nombres: ['', [Validators.required, Validators.minLength(2)]],
    apellidos: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.pattern(/^[0-9]{7,15}$/)]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  cargando = false;

  get cc() {
    return this.registroForm.get('cc');
  }

  get nombres() {
    return this.registroForm.get('nombres');
  }

  get apellidos() {
    return this.registroForm.get('apellidos');
  }

  get email() {
    return this.registroForm.get('email');
  }

  get telefono() {
    return this.registroForm.get('telefono');
  }

  get password() {
    return this.registroForm.get('password');
  }

  registrarse(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor completa todos los campos requeridos correctamente.',
        confirmButtonColor: '#003366',
      });
      return;
    }

    const val = this.registroForm.value;
    this.cargando = true;

    Swal.fire({
      title: 'Registrando estudiante...',
      text: 'Creando cuenta en el Portal UNIMINUTO',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.authService.registro(val).subscribe({
      next: (res: any) => {
        this.cargando = false;
        Swal.fire({
          icon: 'success',
          title: `¡Bienvenido, ${val.nombres}!`,
          text: 'Tu registro ha sido completado exitosamente.',
          timer: 1600,
          showConfirmButton: false,
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err: any) => {
        this.cargando = false;
        const msg = err?.error?.message || 'Error al completar el registro.';
        Swal.fire({
          icon: 'error',
          title: 'Error de registro',
          text: msg,
          confirmButtonColor: '#003366',
        });
      },
    });
  }
}
