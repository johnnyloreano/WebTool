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
import HC_exporting from 'highcharts/modules/exporting';
highcharts3D(Highcharts);
AccessibilityModule(Highcharts);
HC_exporting(Highcharts)
@Component({
   selector: 'app-protein-viewer',
   styleUrls: ['./protein.css'],
   templateUrl: 'protein-viewer.html'
})

export class ProteinViewerComponent implements OnInit {
   constructor(private _router: Router, private _chartConfigurator : ChartConfiguratorService, private _data : DataService) {}
   seletor = null;
   history = Array<String>();
   chartOptions = null;
   lastAccess = null;
   isClear = true;
   visited = new Set();
   ngOnInit() {
      this.seletor = this._data.getSeletor();
      this.chartOptions = this._chartConfigurator.getChartConfigurations(this.seletor);
      if(this.chartOptions === null)
         this._router.navigate(['/menu']);
         Highcharts.chart('pv', this.chartOptions);
         this.configurePoints();
         // this.configureRotation();
   }
   init(redo?){
      if(redo || this.lastAccess == null)
         TalkerService.speak("Aperte TAB para iniciar a navegação. Utilize as setas DIREITA, para avançar, e ESQUERDA, para voltar nos aminoácidos.");
      else{
         this.goToPoint(this.lastAccess);
         TalkerService.speak("Aperte TAB para recomeçar a navegação.");         
      }
      
      document.getElementById('pv').focus();
   }
   clear(){
      const data = Highcharts.charts[0].series[0].data;
      for (let x = 0; x < this.lastAccess['index']; x++)
         data[x].visible = true;
      this.isClear = true;      
   }
   goToPoint(point){
      const data = Highcharts.charts[0].series[0].data;
      for (let x = 0; x < point['index']; x++) {
         data[x].visible = false;
      }
      this.isClear = false;
   }
   event(event, data) {
      let message: string;
      if (event instanceof KeyboardEvent){
         if (data['isLast'] && event.keyCode === 39) {
            event.preventDefault();
            this.enableFinish();
            return;
         }
         else if (event.keyCode === 65) 
         message = data['message'];
         else if (event.keyCode === 83)
         message = data['transition'];
         else if (event.keyCode === 81){
            return this.enableFinish();
      }
         else if (event.keyCode === 72){
            message = "Histórico de aminoácidos navegados :";
            for(let x = this.history.length - 10; x < this.history.length;x++)
               message += this.history[x]; 
      }
         else
            return ;
   }
      else if(event instanceof FocusEvent){
         if(this.lastAccess != null)
            if(data['index'] == this.lastAccess['index'])
            return;
         message = data['message'] + data['transition']
      }
   return TalkerService.speak(message);
   }

configurePoints(){
   const data = Highcharts.charts[0].series[0].data;
   for (let x = 0; x < data.length; x++) {
      const html = data[x]["graphic"].element;
      html.setAttribute("aria-hidden", "true");
      html.addEventListener('keydown', (e) => {
         data[x]['isLast'] = x == data.length-1;
         this.event(e as KeyboardEvent, data[x]);
      });
      html.addEventListener('focus', (e) => {
         this.event(e as FocusEvent, data[x]);
         this.lastAccess = data[x];
         this.visited.add(data[x]);
         if(!this.isClear)
            this.clear();
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
//    configureRotation(){
//    const chart = Highcharts.charts[0];
//    $(chart.container).bind('mousedown.hc touchstart.hc', function(eStart) {
//       eStart = chart.pointer.normalize(eStart);
//       const posX = eStart.pageX;
//       const posY = eStart.pageY;
//       const alpha = chart.options.chart.options3d.alpha;
//       const beta = chart.options.chart.options3d.beta;
//       const sensitivity = 5; // lower is more sensitive
//       $(document).bind({
//          'mousemove.hc touchdrag.hc': function(e) {
//             chart.options.chart.options3d.beta = beta + (posX - e.pageX) / sensitivity;
//             chart.options.chart.options3d.alpha = alpha + (e.pageY - posY) / sensitivity;;
//             chart.redraw(false);
//          },
//          'mouseup touchend': function() {
//             $(document).unbind('.hc');
//          }
//       });
//       });
// }
} 