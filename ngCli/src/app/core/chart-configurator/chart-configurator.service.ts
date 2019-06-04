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
       type: 'scatter',
       marginBottom: 100,
       marginRight: 50,
       options3d: {
          enabled: true,
          alpha: 0,
          beta: 0,
          depth: 0,
          viewDistance: 100,
          frame:{
             bottom :{
                size: 1,
                color: 'rgba(0, 0, 0, 0.02)'
             },
             back :{
                size: 1,
                color: 'rgba(0, 0, 0, 0.04)'
             },
             side :{
                size: 1,
                color: 'rgba(0, 0, 0, 0.06)'
             }
          }
       },
    },
  accessibility:{
    keyboardNavigation:{
      wrapAround:true,
      mode:"serialize",
      focusBorder:{
        margin: 5,
        style:{
          color:"green",
          lineWidth:5,
          borderRadius:10
        }
      }
    }
  },
    plotOptions: {
      series: {
          marker: {
              fillColor: 'black',
              radius: 5 // inherit from series
          },
          dataLabels: {
            enabled: true,
            formatter: function ()  {      
              return this.point['init'];
          }
        }
      }
  },
    title : {
       text: undefined
    },
    xAxis:{
       min:0,
       max:size,
       title:{text: undefined}
    }, 
    yAxis:{
       min:0,
       max:size,
       title:{text: undefined}
    },
    zAxis:{
       min:0,
       max:size   
    },
    series : [{
      lineWidth: 1,
      lineColor: 'black',
      showInLegend: false,
      data: data,
      }],
      tooltip:{
        formatter: function(){
          return "<b>Nome do aminoácido: "+this.key+"<br>Posição: "+Number(this.point['index']+1) + "</b>";
        }
      }
 };
  }
}