
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;
  mensaje = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      correo: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]]
    });
  }

  iniciarSesion(): void {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      this.mensaje = 'Por favor, revisa los datos ingresados.';
      return;
    }

    const { correo, password } = this.loginForm.value;

    const accesoCorrecto = this.authService.iniciarSesion(
      correo,
      password
    );

    if (!accesoCorrecto) {
      this.mensaje = 'Correo o contraseña incorrectos.';
      return;
    }

    this.mensaje = '';
    this.router.navigate(['/foro']);
  }
}
