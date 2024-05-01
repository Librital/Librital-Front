export class Libro {

  id_libro? : number;
  titulo: string;
  autor: string;
  editorial: string;
  fecha: string;
  descripcion: string;
  portada: string;
  isbn13: string;
  isbn10: string;
  es_activo: boolean;

  constructor(titulo: string, autor: string, editorial: string, fecha: string, descripcion: string, portada: string, isbn13: string, isbn10: string, es_activo: boolean) {
    this.titulo = titulo;
    this.autor = autor;
    this.editorial = editorial;
    this.fecha = fecha;
    this.descripcion = descripcion;
    this.portada = portada;
    this.isbn13 = isbn13;
    this.isbn10 = isbn10;
    this.es_activo = es_activo;
  }
}
