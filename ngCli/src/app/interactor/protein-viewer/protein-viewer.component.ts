import {
   Component,
   OnInit,
   AfterViewInit 
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
highcharts3D(Highcharts);
@Component({
   selector: 'app-protein-viewer',
   styleUrls: ['./protein.css'],
   templateUrl: 'protein-viewer.html'
})

export class ProteinViewerComponent implements OnInit, AfterViewInit {
   constructor(private _router: Router, private _chartConfigurator : ChartConfiguratorService, private _data : DataService) {}
   private firstTab: number;
   highcharts = Highcharts;
   seletor = null;
   lastAccess :SVGAElement;
   chartOptions = null;
   quadrant_init: string;
   ngOnInit() {
      this.seletor = this._data.getSeletor();
      this.chartOptions = this._chartConfigurator.getChartConfigurations(this.seletor);
      this.quadrant_init = "Iniciar no "+this._data.getStart();
      if(this.chartOptions === null)
      this._router.navigate(['/menu']);
   }
   goTo(name){
      this._router.navigate([name]).then(()=>{window.location.reload();})
   }
   ngAfterViewInit() {
      if(Highcharts.charts[0] == undefined){
      Highcharts.charts[0] = Highcharts.chart(this.chartOptions);
   }
      // this.configureRotation();
      this.configurePoints();
   }
   init(){
      TalkerService.speak(this.quadrant_init);
      this.enterNavigator();
   }
   enterNavigator() {
      this.setTabindex();
      if(this.lastAccess == undefined)
         this.focusFirstPoint();
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
   keyVerifier(event: KeyboardEvent) {
      if (event.keyCode === 13) {
         this.enterNavigator();
      }
   }
   event(event:any, data) {
      let message: string;
      if (event instanceof KeyboardEvent){
         if (event.keyCode === 65) 
            message = data['message'];
         else if (event.keyCode === 83)
            message = data['transition'];
      }
      else if(event instanceof FocusEvent){
         message = data['message'] + data['transition']
      }
      console.log(this.lastAccess)
   return TalkerService.speak(message);
   }
   configurePoints(){
      const plotPoints = document.getElementsByClassName('highcharts-series-group')[0].children[1].children;
      const data = Highcharts.charts[0].series[0].data;
      for (let x = 0; x < plotPoints.length; x++) {
         plotPoints[x].addEventListener('keydown', (e) => {
            plotPoints[x].setAttribute("aria-hidden", "true");
            this.event(e as KeyboardEvent, data[Number(plotPoints[x].getAttribute('dataIndex'))-1]);
         });
         plotPoints[x].addEventListener('focus', (e) => {
            plotPoints[x].setAttribute("aria-hidden", "true");
            this.event(e, data[Number(plotPoints[x].getAttribute('dataIndex'))-1]);
            this.lastAccess = plotPoints[x];
         });
      }
   }

   trap(position,idFocus, event){
      if(position == "first"){
         if(event.keyCode == 9)
         if (event.keyCode == 13){
            event.preventDefault();
            document.getElementById(idFocus).focus();
         }
      }
      else if(position == "last")
         if(event.keyCode == 9){
            if(event.keyCode != 13){
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