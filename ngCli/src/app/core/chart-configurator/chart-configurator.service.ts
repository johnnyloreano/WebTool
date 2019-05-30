import {
  Injectable
} from '@angular/core';
import {DataService} from "../data-service/data-service.service";

@Injectable({
  providedIn: 'root'
})

export class ChartConfiguratorService {
  chartOptions = null
constructor(private dataService: DataService) {}
getChartConfigurations(option:string) {
  this.get(option);   
  return this.chartOptions;
}
get(option:string){
  let data;
  let size;

  if (option == "test"){
    data = this.dataService.getTest()['pTest']
    size = 5
  }
  else {
    data = this.dataService.getResidues()
    size = 100
  }
  if (data === null)
    return null;
    this.chartOptions = {
      chart: {
        tooltip: false,
        type: 'scatter',
        marginBottom: 100,
        marginRight: 50,
        options3d: {
          enabled: true,
          alpha: 0,
          beta: 0,
          depth: 600,
          viewDistance: 5,
          frame: {
            bottom: {
              size: 1,
              color: 'rgba(0, 0, 0, 0.02)'
            },
            back: {
              size: 1,
              color: 'rgba(0, 0, 0, 0.04)'
            },
            side: {
              size: 1,
              color: 'rgba(0, 0, 0, 0.06)'
            }
          }
        },
      },
      plotOptions: {
        series: {
          showInLegend: false,
          lineWidth: 1,
          marker: {
            radius: 6
        },
        }
      },
      title: {
        text: ''
      },
      xAxis: {
        min: 0,
        max: size
      },
      yAxis: {
        title: {
          text: null
      },
        min: 0,
        max: size
      },
      zAxis: {
        min: 0,
        max: size
      },
      series: [{
        enableMouseTracking: false,
        color:"black",
        dataLabels: {
          enabled: true,
          formatter: function () {
            return this.point.name;
          }
        },
        data: data,
      }]
  };
  }
}