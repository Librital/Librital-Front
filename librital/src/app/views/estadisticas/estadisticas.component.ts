import { Component } from '@angular/core';

import {NgxEchartsDirective, NgxEchartsModule} from 'ngx-echarts';
import * as echarts from 'echarts';
import {EChartsOption} from "echarts";

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [
    NgxEchartsDirective,
  ],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.scss'
})
export class EstadisticasComponent {


  option:EChartsOption = {
    title: {
      text: 'Referer of a Website',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: 'Search Engine' },
          { value: 735, name: 'Direct' },
          { value: 580, name: 'Email' },
          { value: 484, name: 'Union Ads' },
          { value: 300, name: 'Video Ads' }
        ],
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
