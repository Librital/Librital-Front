export class Anuncio {

  id?: number;
  titulo: string;
  descripcion: string;
  fecha_publicacion: string;
  activo: number;

  idUsuario: number;
  idLibro: number;

  constructor(titulo: string, descripcion: string, fecha_publicacion: string, activo: number, idUsuario: number, idLibro: number) {
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.fecha_publicacion = fecha_publicacion;
    this.activo = activo;

    this.idUsuario = idUsuario;
    this.idLibro = idLibro;
  }

}
