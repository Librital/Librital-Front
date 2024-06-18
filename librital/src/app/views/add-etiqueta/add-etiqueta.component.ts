import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatDialog,MatDialogRef, MatDialogTitle, MatDialogContent,MatDialogActions,MatDialogClose} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Etiqueta} from "../../models/etiqueta";
import {LibroService} from "../../services/libro.service";
import {NgForOf} from "@angular/common";
import {ToastService} from "../../services/toast.service";

@Component({
  selector: 'app-add-etiqueta',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    NgForOf
  ],
  templateUrl: './add-etiqueta.component.html',
  styleUrl: './add-etiqueta.component.scss'
})
export class AddEtiquetaComponent {

  inputEtiquetaValor: string = '';

  listaEtiquetasCustom: Etiqueta[] = [];

  constructor(public dialogRef: MatDialogRef<AddEtiquetaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {id_user: number, id_libro: number, listaEtiquetas: Etiqueta[]},
              private libroService: LibroService, private toastService: ToastService){
  }

  ngOnInit() {
    this.listaEtiquetasCustom = this.data.listaEtiquetas;

  }


  public cargarEtiquetasCustomUser() {
    this.libroService.cargarEtiquetasCustomUserLibro(this.data.id_user, this.data.id_libro);
  }


  public addEtiquetaLibro() {

    if (this.inputEtiquetaValor == '') {
      this.toastService.clear();
      this.toastService.add({severity:'error', summary: 'Error', detail: 'El valor de la etiqueta no puede estar vacío'});
    } else {

      if (this.inputEtiquetaValor.length < 50) {
        let etiqueta = new Etiqueta(this.inputEtiquetaValor, this.data.id_libro, this.data.id_user);
        this.libroService.addEtiquetaUserLibro(etiqueta);

        this.dialogRef.close();
      } else {
        this.toastService.clear();
        this.toastService.add({severity:'error', summary: 'Error', detail: 'El valor de la etiqueta no puede superar los 50 caracteres'});
      }
    }
  }


  public removeEtiquetaLibro(etiqueta: Etiqueta) {

    let etiquetaEliminar = new Etiqueta(etiqueta.nombre, this.data.id_libro, this.data.id_user);

    this.libroService.removeEtiquetaUserLibro(etiquetaEliminar);
    this.dialogRef.close();
  }




}
