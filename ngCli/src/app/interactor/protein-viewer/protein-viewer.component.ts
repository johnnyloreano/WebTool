import {
   Component,
   OnInit
} from '@angular/core';
import {
   Router
} from '@angular/router';
import {
   ChartConfiguratorService
} from "../chart-configurator/chart-configurator.service";
import * as Highcharts from 'highcharts';
import highcharts3D from 'highcharts/highcharts-3d.src';
import {
   TalkerService
} from '../talker/talker.service';
// import * as $ from 'jquery';
import { DataService } from '../../core/data-service/data-service.service';
import AccessibilityModule from 'highcharts/modules/accessibility';
import HC_exporting from 'highcharts/modules/exporting';
highcharts3D(Highcharts);
AccessibilityModule(Highcharts);
// HC_exporting(Highcharts)
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
   isFirst = true;
   visited = new Set();
   lastOne = null;
   ngOnInit() {
      document.getElementById("header").focus();
      this.seletor = this._data.getSeletor();
      this.chartOptions = this._chartConfigurator.getChartConfigurations(this.seletor);
      if(this.chartOptions === null)
         this._router.navigate(['/menu']);
      Highcharts.chart('pv', this.chartOptions);
      this.configurePoints();
      this.removeDefaultsAria();
   }
   init(){
      if(this.isFirst)
         TalkerService.speak("Aperte TAB para iniciar a navegação. Utilize as setas DIREITA, para avançar, e ESQUERDA, para voltar nos aminoácidos.");
      else
         TalkerService.speak(this.lastOne["message"] + this.lastOne["transition"]);
      document.getElementById('pv').focus();
   }
   fakeClick(event: KeyboardEvent){
      if (event.key == "Enter")
         document.getElementById("init").click();
      this.trap('first','back', event);
   }
   event(event, data) {
      if (event instanceof KeyboardEvent){
         let message: string;
         if (data['isLast'] && event.keyCode === 39) {
            event.preventDefault();
            this.enableFinish();
            return;
         }
         else if (event.key.toUpperCase() === "A") 
            message = data['message'];
         else if (event.key.toUpperCase() === "S")
            message = data['transition'];
         else if (event.key.toUpperCase() === "H"){
            message = "Histórico de aminoácidos navegados :";
            for(let x = this.history.length - 10; x < this.history.length;x++)
               message += this.history[x]; 
         }
         else if (event.key.toUpperCase() ==  "Q" || event.keyCode == 9){
            event.stopImmediatePropagation();
            this.isFirst = false;
         return document.getElementById("init").focus();
         }
      if(message != undefined)
         return TalkerService.speak(message);
   }
}

configurePoints(){
   const data = Highcharts.charts[0].series[0].data;
   for (let x = 0; x < data.length; x++) {
      const html = data[x]["graphic"].element;
      html.setAttribute("aria-hidden", "true");
      html.setAttribute("aria-label", data[x]["message"] + data[x]["transition"])
      html.addEventListener('keydown', (e) => {
         data[x]['isLast'] = x == data.length-1;
         this.event(e as KeyboardEvent, data[x]);
      });
      html.addEventListener('focus', () => {
         this.visited.add(data[x]);
         this.lastOne = data[x];
      });
   }
} 
   trap(position,idFocus, event){
      if(position == "first"){
         if(event.shiftKey && event.key == "Tab"){
            event.preventDefault();
            document.getElementById(idFocus).focus();
         }
      }
      else if(position == "last")
         if(!event.shiftKey && (event.key == "Tab"  || event.key == "ArrowDown") ){
            event.preventDefault();
            document.getElementById(idFocus).focus();
         }
   }
   removeDefaultsAria(){

      document.getElementsByTagName("svg")[0].setAttribute("aria-label", "");
      document.getElementById("highcharts-information-region-0").setAttribute("aria-label", "");
      Array.from(document.getElementsByClassName("highcharts-exit-anchor-wrapper")[0].children).forEach(element =>{element.setAttribute("aria-label", "");});
   }
   enableFinish(){
      // document.getElementById('finish').hidden = false;
      // document.getElementById('finish').focus();
   }
   disableFinish(){
      // document.getElementById('finish').hidden = true;
      // document.getElementById('finish').tabIndex = -1;
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