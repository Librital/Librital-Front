export class Mapa {

  id_marker?: number;
  titulo: string;
  descripcion: string;
  latitud: number;
  longitud: number;
  activo: boolean;
  id_usuario: number;

  constructor(titulo: string, descripcion: string, latitud: number, longitud: number, activo: boolean, id_usuario: number) {
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.latitud = latitud;
    this.longitud = longitud;
    this.activo = activo;
    this.id_usuario = id_usuario;
  }
}
