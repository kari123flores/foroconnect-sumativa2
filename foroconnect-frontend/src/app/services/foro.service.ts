
import { Injectable } from '@angular/core';

export interface Comentario {
  id: number;
  texto: string;
  autor: string;
  baneado: boolean;
}

export interface Publicacion {
  id: number;
  titulo: string;
  contenido: string;
  categoria: string;
  autor: string;
  fecha: string;
  comentarios: Comentario[];
  baneada: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ForoService {

  private readonly STORAGE_KEY = 'foroconnect_publicaciones';

  private publicaciones: Publicacion[] = [
    {
      id: 1,
      titulo: '¿Qué lenguaje de programación recomiendan?',
      contenido: 'Estoy aprendiendo desarrollo de software y quiero conocer sus recomendaciones.',
      categoria: 'Tecnología',
      autor: 'Kari ForoConnect',
      fecha: '22/11/2026',
      comentarios: [
        {
          id: 1,
          texto: 'Java y TypeScript son buenas opciones.',
          autor: 'Usuario Invitado',
          baneado: false
        }
      ],
      baneada: false
    },
    {
      id: 2,
      titulo: '¿Cuál es tu videojuego favorito?',
      contenido: '¡Compartamos nuestros juegos favoritos!',
      categoria: 'Videojuegos',
      autor: 'Usuario Invitado',
      fecha: '22/11/2026',
      comentarios: [
        {
          id: 2,
          texto: 'League of Legends',
          autor: 'Kari ForoConnect',
          baneado: false
        },
        {
          id: 3,
          texto: 'Valorant',
          autor: 'Usuario Invitado',
          baneado: false
        }
      ],
      baneada: false
    },
    {
      id: 3,
      titulo: 'Recomendaciones musicales',
      contenido: '¿Qué artistas están escuchando últimamente?',
      categoria: 'Música',
      autor: 'Kari ForoConnect',
      fecha: '22/11/2026',
      comentarios: [
        {
          id: 4,
          texto: 'BTS',
          autor: 'Kari ForoConnect',
          baneado: false
        },
        {
          id: 5,
          texto: 'Stray Kids',
          autor: 'Usuario Invitado',
          baneado: false
        }
      ],
      baneada: false
    },
    {
      id: 4,
      titulo: 'Rutinas de entrenamiento',
      contenido: '¿Qué ejercicios recomiendan para empezar en el gimnasio?',
      categoria: 'Deportes',
      autor: 'Usuario Invitado',
      fecha: '22/11/2026',
      comentarios: [],
      baneada: false
    },
    {
      id: 5,
      titulo: '¡Bienvenidos a ForoConnect!',
      contenido: 'Preséntate y conoce a nuestra comunidad.',
      categoria: 'Comunidad',
      autor: 'Administrador Foro',
      fecha: '22/11/2026',
      comentarios: [
        {
          id: 6,
          texto: '¡Hola a todos!',
          autor: 'Kari ForoConnect',
          baneado: false
        }
      ],
      baneada: false
    }
  ];

  constructor() {
    this.cargarPublicaciones();
  }

  obtenerPublicaciones(): Publicacion[] {
    return this.publicaciones;
  }

  guardarPublicaciones(): void {
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(this.publicaciones)
    );
  }

  private cargarPublicaciones(): void {
    const datosGuardados = localStorage.getItem(this.STORAGE_KEY);

    if (!datosGuardados) {
      this.guardarPublicaciones();
      return;
    }

    try {
      const datos = JSON.parse(datosGuardados);

      if (Array.isArray(datos)) {
        this.publicaciones = datos;
      }
    } catch {
      console.error('Error al cargar las publicaciones.');
      this.guardarPublicaciones();
    }
  }
}
