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
import {
   TalkerService
} from '../../core/talker/talker.service';
import {
   Aminoacid
} from '../../interfaces/aminoacid';
import * as $ from 'jquery';
highcharts3D(Highcharts);
@Component({
   selector: 'app-protein-viewer',
   styleUrls: ['./protein.css'],
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
   private structureInf = this._parserService.parseStructureInfo();
   private firstTab: number;
   highcharts = Highcharts;
   chartOptions = {
      chart: {
         tooltip:false,
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
      plotOptions:{
         series: {lineWidth: 1}
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
            formatter : function() {
               return this.point.name;
            }
         },
         data: this.getData(),
         zones : this.markZones()
      }]
   };
   ngOnInit() {
      if (this.aminoData === undefined) {
         this._router.navigate(['/menu']);
      }

   }

   ngAfterViewInit() {
      const plotPoints = document.getElementsByClassName('highcharts-series-group')[0].children[1].children;
      const objectsPoints = this.highcharts.charts[0].series[0].points;
      for (let x = 0; x < plotPoints.length; x++) {
         plotPoints[x].addEventListener('keydown', (e) => {
            const auxIndex = Number(plotPoints[x].getAttribute('tabindex')) - 1;
            this.event(e, objectsPoints[auxIndex]);
         });
      }
      const chart = this.highcharts.charts[0];
      $(chart.container).bind('mousedown.hc touchstart.hc', function(eStart) {
         eStart = chart.pointer.normalize(eStart);
         const posX = eStart.pageX;
         const posY = eStart.pageY;
         const alpha = chart.options.chart.options3d.alpha;
         const beta = chart.options.chart.options3d.beta;
         let newAlpha;
         let newBeta;
         const sensitivity = 5; // lower is more sensitive
         $(document).bind({
           'mousemove.hc touchdrag.hc': function(e) {
             newBeta = beta + (posX - e.pageX) / sensitivity;
             chart.options.chart.options3d.beta = newBeta;
             newAlpha = alpha + (e.pageY - posY) / sensitivity;
             chart.options.chart.options3d.alpha = newAlpha;
             chart.redraw(false);
           },
           'mouseup touchend': function() {
             $(document).unbind('.hc');
           }
         });
       });
   }
   getData() {
      return this.aminoData;
   }
   enterNavigator() {
      const aux = document.getElementsByClassName('highcharts-series-group')[0].children[1].children;
      if (this.firstTab !== undefined) {
         (aux[this.firstTab] as HTMLElement).focus();
      }
      for (let index = 0; index !== aux.length; index++) {
         if (aux[index].getAttribute('tabindex') === '1') {
            (aux[index] as HTMLElement).focus();
            this.firstTab = index;
            break;
         }
      }
   }
   keyVerifier(event: KeyboardEvent) {
      if (event.keyCode === 13) {
         this.enterNavigator();
      }
   }
   event(event, data) {
      if (event.keyCode === 32 || event.keyCode === 13) { // Spacekey
         this.talkGenInfo(data);
      }
      if (event.keyCode === 9) {
         this.talkTransition(event, data);
      }
   }
   talkGenInfo(data: Aminoacid) {
      let message = 'Posição atual: ' + this.getAminoName(data.name);
      if (data._isFirst) {
         message += '. Primeiro resíduo';
      } else if (data._isLast) {
         message += '. Último resíduo';
      }
      if (data._isFirstHelix) {
         message += '. Início de Hélice';
      } else if (data._isLastHelix) {
         message += '. Fim de Hélice';
      } else if (data._isHelix) {
         message += '. Dentro de Hélice';
      }
      if (data._isFirstSheet) {
         message += '. Início de Fita';
      } else if (data._isLastSheet) {
         message += '. Fim de Fita';
      } else if (data._isSheet) {
         message += '. Dentro de Fita';
      }
      return TalkerService.speak(message);
   }
   talkTransition(key: KeyboardEvent, data: any) {
      let message: string;
      if (key.keyCode === 9) {
         if (key.shiftKey) {
            message = data['_downSound'];
         } else {
            message = data['_upSound'];
         }
      }
         return TalkerService.speak(message);
   }
   getAminoName(AminoName) {
      switch (AminoName) {
         case 'PHE':
            return 'Fenilalanina';
         case 'ALA':
            return 'Alanina';
         case 'MET':
            return 'Metionina';
         case 'LYS':
            return 'Lisina';
         case 'GLU':
            return 'Glutamina';
         case 'PRO':
            return 'Prolina';
         case 'SER':
            return 'Serina';
         case 'LEU':
            return 'Leucina';
         case 'ILE':
            return 'Isoleucina';
         case 'THR':
            return 'Treonina';
         case 'CYS':
            return 'Cisteína';
         case 'TYR':
            return 'Tirosina';
         case 'ASN':
            return 'Asparagina';
         case 'GLN':
            return 'Glutamina';
         case 'GLU':
            return 'Ácido Glutâmico';
         case 'ARG':
            return 'Arginina';
         case 'HYS':
            return 'Histidina';
         case 'TRP':
            return 'Triptofano';
         case 'ASP':
            return 'Ácido Aspártico';
         case 'GLY':
            return 'Glicina';
      }
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
}