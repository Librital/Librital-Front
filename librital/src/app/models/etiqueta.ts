export class Etiqueta {
  id?: number;
  nombre: string;

  id_libro: number;
  id_usuario: number;


  constructor(nombre: string, id_libro: number, id_usuario: number) {
    this.nombre = nombre;

    this.id_libro = id_libro;
    this.id_usuario = id_usuario;
  }

}
