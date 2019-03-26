import {
   Component,
   OnInit,
   AfterViewInit
} from '@angular/core';
import {
   DataParserService
} from '../../core/data-parser/data-parser.service';
import {
   Router
} from '@angular/router';
import * as Highcharts from 'highcharts';
import highcharts3D from 'highcharts/highcharts-3d.src';
highcharts3D(Highcharts);
@Component({
   selector: 'app-protein-viewer',
   styleUrls: ["./protein.css"],
   template: ` 
           <br><a tabindex = '0'class="btn bg-primary text-white" (click)="enterNavigator()" (keydown) = "keyVerifier($event)">
               Iniciar navegação
            </a>
               <highcharts-chart
               [Highcharts] = "highcharts" 
               [options] = "chartOptions" 
               style = "width: 100%; height: 120vh; display: block;">
               </highcharts-chart>
            `
})

export class ProteinViewerComponent implements OnInit, AfterViewInit {
   constructor(private _parserService: DataParserService, private _router: Router) {}
   private aminoData = this._parserService.parseAminoData();
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
      series: [{data:this.getData()}]
   };
   ngOnInit() {
       if(this.aminoData === undefined) 
         this._router.navigate(['/menu']);
   }
   ngAfterViewInit() {
      // for(let x = 0; x < this.aminoData.length;x++){
      //    console.log("UP:"+this.aminoData[x]._downSound);
      //    console.log("DOWN:"+this.aminoData[x]._upSound);
      // }
   }
   getData() {
      return this.aminoData;
   }
   enterNavigator() {
      let aux = document.getElementsByClassName('highcharts-series-group')[0].children[1].children;
      let pointsIdx = Highcharts.charts[0].series[0].points
      for (let index = 0; index != aux.length; index++)
         if (aux[index].getAttribute("tabindex") == '1') {
            (aux[index] as HTMLElement).focus();
            break;
         }
   }
   keyVerifier(event: KeyboardEvent) {
      if (event.keyCode == 13)
         this.enterNavigator();
   }
}