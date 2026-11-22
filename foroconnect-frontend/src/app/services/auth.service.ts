
import { Injectable } from '@angular/core';

export type Rol = 'USUARIO' | 'ADMIN';

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  password: string;
  rol: Rol;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usuarios: Usuario[] = [
    {
      id: 1,
      nombre: 'Kari ForoConnect',
      correo: 'kari@foroconnect.cl',
      password: 'Kari2026!',
      rol: 'USUARIO'
    },
    {
      id: 2,
      nombre: 'Administrador Foro',
      correo: 'admin@foroconnect.cl',
      password: 'Admin2026!',
      rol: 'ADMIN'
    }
  ];

  private usuarioActual: Usuario | null = null;

  iniciarSesion(correo: string, password: string): boolean {
    const usuario = this.usuarios.find(
      u => u.correo.toLowerCase() === correo.toLowerCase()
        && u.password === password
    );

    if (!usuario) {
      return false;
    }

    this.usuarioActual = usuario;
    return true;
  }

  obtenerUsuarioActual(): Usuario | null {
    return this.usuarioActual;
  }

  estaAutenticado(): boolean {
    return this.usuarioActual !== null;
  }

  esAdmin(): boolean {
    return this.usuarioActual?.rol === 'ADMIN';
  }

  cerrarSesion(): void {
    this.usuarioActual = null;
  }

  registrarUsuario(
    nombre: string,
    correo: string,
    password: string
  ): boolean {
    const existe = this.usuarios.some(
      u => u.correo.toLowerCase() === correo.toLowerCase()
    );

    if (existe) {
      return false;
    }

    const nuevoUsuario: Usuario = {
      id: Math.max(0, ...this.usuarios.map(u => u.id)) + 1,
      nombre,
      correo,
      password,
      rol: 'USUARIO'
    };

    this.usuarios.push(nuevoUsuario);
    return true;
  }

  actualizarPerfil(nombre: string, correo: string): boolean {
    if (!this.usuarioActual) {
      return false;
    }

    const correoOcupado = this.usuarios.some(
      u => u.correo.toLowerCase() === correo.toLowerCase()
        && u.id !== this.usuarioActual?.id
    );

    if (correoOcupado) {
      return false;
    }

    this.usuarioActual.nombre = nombre;
    this.usuarioActual.correo = correo;

    return true;
  }
}
