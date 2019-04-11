import {
  Injectable
} from '@angular/core';
import { DataParserService } from '../data-parser/data-parser.service';
@Injectable({
  providedIn: 'root'
})
export class ChartConfiguratorService {
  private testData = this.dataService.parseTest();
  private aminoData = this.dataService.parseAminoData();
  chartOptions = {
    chart: {
      tooltip: false,
      type: 'scatter',
      marginBottom: 100,
      marginRight: 50,
      options3d: {
        enabled: true,
        alpha: 10,
        beta: 30,
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
      data: this.getData(),
    }]
};
constructor(private dataService: DataParserService) {}
getData() {
  alert("Hello")
  return this.aminoData;
}
getChartConfigurations() {
  return this.chartOptions;
}
}