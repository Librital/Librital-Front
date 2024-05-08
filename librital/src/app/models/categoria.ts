export class Categoria {

  id?: number;
  nombre: string;
  descripcion: string;
  es_activo: number;
  img: string;

  sub_categoria_id: number | null;

  constructor(nombre: string, descripcion: string, es_activo: number, img: string, sub_categoria_id: number | null) {
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.es_activo = es_activo;
    this.img = img;
    this.sub_categoria_id = sub_categoria_id;
  }
}
