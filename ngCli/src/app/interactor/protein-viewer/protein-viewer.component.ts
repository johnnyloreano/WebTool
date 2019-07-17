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
import * as $ from 'jquery';
import highcharts3D from 'highcharts/highcharts-3d.src';
import {
   TalkerService
} from '../talker/talker.service';
import { DataService } from '../../core/data-service/data-service.service';
import AccessibilityModule from 'highcharts/modules/accessibility';
import { HttpService } from '../../core/http-pdb/http-pdb-requester.service';

highcharts3D(Highcharts);
AccessibilityModule(Highcharts);

@Component({
   selector: 'app-protein-viewer',
   styleUrls: ['./protein.css'],
   templateUrl: 'protein-viewer.html'
})

export class ProteinViewerComponent implements OnInit, AfterViewInit{
   constructor(private _router: Router, private _chartConfigurator : ChartConfiguratorService, private _data : DataService, private _http : HttpService) {}
   seletor = null;
   history = Array<String>();
   visited = new Set();
   chartOptions = null;
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
      if(this._data.getSeletor() == "test")
         this.configureTestHTML();
   }
   ngAfterViewInit(){
      this.removeDefaultsAria();
   }
   configureTestHTML(){
      const list = document.getElementsByTagName("ul")[0];
      list.children[4].remove();
      list.children[2].remove();
      list.children[1].remove();
   }
   /**
    * Realiza a navegação no gráfico.
    * Fala os comandos básicos do gráfico.
    */
   init(){  
      document.getElementById('pv').setAttribute("aria-label", "Aperte TAB para iniciar a navegação. Utilize as setas DIREITA, para avançar, e ESQUERDA, para voltar nos aminoácidos. Utilize a tecla 'A' para repetir a posição atual, e  a letra 'Z' para repetir a próxima posição. Utilize a tecla 'W', ou 'TAB' para sair do visualizador.");
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
      const html = data[x]["graphic"].element as SVGAElement;
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
reconfigurePoints(data){
   const last = Highcharts.charts.length;
   const htmls = Highcharts.charts[last-1].series[0].data;
   for (let x = 0; x < data.length; x++) {
      const html = htmls[x]["graphic"].element as SVGAElement;
      html.setAttribute("aria-label", data[x]["message"] + data[x]["transition"]);
      // console.log(html.getAttribute("aria-label"));
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
 configureRotation(){
      const component = this;
      const last = Highcharts.charts.length - 1 ;
      const chart = Highcharts.charts[last];
      $(chart.container).bind('mousedown.hc touchstart.hc', function(eStart) {
         eStart = chart.pointer.normalize(eStart);
         const posX = eStart.pageX;
         const posY = eStart.pageY;
         const alpha = chart.options.chart.options3d.alpha;
         const beta = chart.options.chart.options3d.beta;
         const sensitivity = 5; // lower is more sensitive
         $(document).bind({
           'mousemove.hc touchdrag.hc': function(e) {
             chart.options.chart.options3d.beta = beta + (posX - e.pageX) / sensitivity;
             chart.options.chart.options3d.alpha = alpha + (e.pageY - posY) / sensitivity;;
             chart.redraw(false);
           },
           'touchend mouseup': function() {
             $(document).unbind('.hc');
            let newPlot = new Array<Object>();
            const RADIUS  = 5;
            for (let i = 0; i < chart.series[0].data.length; i++){
               const x = chart.series[0].data[i]['graphic']['x'] + RADIUS;
               const y = chart.series[0].data[i]['graphic']['y'] + RADIUS * 2;
               let z = chart.series[0].data[i]['z'];
               const message = chart.series[0].data[i]['message'];
               if (z == 0) z = 1;
               const arrAux = [x,y,z];
               const dictionary = { message : message, position : arrAux};
               newPlot.push(dictionary);
            }
            const type = component._data.getSeletor();
            component._http.requestRotation(newPlot, type).subscribe(
               (result) => {
                  component.reconfigurePoints(result);
               },
               (error) => {
                  console.log("not success...");
               }
               );
           }
         });
      });
   }
} 