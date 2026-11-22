
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, Usuario } from '../../services/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {

  perfilForm: FormGroup;
  mensaje = '';
  guardado = false;

  usuario: Usuario | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.usuario = this.authService.obtenerUsuarioActual();

    this.perfilForm = this.fb.group({
      nombre: [this.usuario?.nombre || '', [
        Validators.required,
        Validators.minLength(3)
      ]],
      correo: [this.usuario?.correo || '', [
        Validators.required,
        Validators.email
      ]]
    });

    if (!this.usuario) {
      this.router.navigate(['/login']);
    }
  }

  guardarCambios(): void {
    this.perfilForm.markAllAsTouched();

    if (this.perfilForm.invalid) {
      this.mensaje = 'Revisa los datos ingresados.';
      this.guardado = false;
      return;
    }

    const { nombre, correo } = this.perfilForm.value;

    const actualizado = this.authService.actualizarPerfil(
      nombre.trim(),
      correo.trim()
    );

    if (!actualizado) {
      this.mensaje = 'No se pudo actualizar el perfil. Revisa el correo.';
      this.guardado = false;
      return;
    }

    this.usuario = this.authService.obtenerUsuarioActual();
    this.mensaje = 'Perfil actualizado correctamente.';
    this.guardado = true;
  }
}
