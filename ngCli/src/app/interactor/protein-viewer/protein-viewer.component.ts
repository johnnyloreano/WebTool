import {
   Component,
   OnInit
} from '@angular/core';
import {
   Router
} from '@angular/router';
import {
   ChartConfiguratorService
} from "../../core/chart-configurator/chart-configurator.service";
import * as Highcharts from 'highcharts';
import highcharts3D from 'highcharts/highcharts-3d.src';
import {
   TalkerService
} from '../../core/talker/talker.service';
// import * as $ from 'jquery';
import { DataService } from '../../core/data-service/data-service.service';
import AccessibilityModule from 'highcharts/modules/accessibility';
highcharts3D(Highcharts);
AccessibilityModule(Highcharts);
@Component({
   selector: 'app-protein-viewer',
   styleUrls: ['./protein.css'],
   templateUrl: 'protein-viewer.html'
})

export class ProteinViewerComponent implements OnInit {
   constructor(private _router: Router, private _chartConfigurator : ChartConfiguratorService, private _data : DataService) {}
   private firstTab: number; 
   seletor = null;
   lastAccess :SVGAElement;
   chartOptions = null;
   quadrant_init: string;
   ngOnInit() {
      this.seletor = this._data.getSeletor();
      this.chartOptions = this._chartConfigurator.getChartConfigurations(this.seletor);
      if(this.chartOptions === null)
         this._router.navigate(['/menu']);
      Highcharts.chart('pv', this.chartOptions);
      this.configurePoints()
   }
   init(){
      this.setTabindex();
      if(this.lastAccess == undefined){
         TalkerService.speak("Iniciar no "+this._data.getStart());         
         this.focusFirstPoint();
      }
      else
         this.lastAccess.focus();
   }
   focusFirstPoint(){
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
   setTabindex(){
      const plotPoints = document.getElementsByClassName('highcharts-series-group')[0].children[1].children;
      for(let x = 0; x < plotPoints.length;x++){
         const dataIndex = plotPoints[x].getAttribute('dataIndex');
         plotPoints[x].setAttribute("tabindex", String(dataIndex));
      }
   }
   event(event:any, data) {
      let message: string;
      if (event instanceof KeyboardEvent){
         if (event.keyCode === 65) 
            message = data['message'];
         else if (event.keyCode === 83)
            message = data['transition'];
         else if(event.keyCode === 87)
            message = "Iniciar no "+this._data.getStart();
      }
      else if(event instanceof FocusEvent){
         message = data['message'] + data['transition']
      }
   return TalkerService.speak(message);
   }
   configurePoints(){
      const data = Highcharts.charts[0].series[0].data;
      const plotPoints = Array.from(document.getElementsByClassName('highcharts-series-group')[0].children[1].children);
      plotPoints.sort(function(a,b) {
         var x = a.point['index'];
         var y = b.point['index'];
         return x < y ? -1 : x > y ? 1 : 0;
     });
      for (let x = 0; x < plotPoints.length; x++) {
         plotPoints[x].addEventListener('keydown', (e) => {
            plotPoints[x].setAttribute("aria-hidden", "true");
            this.event(e as KeyboardEvent, data[x]);
         });
         plotPoints[x].addEventListener('focus', (e) => {
            this.event(e, data[x]);
            console.log(plotPoints[x])
            this.lastAccess = (plotPoints[x] as SVGAElement);
         });
      }
   }
   trap(position,idFocus, event){
      if(position == "first"){
         if(event.keyCode == 9){
            if( event.keyCode == 16){
               event.preventDefault();
               document.getElementById(idFocus).focus();
         }
      }
      }
      else if(position == "last")
         if(event.keyCode == 9){
            if(event.keyCode != 16){
               event.preventDefault();
               document.getElementById(idFocus).focus();
         }
      }
   }
   enableFinish(){
      document.getElementById('finish').hidden = false;
      document.getElementById('finish').setAttribute("aria-hidden","false");
      document.getElementById('finish').tabIndex = 0;
      document.getElementById('finish').focus();
   }
   disableFinish(){
      document.getElementById('finish').hidden = true;
      document.getElementById('finish').setAttribute("aria-hidden","true");
      document.getElementById('finish').tabIndex = -1;
   }

} 