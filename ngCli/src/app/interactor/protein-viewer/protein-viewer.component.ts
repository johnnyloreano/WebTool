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
   seletor = null;
   history = Array<String>();
   chartOptions = null;
   lastAccess = null;
   ngOnInit() {
      this.seletor = this._data.getSeletor();
      this.chartOptions = this._chartConfigurator.getChartConfigurations(this.seletor);
      if(this.chartOptions === null)
         this._router.navigate(['/menu']);
         Highcharts.chart('pv', this.chartOptions);
         this.configurePoints();
   }
   init(){
      if (this.lastAccess != null)
         this.lastAccess.focus();
         
      else{
         document.getElementById('pv').focus();
         TalkerService.speak("Aperte TAB para iniciar a navegação. Utilize as setas DIREITA, para avançar, e ESQUERDA, para voltar nos aminoácidos.");
      }
   }
   event(event, data) {
      // console.log(data);
      let message: string;
      if (event instanceof KeyboardEvent){
         if (event.keyCode === 39 && data['isLast']){
            event.preventDefault();
            this.enableFinish();
            return;
         }
         else if (event.keyCode === 65) 
            message = data['message'];
         else if (event.keyCode === 83)
            message = data['transition'];
         else if (event.keyCode === 72){
            message = "Histórico de aminoácidos navegados :";
            this.history.forEach(element => {message += element;}); 
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
      html.addEventListener('keydown', (e) => {
         html.setAttribute("aria-hidden", "true");
         data[Number(html.getAttribute('dataIndex'))-1]['isLast'] = x == data.length-1;
         this.event(e as KeyboardEvent, data[Number(html.getAttribute('dataIndex'))-1]);
      });
      html.addEventListener('focus', (e) => {
         html.setAttribute("aria-hidden", "true");
         let idx = Number(html.getAttribute('dataIndex'))-1
         this.event(e as FocusEvent, data[idx]);
         this.lastAccess = html;
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