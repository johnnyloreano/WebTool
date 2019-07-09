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
} from "../chart-configurator/chart-configurator.service";
import * as Highcharts from 'highcharts';
import highcharts3D from 'highcharts/highcharts-3d.src';
import {
   TalkerService
} from '../talker/talker.service';
import { DataService } from '../../core/data-service/data-service.service';
import AccessibilityModule from 'highcharts/modules/accessibility';

highcharts3D(Highcharts);
AccessibilityModule(Highcharts);

@Component({
   selector: 'app-protein-viewer',
   styleUrls: ['./protein.css'],
   templateUrl: 'protein-viewer.html'
})

export class ProteinViewerComponent implements OnInit, AfterViewInit{
   constructor(private _router: Router, private _chartConfigurator : ChartConfiguratorService, private _data : DataService) {}
   seletor = null;
   history = Array<String>();
   chartOptions = null;
   visited = new Set();
   /**
    * @ignore
    */
   ngOnInit() {      
      document.getElementById("header").focus();
      this.chartOptions = this._chartConfigurator.getChartConfigurations(this._data.getSeletor());
      if(this.chartOptions === null)
         this._router.navigate(['/menu']);
      Highcharts.chart('pv', this.chartOptions);
      this.configurePoints();
   }
   ngAfterViewInit(){
      this.removeDefaultsAria();
   }
   /**
    * Realiza a navegação no gráfico.
    * Fala os comandos básicos do gráfico.
    */
   init(){  
      document.getElementById('pv').setAttribute("aria-label", "Aperte TAB para iniciar a navegação. Utilize as setas DIREITA, para avançar, e ESQUERDA, para voltar nos aminoácidos.");
      document.getElementById('pv').focus();
   }
   /**
    * @ignore
    * Dirtyfix para poder tornar a navegação viável.
    * Sem essa simulação de clique, NÃO funciona.
    */
   fakeClick(event: KeyboardEvent){
      if (event.key == "Enter")
         document.getElementById("init").click();
      this.trap('first','back', event);
   }

   goTo(page){
      this._router.navigate([page]);
   }
   tmpRemSVG(){
      document.getElementsByTagName("svg")[0].setAttribute("aria-hidden", "true");
      setTimeout(() => {
         document.getElementsByTagName("svg")[0].setAttribute("aria-hidden", "false");
      }, 100);
   }
   /**
    * Eventos utilizados durante a navegação.
    * Em determinado ponto,  o usuário pode saber sobre o ponto atua, usando a tecla A,
    * pode saber sobre o próximo ponto, usando a tecla S,
    * pode saber sobre o histórico de pontos, usando a letra H
    * e pode realizar a saída do gráfico, com TAB ou a letra Q. 
    * Aqui também é feito a fala de cada ação realizada.
    * @param event Evento realizado no atual ponto
    * @param data Dados do atual ponto
    * @returns Realiza a fala que se deseja obter
    */
   event(event, data) {
      if (event instanceof KeyboardEvent){
         let message: string;
         if (event.key.toUpperCase() === "A") 
            message = data['message'];
         else if (event.key.toUpperCase() === "Z")
            message = data['transition'];
         else if (event.key.toUpperCase() === "H"){
            message = "Histórico de aminoácidos navegados :";
            for(let x = this.history.length - 10; x < this.history.length;x++)
               message += this.history[x]; 
         }
         else if (event.key.toUpperCase() ==  "W" || event.keyCode == 9){
            event.stopImmediatePropagation();
            return document.getElementById("init").focus();
         }
      if(message != undefined)
         return TalkerService.speak(message);
      }
   }
/**
 * Configura os pontos do gráfico para poder serem navegáveis.
 * Configura os eventos de teclado de cada ponto
 * Configura os aria-labels de cada ponto para o leitor de tela
 */
configurePoints(){
   const last = Highcharts.charts.length;
   const data = Highcharts.charts[last-1].series[0].data;
   for (let x = 0; x < data.length; x++) {
      const html = data[x]["graphic"].element;
      html.setAttribute("aria-label", data[x]["message"] + data[x]["transition"])
      html.addEventListener('keydown', (e) => {
         data[x]['isLast'] = x == data.length-1;
         this.event(e as KeyboardEvent, data[x]);
      });
      html.addEventListener('focus', () => {
         this.visited.add(data[x]);
         this.history.push(data[x]['name']);
      });
   }
}
/**
 * Cria uma trap na navegação de menus.
 * O usuário fica preso dentro de um determinado fluxo de itens do menu.
 * @param position Posição do elemento no menu
 * @param idFocus Id do elemento que deseja-se focar
 * @param event Evento causado no atual elemento
 * 
 */
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
   /**
    * Remove os aria-labels do HighCharts que causam problemas na navegação.
    */
   removeDefaultsAria(){
      document.getElementsByTagName("svg")[0].setAttribute("aria-label", "");
      document.getElementById("pv").setAttribute("role", "application");   
      for(let i = 0; true; i++)
      if (document.getElementsByTagName("desc")[i] != null)
         document.getElementsByTagName("desc")[i].remove();
      else break;
      if (document.getElementById("highcharts-information-region-1") != null)
         document.getElementById("highcharts-information-region-1").remove();
      if (document.getElementById("highcharts-information-region-0") != null)
         document.getElementById("highcharts-information-region-0").remove();

   }
} 