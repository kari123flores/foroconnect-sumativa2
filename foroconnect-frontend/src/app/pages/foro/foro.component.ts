
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, Rol } from '../../services/auth.service';
import {
  ForoService,
  Publicacion,
  Comentario
} from '../../services/foro.service';

@Component({
  selector: 'app-foro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './foro.component.html',
  styleUrl: './foro.component.css'
})
export class ForoComponent {

  nombreUsuario = '';
  rolUsuario: Rol = 'USUARIO';

  categorias = [
    'Tecnología',
    'Videojuegos',
    'Música',
    'Deportes',
    'Comunidad'
  ];

  categoriaSeleccionada = 'Todas';
  busqueda = '';

  mostrarFormulario = false;
  nuevoTitulo = '';
  nuevoContenido = '';
  nuevaCategoria = 'Tecnología';

  comentariosNuevos: { [id: number]: string } = {};

  publicaciones: Publicacion[] = [];

  constructor(
    private authService: AuthService,
    private foroService: ForoService,
    private router: Router
  ) {
    const usuario = this.authService.obtenerUsuarioActual();

    if (usuario) {
      this.nombreUsuario = usuario.nombre;
      this.rolUsuario = usuario.rol;
    } else {
      this.router.navigate(['/login']);
    }

    this.publicaciones = this.foroService.obtenerPublicaciones();
  }

  get publicacionesFiltradas(): Publicacion[] {
    const texto = this.busqueda.toLowerCase().trim();

    return this.publicaciones.filter(publicacion => {
      const coincideCategoria =
        this.categoriaSeleccionada === 'Todas' ||
        publicacion.categoria === this.categoriaSeleccionada;

      const coincideBusqueda =
        publicacion.titulo.toLowerCase().includes(texto) ||
        publicacion.contenido.toLowerCase().includes(texto);

      const visible =
        !publicacion.baneada || this.rolUsuario === 'ADMIN';

      return coincideCategoria && coincideBusqueda && visible;
    });
  }

  comentariosVisibles(publicacion: Publicacion): Comentario[] {
    return publicacion.comentarios.filter(comentario =>
      !comentario.baneado || this.rolUsuario === 'ADMIN'
    );
  }

  crearPublicacion(): void {
    if (!this.authService.estaAutenticado()) {
      this.router.navigate(['/login']);
      return;
    }

    if (
      this.nuevoTitulo.trim().length < 5 ||
      this.nuevoTitulo.trim().length > 120 ||
      this.nuevoContenido.trim().length < 10 ||
      !this.categorias.includes(this.nuevaCategoria)
    ) {
      return;
    }

    const nuevaPublicacion: Publicacion = {
      id: Math.max(0, ...this.publicaciones.map(p => p.id)) + 1,
      titulo: this.nuevoTitulo.trim(),
      contenido: this.nuevoContenido.trim(),
      categoria: this.nuevaCategoria,
      autor: this.nombreUsuario,
      fecha: new Date().toLocaleDateString('es-CL'),
      comentarios: [],
      baneada: false
    };

    this.publicaciones.unshift(nuevaPublicacion);
    this.foroService.guardarPublicaciones();

    this.nuevoTitulo = '';
    this.nuevoContenido = '';
    this.mostrarFormulario = false;
  }

  agregarComentario(publicacion: Publicacion): void {
    if (
      !this.authService.estaAutenticado() ||
      publicacion.baneada
    ) {
      return;
    }

    const texto =
      this.comentariosNuevos[publicacion.id]?.trim();

    if (!texto || texto.length > 500) {
      return;
    }

    const todos = this.publicaciones.flatMap(
      p => p.comentarios
    );

    const nuevoComentario: Comentario = {
      id: Math.max(0, ...todos.map(c => c.id)) + 1,
      texto,
      autor: this.nombreUsuario,
      baneado: false
    };

    publicacion.comentarios.push(nuevoComentario);
    this.foroService.guardarPublicaciones();

    this.comentariosNuevos[publicacion.id] = '';
  }

  cambiarEstadoPublicacion(publicacion: Publicacion): void {
    if (!this.authService.esAdmin()) {
      return;
    }

    publicacion.baneada = !publicacion.baneada;
    this.foroService.guardarPublicaciones();
  }

  cambiarEstadoComentario(comentario: Comentario): void {
    if (!this.authService.esAdmin()) {
      return;
    }

    comentario.baneado = !comentario.baneado;
    this.foroService.guardarPublicaciones();
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}
