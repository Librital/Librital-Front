import { Component } from '@angular/core';

import {NgxEchartsDirective, NgxEchartsModule} from 'ngx-echarts';
import * as echarts from 'echarts';
import {EChartsOption} from "echarts";
import {Libro} from "../../models/libro";
import {NgForOf, NgIf} from "@angular/common";
import {LibroService} from "../../services/libro.service";
import {environment} from "../../../environments/environment";
import {LoadingSpinnerComponent} from "../loading-spinner/loading-spinner.component";
import {Router} from "@angular/router";
import {CategoriaService} from "../../services/categoria.service";
import {FooterComponent} from "../footer/footer.component";

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [
    NgxEchartsDirective,
    NgForOf,
    LoadingSpinnerComponent,
    NgIf,
    FooterComponent,
  ],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.scss'
})
export class EstadisticasComponent {

  isLoading = false;

  mejoresLibrosPerCategoria: any[] = []
  votosLibros = [];

  optionChartLibrosPerCategoria: echarts.EChartsOption = {};
  optionChartBestCategoria: echarts.EChartsOption = {};

  listaDatosLibrosPerCategoria = [];
  listaDatosBestCategorias = [];


  protected readonly decodeURIComponent = decodeURIComponent;
  protected readonly environment = environment;
  constructor(private libroService: LibroService, private categoriaService: CategoriaService,private route: Router) { }


  ngOnInit() {
    this.comprobarExistePag();
    this.comprobarExisteBusqueda();

    this.obtenerMejoresLibrosPerCategoria();

    this.cargarChartLibrosPerCategoria();
    this.cargarLibroBestCategory();

  }


  public comprobarExistePag() {

    if (this.libroService.obtenerPaginaActual() != null) {
      this.libroService.eliminarPaginaActual();
    }
  }

  public comprobarExisteBusqueda() {
    if (this.libroService.obtenerFiltroBusqueda() != null) {
      this.libroService.eliminarBusqueda();
    }
  }





  public comprobarTitulo(titulo : string) {
    if (titulo.length > 40) {
      return titulo.substring(0, 40) + '...';
    }
    return titulo;
  }

  public comprobarAutor(autor: string) {
    if (autor.length > 30) {
      return autor.substring(0, 30) + '...';
    }
    return autor;
  }






  public obtenerMejoresLibrosPerCategoria() {

    this.libroService.obtenerMejoresLibrosPerCategoria().subscribe((data: any) => {
      if (data.message == 'Obtenido') {
        console.log(data);
        this.mejoresLibrosPerCategoria = data.libros;
        this.votosLibros = data.num_votos;
        /*for (let i = 0; i < data.libros.length; i++) {
          console.log(data.libros);
          console.log(data.libros[i]);
          this.mejoresLibrosPerCategoria.push(data.libros[i]);
        }
        console.log(this.mejoresLibrosPerCategoria);*/
      }
    });

  }


  public irLibroId(id_libro: any) {
    this.route.navigate(['/libro-info/', id_libro]);
  }

  public transformarDatos(dataChart: any[], nombreCampo: string, valorCampo: string) {
    return dataChart.map((item: any) => ({
      name: item[nombreCampo],
      value: item[valorCampo]
    }));
  }



  public cargarChartLibrosPerCategoria(): void {

    this.categoriaService.obtenerLibrosPerCategoria().subscribe((data: any) => {

      if (data.message == 'Obtenido') {
        this.listaDatosLibrosPerCategoria = data.libros_por_categoria;

        const dataChart = this.transformarDatos(this.listaDatosLibrosPerCategoria, 'name', 'value');

        this.optionChartLibrosPerCategoria = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '0%',
            right: '0%',
            bottom: '15%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: dataChart.map((item: { name: any }) => item.name),
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              interval: 0,
              rotate: 45
            }
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: 'Nº libros',
              type: 'bar',
              barWidth: '60%',
              data: dataChart.map((item: { value: any }) => item.value),
            }
          ]
        };
      }
    });

  }

  public cargarLibroBestCategory() {

    this.categoriaService.obtenerBestCategorias().subscribe((data: any) => {

      if (data.message == 'Obtenido') {
        this.listaDatosBestCategorias = data.mejores_categorias;

        const dataChart = this.transformarDatos(this.listaDatosBestCategorias, 'nombre', 'ranking');

        console.log(dataChart);


        this.optionChartBestCategoria = {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'horizontal',
            bottom: 'bottom'
          },
          series: [
            {
              name: 'Access From',
              type: 'pie',
              radius: '50%',
              data: dataChart,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };



      }
    });



  }


}
