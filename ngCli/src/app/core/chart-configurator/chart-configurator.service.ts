import {
  Injectable
} from '@angular/core';
import {
  DataParserService
} from "../data-parser/data-parser.service";
@Injectable({
  providedIn: 'root'
})
export class ChartConfiguratorService {
  private aminoData = this._parserService.parseAminoData();
  private structureInf = this._parserService.parseStructureInfo();
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
      text: '3D Scatter Plot'
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
      ax: 100
    },
    series: [{
      dataLabels: {
        enabled: true,
        formatter: function () {
          return this.point.name;
        }
      },
      data: this.getData(),
      zones: this.markZones()
    }]
};
constructor(private _parserService: DataParserService) {}
getData() {
  return this.aminoData;
}
markZones(){
  const helix = this.structureInf['helix'];
  const sheet = this.structureInf['sheet'];
  const HELIX_COLOR = "red";
  const SHEET_COLOR = "orange";
  const DEFAULT_COLOR = "blue";
  let zones = [];
  while(helix.length > 0 || sheet.length > 0){
     let zoneStart,zoneEnd, colorZone;
     if(helix.length > 0 && sheet.length > 0){
        if(helix[0] > sheet[0]){
           let values = helix.shift() 
           zoneStart = values[0] 
           zoneEnd = values[1]
           colorZone = HELIX_COLOR;
        }
        else{
           let values = helix.shift() 
           zoneStart = values[0]
           zoneEnd = values[1]
           colorZone = SHEET_COLOR;
        }
     }
     else if(helix.length > 0){
        let values = helix.shift() 
        zoneStart = values[0]
        zoneEnd = values[1]
        colorZone = HELIX_COLOR
     }
     else{
        let values = helix.shift() 
        zoneStart = values[0]
        zoneEnd = values[1]
        colorZone = SHEET_COLOR;
     }
     const zoneObj = [{
        value: zoneStart,
        color: DEFAULT_COLOR 
     },
     {
        value: zoneEnd,
        color: colorZone 
     }
     ]
     zones.push(zoneObj[0]);
     zones.push(zoneObj[1]);
  }
  return zones;
}
getChartConfigurations() {

  return this.chartOptions;
}
}