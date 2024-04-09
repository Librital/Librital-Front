export class Usuario {
  id? : number;
  nombre : string;
  apellido: string;
  email : string;
  password : string;
  fecha_nacimiento: string;
  tipo: number;
  subscripcion : number;
  es_activo: number;
  img: string;

  constructor(nombre: string, apellido: string, email: string, password: string, fecha_nacimiento: string, tipo: number, subscripcion: number, es_activo: number, img: string) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
    this.password = password;
    this.fecha_nacimiento = fecha_nacimiento;
    this.tipo = tipo;
    this.subscripcion = subscripcion;
    this.es_activo = es_activo;
    this.img = img;
  }


}
