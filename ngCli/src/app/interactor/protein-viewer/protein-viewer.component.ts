import {
   Component,
   OnInit,
   AfterViewInit,
   OnDestroy
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
import * as $ from 'jquery';
import { DataService } from '../../core/data-service/data-service.service';
import { TranscripterService } from '../../core/transcripter/transcripter.service'
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
   chartOptions = null;
   quadrant_init: string;
   ngOnInit() {
      this.seletor = this._data.getSeletor();
      this.chartOptions = this._chartConfigurator.getChartConfigurations(this.seletor);
      this.quadrant_init = "Iniciar no quadrante "+this._chartConfigurator.getQuadrantInit();
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
      this.configurePoints();
   }
   init(){
      TalkerService.speak(this.quadrant_init);
      this.enterNavigator();
   }
   enterNavigator() {
      this.setTabindex();
      this.focusFirstPoint();
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
   event(event, data) {
      if (event.keyCode === 32 || event.keyCode === 13) { // Spacekey
         this.talkGenInfo(data);
      }
      if (event.keyCode === 9) {
         this.talkTransition(event, data);
      }
   }
   talkGenInfo(data: any){
      return TalkerService.speak(data['_genInfo']);
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
   configurePoints(){
      const plotPoints = document.getElementsByClassName('highcharts-series-group')[0].children[1].children;
      const objectsPoints = this.highcharts.charts[0].series[0].points;
      for (let x = 0; x < plotPoints.length; x++) {
         
         plotPoints[x].addEventListener('keydown', (e) => {
            const dataIndex = Number(plotPoints[x].getAttribute('dataIndex')) - 1;
            plotPoints[x].setAttribute("aria-hidden", "true");
            this.event(e, objectsPoints[dataIndex]);
         });
      }
   }
   // configureRotation(){
   //    const chart = this.highcharts.charts[0];
   //    $(chart.container).bind('mousedown.hc touchstart.hc', function(eStart) {
   //       eStart = chart.pointer.normalize(eStart);
   //       const posX = eStart.pageX;
   //       const posY = eStart.pageY;
   //       const alpha = chart.options.chart.options3d.alpha;
   //       const beta = chart.options.chart.options3d.beta;
   //       let newAlpha;
   //       let newBeta;
   //       const sensitivity = 5; // lower is more sensitive
   //       $(document).bind({
   //         'mousemove.hc touchdrag.hc': function(e) {
   //           newBeta = beta + (posX - e.pageX) / sensitivity;
   //           chart.options.chart.options3d.beta = newBeta;
   //           newAlpha = alpha + (e.pageY - posY) / sensitivity;
   //           chart.options.chart.options3d.alpha = newAlpha;
   //           chart.redraw(false);
   //         },
   //         'mouseup touchend': function() {
   //           $(document).unbind('.hc');
   //         }
   //       });
   //     });
   // }
} 