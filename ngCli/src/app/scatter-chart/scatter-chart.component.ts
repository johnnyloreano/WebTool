import { Component , AfterViewInit} from '@angular/core';
import * as Highcharts from 'highcharts';
import highcharts3D from 'highcharts/highcharts-3d.src';
highcharts3D(Highcharts);
@Component({
  selector: 'app-scatter-chart',
  templateUrl: './scatter-chart.component.html',
  styleUrls: ['./scatter-chart.component.css']
})
export class ScatterChartComponent implements AfterViewInit{
   event(keyboard:KeyboardEvent ,values ){
     if(keyboard.keyCode == 9){
      keyboard.preventDefault();
      if(keyboard.shiftKey){}
         //backsound
      else{}
         //frontsound
      }
      if(keyboard.keyCode == 13){}
         // Info
    // WIP
  }
  ngAfterViewInit(){

  }
  highcharts = Highcharts;
   chartOptions = {      
      chart: {         
         type: 'scatter',
         marginBottom: 100,
         marginRight: 50,
         options3d: {
            enabled: true,
            alpha: 10,
            beta: 30,
            depth: 250,
            viewDistance: 5,
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
         }
      },
      title : {
         text: '3D Scatter Plot'   
      },
      xAxis:{
         min:0,
         max:100       
      }, 
      yAxis:{
         min:0,
         max:10       
      },
      zAxis:{
         min:0,
         ax:10     
      },
      series : [{
        dataLabels: {
          enabled :  true,
          formatter:function (){
            return this.point.x;
          }
        },
         name: 'Reading',
         data: [  
            {x:1,y: 6,z: 5,name:"TESTING"}, [8, 7, 9], [1, 3, 4], [4, 6, 8], [5, 7, 7], [6, 9, 6],  
            [7, 0, 5], [2, 3, 3], [3, 9, 8], [3, 6, 5], [4, 9, 4], [2, 3, 3],  
         ]
      }]
   };
   
}

