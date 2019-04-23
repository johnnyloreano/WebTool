import {
  Injectable
} from '@angular/core';
import { DataParserService } from '../data-parser/data-parser.service';
@Injectable({
  providedIn: 'root'
})
export class ChartConfiguratorService {
  chartOptions = null
constructor(private dataService: DataParserService) {}

getChartConfigurations(option:string) {
  this.get(option);   
  return this.chartOptions;
}
get(option:string){
  if (option == "test"){
    
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
          lineWidth: 1
        }
      },
      title: {
        text: ''
      },
      xAxis: {
        min: 0,
        max: 5
      },
      yAxis: {
        min: 0,
        max: 5
      },
      zAxis: {
        min: 0,
        max: 5
      },
      series: [{
        dataLabels: {
          enabled: true,
          formatter: function () {
            return this.point.name;
          }
        },
        data: this.dataService.parseTest()
      }]
  };
  }
  else if (option === 'protein'){
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
          lineWidth: 1
        }
      },
      title: {
        text: ''
      },
      xAxis: {
        min: 0,
        max: 100
      },
      yAxis: {
        min: 0,
        max: 100
      },
      zAxis: {
        min: 0,
        max: 100
      },
      series: [{
        dataLabels: {
          enabled: true,
          formatter: function () {
            return this.point.name;
          }
        },
        data: this.dataService.parseAminoData(),
      }]
  };
  }
}
}