
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-recuperar-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recuperar-password.component.html',
  styleUrl: './recuperar-password.component.css'
})
export class RecuperarPasswordComponent {

  recuperarForm: FormGroup;
  mensaje = '';
  enviado = false;

  constructor(private fb: FormBuilder) {
    this.recuperarForm = this.fb.group({
      correo: ['', [
        Validators.required,
        Validators.email
      ]]
    });
  }

  recuperar() {
    this.recuperarForm.markAllAsTouched();

    if (this.recuperarForm.invalid) {
      this.mensaje = 'Ingresa un correo electrónico válido.';
      this.enviado = false;
      return;
    }

    this.mensaje =
      'Solicitud de recuperación simulada correctamente.';
    this.enviado = true;
  }
}
