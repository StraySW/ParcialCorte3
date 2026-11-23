import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  loginForm: FormGroup = this.fb.group({
    email: ['santiago.waltero@uniminuto.edu.co', [Validators.required, Validators.email]],
    password: ['Estudiante123*', [Validators.required, Validators.minLength(4)]],
  });

  cargando = false;

  ngOnInit(): void {
    // Si ya tiene sesión activa, redirige al inicio
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/inicio']);
    }
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  iniciarSesion(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor ingresa un correo válido y tu contraseña institucional.',
        confirmButtonColor: '#003366',
      });
      return;
    }

    const { email, password } = this.loginForm.value;
    this.cargando = true;

    Swal.fire({
      title: 'Iniciando sesión...',
      text: 'Verificando tus datos en el Portal UNIMINUTO',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.authService.login(email, password).subscribe({
      next: (res: any) => {
        this.cargando = false;
        if (res && res.usuario) {
          Swal.fire({
            icon: 'success',
            title: `¡Bienvenido, ${res.usuario.nombre || 'Santiago'}!`,
            text: 'Acceso concedido al Portal Académico.',
            timer: 1400,
            showConfirmButton: false,
          }).then(() => {
            this.router.navigate(['/inicio']);
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Credenciales inválidas',
            text: res.message || 'El correo institucional o la contraseña no coinciden.',
            confirmButtonColor: '#003366',
          });
        }
      },
      error: (err: any) => {
        this.cargando = false;
        const msg = err?.error?.message || 'Error al conectar con el servidor académico.';
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: msg,
          confirmButtonColor: '#003366',
        });
      },
    });
  }
}
