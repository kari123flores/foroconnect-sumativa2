
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  registroForm: FormGroup;
  mensaje = '';
  registrado = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      correo: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        Validators.pattern(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/
        )
      ]],
      confirmarPassword: ['', Validators.required]
    }, {
      validators: this.validarContrasenas
    });
  }

  validarContrasenas(
    control: AbstractControl
  ): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmar = control.get('confirmarPassword')?.value;

    return password === confirmar
      ? null
      : { contrasenasDistintas: true };
  }

  registrar(): void {
    this.registroForm.markAllAsTouched();

    if (this.registroForm.invalid) {
      this.mensaje = 'Revisa los datos del formulario.';
      this.registrado = false;
      return;
    }

    const { nombre, correo, password } = this.registroForm.value;

    const creado = this.authService.registrarUsuario(
      nombre.trim(),
      correo.trim(),
      password
    );

    if (!creado) {
      this.mensaje = 'Este correo ya está registrado.';
      this.registrado = false;
      return;
    }

    this.registrado = true;
    this.mensaje = '¡Cuenta creada correctamente!';

    this.router.navigate(['/login']);
  }
}
