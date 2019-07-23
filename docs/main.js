(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./node_modules/raw-loader/index.js!./src/app/app.component.html":
/*!**************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/app.component.html ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section>\n    <h1 tabindex=\"0\">\n        Ferramenta WalkingMol\n    </h1>\n    <div>\n        <img role=\"banner\" tabindex=\"0\"  src=\"assets/labioLogo.png\" alt=\"Logo do LABIO Laboratório de BioInformática,Modelagem e Simulação de Biossistemas. FACIN PUCRS\" />\n        <router-outlet></router-outlet>\n    </div>\n</section> \n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/interactor/pre-viewer/pre-viewer.component.html":
/*!*******************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/interactor/pre-viewer/pre-viewer.component.html ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div id=\"successful\" class=\"bg-success w-50 mx-auto\">\n      <p tabindex=\"0\" id=\"focus\">\n      Você buscou a proteína {{protein['_identifier']}} com sucesso!\n      Essa proteina contém {{protein['_residues'].length}} aminoácidos.\n      Você deseja continuar para o visualizador ?\n    </p>\n      <nav>\n        <ul>\n          <li><button tabindex=\"0\" routerLink = '/proteinView' class=\"btn btn-primary w-25 mb-1\" >Sim, desejo continuar</button></li>\n          <li><button tabindex=\"0\" routerLink='/buscador'  class=\"btn btn-primary w-25\" >Não, voltar para pesquisa</button></li>\n        </ul>\n      </nav>\n    </div>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/interactor/printer/printer.component.html":
/*!*************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/interactor/printer/printer.component.html ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<nav>\n  <ul>\n    <li>\n      <button type=\"button\" class=\"btn btn-primary w-25 \"  (click)=\"generateFile()\"> Gerar Arquivo</button>\n    </li>\n    <!-- <li>\n      <button type=\"button\" class=\"btn btn-primary w-25 \" > Ver configuração do arquivo</button>\n    </li> -->\n    <li>\n      <button type=\"link\" class=\"btn btn-primary w-25\" [ngClass]=\"{'active': bonds == 'yes'}\"  (click) = \"bonds = bonds == 'no' ? 'yes':'no' \"> Adicionar Ligações</button>\n    </li>\n    <li>\n      <button type=\"link\" class=\"btn btn-primary w-25 \" routerLink = \"/proteinView\"> Voltar para a proteína</button>\n    </li>\n\n  </ul>\n</nav>\n<!-- <div>\n  <h2>\n    Informações do Arquivo:\n  </h2>\n    O arquivo <ng-template ngIf = \"!stabilizer\">não</ng-template> conterá os estabilizadores.\n    O arquivo <ng-template ngIf = \"bonds == 'no'\">não</ng-template> conterá átomos de hidrogênio e de enxofre além de aminoácidos.\n</div> -->"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/interactor/protein-viewer/protein-viewer.html":
/*!*****************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/interactor/protein-viewer/protein-viewer.html ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h2 tabindex=\"0\" id=\"header\" >\n    Visualizador\n</h2>\n<nav>\n    <ul>\n        <li>\n            <button id=\"init\" type=\"button\" tabindex = '0' class=\"btn btn-primary w-25 \" (keydown) = \"fakeClick($event)\" (click)=\"init()\">\n                Iniciar Navegação\n            </button>\n        </li>\n        <li>\n            <button id=\"back\" type=\"link\" tabindex = '0' class=\"btn btn-primary w-25\" (click) = \"goTo('printer')\">\n                Gerar arquivo para impressão em 3D\n            </button>\n        </li>\n        <li>\n            <button type=\"link\" tabindex = '0' class=\"btn btn-primary w-25\"  (click) = \"goTo('resumo')\">\n                    Ver informações resumidas\n            </button>\n        </li>\n        <li>\n            <button type=\"link\" tabindex = '0' class=\"btn btn-primary w-25\" (click) = \"goTo('manual')\">\n                Ver manual\n            </button>\n        </li>\n\n        <li>\n            <button type=\"link\" tabindex = '0' class=\"btn btn-primary w-25\" (click) = \"goTo('buscador')\">\n                Ir para tela de pesquisa de proteína\n            </button>\n        </li>\n        <li>\n            <button id=\"back\" type=\"link\" tabindex = '0' class=\"btn btn-primary w-25\" (click) = \"goTo('menu')\" (keydown) = \"trap('last','init', $event)\">\n                Voltar ao menu principal\n            </button>\n        </li>\n  </ul>\n</nav>\n<div id=\"icn3dwrap\"></div>\n<div id=\"pv\" (focus)=\"tmpRemSVG()\" tabindex=\"0\" role=\"application\" ></div>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/interactor/summary/summary.component.html":
/*!*************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/interactor/summary/summary.component.html ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<ul>\n  <li>\n    <button tabindex = '0' class=\"btn bg-primary text-white d-block mx-auto\" routerLink=\"/proteinView\">\n        Voltar para a proteína\n    </button>\n  </li>\n</ul>\n<h2 >Informações Gerais</h2>\n<div tabindex=\"0\">\n  <h2>Identificador da proteína</h2>\n  <p>{{protein['_identifier']}}</p>\n</div>\n<div tabindex=\"0\">\n  <h2>Nome da proteína</h2>\n  <p>{{protein['_title']}}</p>\n\n</div>\n<div tabindex=\"0\">\n  <h2>Autor da proteína</h2>\n  <p>{{protein['_authors']}}</p>\n\n</div>\n<!-- <div tabindex=\"0\">\n  <h2>Classificação da proteína</h2>\n  <p>{{protein['_classification']}}</p>\n\n</div> -->\n<div tabindex=\"0\">\n  <h2>Experimentos realizados</h2>\n  <p>{{protein['_experiment']}}</p>\n\n</div>\n<div tabindex=\"0\">\n  <h2>Versão da proteína</h2>\n  <p>{{protein['_version']}}</p>\n</div>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/menu/form/form.component.html":
/*!*************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/menu/form/form.component.html ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "  <h2 id=\"principalHeader\" tabindex=\"0\" >\n    Buscador de proteínas\n  </h2>\n  <p tabindex=\"0\">\n    Digite abaixo o nome do identificador da proteína que você deseja buscar. O código consiste em 4 caracteres, sendo o primeiro um número, seguido de 3 letras:\n  </p>\n  <label for =\"protein\" class='mr-2' role=\"search\">\n    Proteína: \n    <input id='protein' [(ngModel)]='pdbFile' type='text' (keydown)=\"$event.keyCode == 13 ? requestProtein() : null\">\n  </label>\n\n  <nav>\n    <ul>\n      <li><button tabindex ='0' id=\"btnSearch\" class=\"btn btn-primary w-25\"  (click)=\"requestProtein()\"   (keydown)=\"$event.keyCode == 13 ? requestProtein() : null\">Procurar proteína</button></li>\n          <p tabindex='0' id=\"messageError\" class=\"bg-danger text-white w-25 rounded mt-2 ml-auto mr-auto\" role=\"alert\"></p>\n      <li><a tabindex='0' id=\"buttonBack\" class=\"btn btn-primary w-25\"  routerLink=\"/menu\">Voltar para o menu principal</a></li>\n    </ul>\n  </nav>\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/menu/manual/manual.component.html":
/*!*****************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/menu/manual/manual.component.html ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h2 tabindex='0' id=\"principalTitle\" >\n  Manual da ferramenta\n</h2>\n<header>\n  <nav class=\"text-left w-75 mx-auto\">\n    <ul>\n      <li class = \"title\">\n        <a tabindex = '0' id=\"intro-h\" (click)=\"goTo($event,'intro-p')\"  (keydown)=\"$event.keyCode == 13 ? goTo($event,'intro-p') : null\" (keydown.shift.tab) = \"goTo($event,'lastMenu')\">\n          Introdução\n        </a>\n      </li>\n      <li class = \"title\">\n        <a tabindex = '0' id=\"menu-h\"  (click)=\"goTo($event,'menu-p')\"  (keydown)=\"$event.keyCode == 13 ? goTo($event,'menu-p') : null\" >\n          Menu Principal    \n        </a>\n      </li>      \n      <li class = \"title\">\n          <a tabindex = '0' id=\"nav-h\"  (click)=\"goTo($event,'nav-p')\"  (keydown)=\"$event.keyCode == 13 ? goTo($event,'nav-p') : null\" >\n              Navegador de proteína\n            </a>\n      </li>\n      <nav class=\"submenu\">\n        <ul>\n          <li class = \"subtitle\">\n              <a tabindex=\" 0\" id=\"nav-sh\" (click)=\"goTo($event,'nav-sp')\"  (keydown)=\"$event.keyCode == 13 ? goTo($event,'nav-sp') : null\">\n                  Dentro da proteína\n                </a>       \n          </li>\n        </ul>\n      </nav>\n  <li class = \"title\">\n    <a tabindex = '0' id=\"sis-h\"  (click)=\"goTo($event,'sis-p')\"  (keydown)=\"$event.keyCode == 13 ? goTo($event,'sis-p') : null\" >\n      Sistema de navegação\n    </a>\n  </li>\n  <li class = \"title\">\n    <a tabindex = '0' id=\"conc-h\"  (click)=\"goTo($event,'conc-p')\"  (keydown)=\"$event.keyCode == 13 ? goTo($event,'conc-p') : null\" >\n      Material concreto\n    </a>\n  </li>\n    <nav class=\"submenu\">\n      <ul>\n        <li class = \"subtitle\">\n          <a tabindex=\" 0\" id=\"nav-sh\" (click)=\"goTo($event,'conc-sp')\"  (keydown)=\"$event.keyCode == 13 ? goTo($event,'conc-sp') : null\">\n            Relógio\n          </a>\n        </li>\n        <li class = \"subtitle\">\n          <a tabindex=\" 0\" id=\"nav-sh\" (click)=\"goTo($event,'conc-sp1')\"  (keydown)=\"$event.keyCode == 13 ? goTo($event,'conc-sp1') : null\">\n            Base de E V A\n          </a>\n        </li>\n        <li class = \"subtitle\">\n          <a tabindex=\" 0\" id=\"nav-sh\" (click)=\"goTo($event,'conc-sp2')\"  (keydown)=\"$event.keyCode == 13 ? goTo($event,'conc-sp2') : null\">\n            Alfinetes\n          </a>\n        </li>\n        <li class = \"subtitle\">\n          <a tabindex=\" 0\" id=\"nav-sh\" (click)=\"goTo($event,'conc-sp3')\"  (keydown)=\"$event.keyCode == 13 ? goTo($event,'conc-sp3') : null\">\n            Corda\n          </a>\n        </li>\n      </ul>\n  </nav>\n  <li class = \"title\">\n    <a tabindex='0' id=\"lastMenu\"  routerLink=\"/menu\" (keydown.tab) = \"goTo($event,'intro-h')\">\n      Voltar para o menu principal\n    </a>\n  </li>\n</ul>\n</nav>\n</header>\n<div>\n<section >\n  <h2 tabindex=\"0\" id=\"intro-p\">Introdução</h2>\n  <p  tabindex=\"0\">\n    Bem-vindos à Ferramenta WalkingMol!\n    Essa ferramenta foi construída para ajudar no ensino de estrutura de proteínas simples. Também será ensinado o sistema de navegação\n     proposto, além da utilização do material concreto.\n  </p>\n  <a tabindex=\"0\" (click)=\"goTo($event,'intro-h')\" (keydown)=\"$event.keyCode == 13 ? goTo($event,'intro-h') : null\">Voltar para título Introdução</a>\n</section>\n<section>\n    <h2 tabindex=\"0\"  id=\"menu-p\">Menu Principal</h2>\n  <p tabindex=\"0\">\n    No menu principal, você poderá acessar o buscador de proteínas, o manual\n     e também poderá visitar a seção de Tutorial, para entender melhor como utilizar essa ferramenta.\n  </p>\n  <a tabindex=\"0\" (click)=\"goTo($event,'menu-h')\" (keydown)=\"$event.keyCode == 13 ? goTo($event,'menu-h') : null\">Voltar para título Menu Principal</a>\n</section>\n<section >\n    <h2 tabindex=\"0\" id=\"nav-p\">Navegador de proteína</h2>\n  <p tabindex=\"0\" >\n      Para começar, você deve selecionar a opção ABRIR BUSCADOR DE PROTEÍNA, onde você será redirecionado para uma página onde poderá escolher uma proteína.\n      Para escolher a proteína, você deve digitar o CÓDIGO IDENTIFICADOR da proteína. \n      Esse código é formado por 4 caracteres, sendo o primeiro caractér um número e, os outros caracteres, letras. \n      Um exemplo de código é o 1 Z D D. \n      Caso ocorra um erro, será informado ao usuário, e ele deverá tentar novamente.\n      É importante que o usuário tenha acesso a internet, caso seja a primeira vez que busque determinada proteína. \n      Toda vez que uma nova proteína for buscada, essa será salva no seu computador, de modo que possa ser acessado de maneira offline.\n      Uma vez concluída a pesquisa, o usuário será direcionado a uma página onde conterá o título, com o código da proteína buscada, e, logo abaixo, a quantidade de aminoácidos a serem percorridos.\n      Nessa página, poderá ser confirmado e visitado o navegador, ou poderá voltar para procurar alguma outra proteína.\n      Para iniciar a navegação, o usuário precisará clicar no botão \"Iniciar Navegação\". \n      O leitor deverá dizer as instruções iniciais. A partir desse momento, o usuário poderá começar a percorrer a proteína.\n  </p>\n  <h3 tabindex=\"0\" id=\"nav-sp\">Dentro da proteína</h3>\n  <p  tabindex=\"0\">\n    Ao iniciar a navegação, no primeiro aminoácido, será dado a informação da posição inicial onde deverá começar o modelo da proteína.   \n    A posição inicial será dada de acordo com o quadrante com o qual ele está. \n    Por exemplo, caso o desenho inicie no canto superior direito, será dito : \"Iniciar no quadrante superior direito\".\n    Após, você deverá ouvir informações sobre o aminoácido atual e sobre a orientação e distância em relação ao próximo aminoácido.\n    A orientação será dada em horas, e a distância será categorizada entre \"grande\", \"médio\" ou \"pequeno\".\n    Para se movimentar ao longo da proteína, deverá ser usado a seta \"direita\" para movimentar para o próximo aminoácido, e a seta \"esquerda\" para retornar um aminoácido.\n    Para repetir informação sobre o aminoácido atual, utilizar a tecla \"A\".\n    Para repetir informação sobre a próxima posição, utilizar a tecla \"Z\". \n    Caso desejar sair da proteína, utilizar a tecla \"Q\", ou \"TAB\".\n</p>\n  <a tabindex=\"0\"  (click)=\"goTo($event,'nav-h')\" (keydown)=\"$event.keyCode == 13 ? goTo($event,'nav-h') : null\">Voltar para título Navegador de proteína</a>\n</section>\n<section tabindex = \"0\">\n  <h2 tabindex=\"0\" id=\"sis-p\">Sistema de navegação</h2>\n    <p id=\"sis-p\" tabindex=\"0\">\n      Para informar a direção do próximo aminoácido, o WalkingMol utiliza o sistema de navegação por horas. \n      Imagine um relógio.\n      Ao alcançar um determinado aminoácido, deve-se considerar esse aminoácido posicionado no centro desse relógio.\n      A partir dele, será dado a direção do próximo aminoácido, baseada em horas. \n      Por exemplo, imagine que o usuário está em um aminoácido, e o próximo aminoácido encontra-se logo a direita dele. Dessa maneira, a ferramenta deverá informar a existência de um novo aminoácido as 3 horas, partindo do aminoácido do início.\n    </p>\n  <a tabindex=\"0\"  (click)=\"goTo($event,'sis-h')\" (keydown)=\"$event.keyCode == 13 ? goTo($event,'sis-h') : null\">Voltar para título Sistema de Navegação</a>\n\n</section>\n<section>\n  <h2 tabindex=\"0\" id=\"conc-p\">Material Concreto</h2>\n  <p id=\"conc-p\" tabindex=\"0\">\n      Para auxiliá-lo na navegação, foi implementado uma solução baseado em material concreto. \n      Esse material concreto consiste em um Relógio, uma base de E. V. A., alfinetes e uma corda.\n      Veja a seguir maiores detalhes de cada material.      \n  </p>\n  <h3 tabindex=\"0\" id=\"conc-sp\">Relógio</h3>\n  <p  tabindex=\"0\">\n    O relógio ajudará na orientação dos aminoácidos e no cálculo de distância entre cada um deles.\n    O relógio possui um furo central, onde deverá ser posicionado o aminoácido atual da navegação.\n    O relógio possui as horas indicadas em braille, na parte superior, próximo da borda.\n    Além disso, o relógio possui um ponteiro.\n    Esse ponteiro indicará a direção desejada, de acordo com as horas, e também indicará a distância, de acordo com um dos três furos escolhido do ponteiro. \n    Para utilizar, deverá, primeiramente, ser definido o local onde se inicia o desenho da proteína.\n    Feito isso, deverá ser inserido o primeiro aminoácido, e realizado o posicionamento do próximo aminoácido.\n    Após, deverá ser determinado a distância, inserindo o próximo aminoácido, e posicionado o novo aminoácido no centro do relógio. \n    Esse processo se repete até o final da proteína.\n</p>\n<h3 tabindex=\"0\"  id=\"conc-sp1\">Base de E V A</h3>\n<p tabindex=\"0\">\n    A base de E V A será usado para fazer o desenho da proteína.\n</p>\n<h3 tabindex=\"0\" id=\"conc-sp2\">Alfinetes</h3>\n<p  tabindex=\"0\">\n  Os alfinetes serão usados para fazer a representação de cada aminoácido, e deverão ser usados para fazer o desenho.\n</p>\n<h3 tabindex=\"0\" id=\"conc-sp3\">Corda</h3>\n<p  tabindex=\"0\">\n  A corda será usada para amarrar cada par de aminoácido, indicando de onde começa e onde termina o desenho, e também para indicar como que ele se molda.\n</p>\n  <a tabindex=\"0\"  (click)=\"goTo($event,'conc-h')\" (keydown)=\"$event.keyCode == 13 ? goTo($event,'conc-h') : null\">Voltar para título Material Concreto</a>\n</section>\n</div>\n<a tabindex='0' id=\"buttonBack\" class='btn bg-primary text-white float-right mr-2 mb-2' routerLink=\"/menu\" >Voltar para o menu principal</a>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/menu/menu/menu.component.html":
/*!*************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/menu/menu/menu.component.html ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class='text-center container'>\n    <h2 id=\"menuLock\" tabindex=\"0\" >\n      Menu principal \n    </h2>\n  <nav>\n    <ul  id=\"menuList\">\n      <li><button tabindex='0' class='btn bg-primary text-white' routerLink='/buscador' >Abrir buscador de proteína</button></li>\n      <li><button tabindex='0' class='btn bg-primary text-white' routerLink='/manual'>Abrir manual</button></li>\n      <li><button tabindex='0' class='btn bg-primary text-white' routerLink='/testes' >Abrir Testes</button></li>\n  </ul>\n  </nav>\n</div>"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/menu/testes/testes.component.html":
/*!*****************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/menu/testes/testes.component.html ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class='text-center container'>\n  <h2 tabindex=\"0\" id=\"header\">\n    Menu de Testes \n  </h2>\n<nav>\n  <ul id=\"menuList\">\n    <li><a  tabindex ='0' class=\"btn btn-primary w-25\"  (click)=\"request('triangulo')\"(keydown.enter)=\"request('triangulo')\"  >Abrir primeira figura</a></li>    \n    <li><a  tabindex ='0' class=\"btn btn-primary w-25\"  (click)=\"request('quadrado')\" (keydown.enter)=\"request('quadrado')\">Abrir segunda figura</a></li>    \n    <li><a  tabindex ='0' class=\"btn btn-primary w-25\"  (click)=\"request('trapezio')\" (keydown.enter)=\"request('trapezio')\">Abrir terceira  figura</a></li>    \n    <li><a  tabindex ='0' class=\"btn btn-primary w-25\"  (click)=\"request('losango')\"  (keydown.enter)=\"request('losango')\" >Abrir quarta figura</a></li>    \n    <li><a  tabindex ='0' class=\"btn btn-primary w-25\"  routerLink='/menu'  >Voltar para menu principal</a></li>    \n</ul>\n</nav>\n</div>"

/***/ }),

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app-routing.ts":
/*!********************************!*\
  !*** ./src/app/app-routing.ts ***!
  \********************************/
/*! exports provided: routes, AppProviderRoute */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "routes", function() { return routes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppProviderRoute", function() { return AppProviderRoute; });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _menu_form_form_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./menu/form/form.component */ "./src/app/menu/form/form.component.ts");
/* harmony import */ var _menu_menu_menu_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./menu/menu/menu.component */ "./src/app/menu/menu/menu.component.ts");
/* harmony import */ var _interactor_protein_viewer_protein_viewer_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./interactor/protein-viewer/protein-viewer.component */ "./src/app/interactor/protein-viewer/protein-viewer.component.ts");
/* harmony import */ var _interactor_summary_summary_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./interactor/summary/summary.component */ "./src/app/interactor/summary/summary.component.ts");
/* harmony import */ var _menu_manual_manual_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./menu/manual/manual.component */ "./src/app/menu/manual/manual.component.ts");
/* harmony import */ var _menu_testes_testes_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./menu/testes/testes.component */ "./src/app/menu/testes/testes.component.ts");
/* harmony import */ var _interactor_pre_viewer_pre_viewer_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./interactor/pre-viewer/pre-viewer.component */ "./src/app/interactor/pre-viewer/pre-viewer.component.ts");
/* harmony import */ var _interactor_printer_printer_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./interactor/printer/printer.component */ "./src/app/interactor/printer/printer.component.ts");









var routes = [
    { path: 'menu', component: _menu_menu_menu_component__WEBPACK_IMPORTED_MODULE_2__["MenuComponent"] },
    { path: 'resumo', component: _interactor_summary_summary_component__WEBPACK_IMPORTED_MODULE_4__["SummaryComponent"] },
    { path: 'buscador', component: _menu_form_form_component__WEBPACK_IMPORTED_MODULE_1__["FormComponent"] },
    { path: 'manual', pathMatch: 'full', component: _menu_manual_manual_component__WEBPACK_IMPORTED_MODULE_5__["ManualComponent"] },
    { path: 'proteinView', pathMatch: 'full', component: _interactor_protein_viewer_protein_viewer_component__WEBPACK_IMPORTED_MODULE_3__["ProteinViewerComponent"] },
    { path: 'preView', pathMatch: 'full', component: _interactor_pre_viewer_pre_viewer_component__WEBPACK_IMPORTED_MODULE_7__["PreViewerComponent"] },
    { path: 'testes', pathMatch: 'full', component: _menu_testes_testes_component__WEBPACK_IMPORTED_MODULE_6__["TestesComponent"] },
    { path: 'viewTest', pathMatch: 'full', component: _interactor_protein_viewer_protein_viewer_component__WEBPACK_IMPORTED_MODULE_3__["ProteinViewerComponent"] },
    { path: 'printer', pathMatch: 'full', component: _interactor_printer_printer_component__WEBPACK_IMPORTED_MODULE_8__["PrinterComponent"] },
    { path: '**', redirectTo: 'menu', pathMatch: 'full' }
];
var AppProviderRoute = _angular_router__WEBPACK_IMPORTED_MODULE_0__["RouterModule"].forRoot(routes);


/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "section{\n    width:95%;\n    margin: 0 auto;\n    text-align: center;\n    min-height:100vh;\n}\nimg{\n    width: 30%;\n    height: 50%;\n}\n*{\n    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvYXBwLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7SUFDSSxTQUFTO0lBQ1QsY0FBYztJQUNkLGtCQUFrQjtJQUNsQixnQkFBZ0I7QUFDcEI7QUFDQTtJQUNJLFVBQVU7SUFDVixXQUFXO0FBQ2Y7QUFDQTtJQUNJLHNIQUFzSDtBQUMxSCIsImZpbGUiOiJzcmMvYXBwL2FwcC5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsic2VjdGlvbntcbiAgICB3aWR0aDo5NSU7XG4gICAgbWFyZ2luOiAwIGF1dG87XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIG1pbi1oZWlnaHQ6MTAwdmg7XG59XG5pbWd7XG4gICAgd2lkdGg6IDMwJTtcbiAgICBoZWlnaHQ6IDUwJTtcbn1cbip7XG4gICAgZm9udC1mYW1pbHk6ICdMdWNpZGEgU2FucycsICdMdWNpZGEgU2FucyBSZWd1bGFyJywgJ0x1Y2lkYSBHcmFuZGUnLCAnTHVjaWRhIFNhbnMgVW5pY29kZScsIEdlbmV2YSwgVmVyZGFuYSwgc2Fucy1zZXJpZjtcbn0iXX0= */"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var AppComponent = /** @class */ (function () {
    function AppComponent() {
    }
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! raw-loader!./app.component.html */ "./node_modules/raw-loader/index.js!./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")]
        })
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _app_routing__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app-routing */ "./src/app/app-routing.ts");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _core_core_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./core/core.module */ "./src/app/core/core.module.ts");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _menu_menu_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./menu/menu.module */ "./src/app/menu/menu.module.ts");
/* harmony import */ var _interactor_interactor_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./interactor/interactor.module */ "./src/app/interactor/interactor.module.ts");
/* harmony import */ var _core_data_service_data_service_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./core/data-service/data-service.service */ "./src/app/core/data-service/data-service.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};









var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_2__["AppComponent"]
            ],
            imports: [
                _app_routing__WEBPACK_IMPORTED_MODULE_1__["AppProviderRoute"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClientModule"],
                _core_core_module__WEBPACK_IMPORTED_MODULE_4__["CoreModule"].forRoot(),
                _menu_menu_module__WEBPACK_IMPORTED_MODULE_6__["MenuModule"],
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_5__["BrowserModule"],
                _interactor_interactor_module__WEBPACK_IMPORTED_MODULE_7__["InteractorModule"],
                _core_core_module__WEBPACK_IMPORTED_MODULE_4__["CoreModule"]
            ],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_2__["AppComponent"]],
            providers: [_core_data_service_data_service_service__WEBPACK_IMPORTED_MODULE_8__["DataService"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/core/core.module.ts":
/*!*************************************!*\
  !*** ./src/app/core/core.module.ts ***!
  \*************************************/
/*! exports provided: CoreModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CoreModule", function() { return CoreModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _data_service_data_service_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./data-service/data-service.service */ "./src/app/core/data-service/data-service.service.ts");
/* harmony import */ var _http_pdb_http_pdb_requester_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./http-pdb/http-pdb-requester.service */ "./src/app/core/http-pdb/http-pdb-requester.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var CoreModule = /** @class */ (function () {
    function CoreModule() {
    }
    CoreModule_1 = CoreModule;
    CoreModule.forRoot = function () {
        return {
            ngModule: CoreModule_1,
            providers: [_data_service_data_service_service__WEBPACK_IMPORTED_MODULE_1__["DataService"], _http_pdb_http_pdb_requester_service__WEBPACK_IMPORTED_MODULE_2__["HttpService"]]
        };
    };
    var CoreModule_1;
    CoreModule = CoreModule_1 = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            providers: [_data_service_data_service_service__WEBPACK_IMPORTED_MODULE_1__["DataService"], _http_pdb_http_pdb_requester_service__WEBPACK_IMPORTED_MODULE_2__["HttpService"]]
        })
    ], CoreModule);
    return CoreModule;
}());



/***/ }),

/***/ "./src/app/core/data-service/data-service.service.ts":
/*!***********************************************************!*\
  !*** ./src/app/core/data-service/data-service.service.ts ***!
  \***********************************************************/
/*! exports provided: DataService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataService", function() { return DataService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs_BehaviorSubject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/BehaviorSubject */ "./node_modules/rxjs-compat/_esm5/BehaviorSubject.js");
/* harmony import */ var _interfaces_protein__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../interfaces/protein */ "./src/app/interfaces/protein.ts");
/* harmony import */ var _interfaces_points__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../interfaces/points */ "./src/app/interfaces/points.ts");
/* harmony import */ var _interfaces_testGraphic__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../interfaces/testGraphic */ "./src/app/interfaces/testGraphic.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





var DataService = /** @class */ (function () {
    function DataService() {
        this.proteinData = new rxjs_BehaviorSubject__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"](undefined);
        this.testData = new rxjs_BehaviorSubject__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"](undefined);
        this.seletorData = new rxjs_BehaviorSubject__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"](undefined);
    }
    DataService.prototype.setProtein = function (protein) {
        protein['residues'] = this.parseAmino(protein['residues']);
        this.proteinData.next(new _interfaces_protein__WEBPACK_IMPORTED_MODULE_2__["Protein"](protein['identifier'], protein['title'], protein['author'], protein['version'], protein['date'], protein['experiment'], protein['residues']));
    };
    DataService.prototype.setTest = function (test) {
        this.testData.next(new _interfaces_testGraphic__WEBPACK_IMPORTED_MODULE_4__["TestGraphic"](this.parsePTest(test['pTest'])));
    };
    DataService.prototype.setSeletor = function (value) {
        this.seletorData.next(value);
    };
    DataService.prototype.getSeletor = function () {
        return this.seletorData.getValue();
    };
    DataService.prototype.getTest = function () {
        return this.testData.getValue();
    };
    DataService.prototype.getProtein = function () {
        return this.proteinData.getValue();
    };
    DataService.prototype.getResidues = function () {
        if (this.getProtein() == undefined || this.getProtein() == null)
            return null;
        return this.getProtein()['residues'];
    };
    DataService.prototype.parseAmino = function (residues) {
        var residuesComp = new Array();
        for (var i = 0; i < residues.length; i++) {
            var nAmino = new _interfaces_points__WEBPACK_IMPORTED_MODULE_3__["Points"]();
            nAmino.index = i;
            nAmino.label = residues[i]['label'];
            nAmino.transition = residues[i]['transition'];
            nAmino.message = residues[i]['message'];
            var loc = residues[i]['location'];
            nAmino.x = loc[0];
            nAmino.y = loc[1];
            nAmino.z = loc[2];
            residuesComp.push(nAmino);
        }
        // residuesComp.forEach(element => {console.log(element);});
        return residuesComp;
    };
    DataService.prototype.parsePTest = function (pTest) {
        var pTestArr = new Array();
        for (var x = 0; x < pTest.length; x++) {
            var tp = new _interfaces_points__WEBPACK_IMPORTED_MODULE_3__["Points"]();
            tp.index = x;
            tp.label = String(x + 1);
            tp.transition = pTest[x]['transition'];
            tp.message = pTest[x]['message'];
            var coords = pTest[x]['location'];
            tp.x = coords[0];
            tp.y = coords[1];
            pTestArr.push(tp);
        }
        return pTestArr;
    };
    DataService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])()
    ], DataService);
    return DataService;
}());



/***/ }),

/***/ "./src/app/core/http-pdb/http-pdb-requester.service.ts":
/*!*************************************************************!*\
  !*** ./src/app/core/http-pdb/http-pdb-requester.service.ts ***!
  \*************************************************************/
/*! exports provided: HttpService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HttpService", function() { return HttpService; });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var rxjs_add_operator_toPromise__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/add/operator/toPromise */ "./node_modules/rxjs-compat/_esm5/add/operator/toPromise.js");
/* harmony import */ var rxjs_add_operator_toPromise__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(rxjs_add_operator_toPromise__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var rxjs_add_operator_map__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/add/operator/map */ "./node_modules/rxjs-compat/_esm5/add/operator/map.js");
/* harmony import */ var rxjs_add_operator_catch__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/add/operator/catch */ "./node_modules/rxjs-compat/_esm5/add/operator/catch.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var HttpService = /** @class */ (function () {
    function HttpService(http) {
        this.http = http;
    }
    HttpService.prototype.requestTags = function (file) {
        var config = {
            params: {
                pdbFile: file
            }
        };
        return this.http.get('https://johnnyloreano.pythonanywhere.com/getProtein', config);
    };
    HttpService.prototype.requestTest = function (name) {
        var config = {
            params: {
                name: name
            }
        };
        return this.http.get('https://johnnyloreano.pythonanywhere.com/getTest', config);
    };
    HttpService.prototype.requestRotation = function (points, type) {
        var headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_0__["HttpHeaders"]();
        headers.append('Content-Type', 'application/json');
        var config = {
            params: {
                data: JSON.stringify(points),
                type: JSON.stringify(type)
            }
        };
        return this.http.get('https://johnnyloreano.pythonanywhere.com/getRotation', config);
    };
    HttpService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["Injectable"])({ providedIn: 'root' }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_0__["HttpClient"]])
    ], HttpService);
    return HttpService;
}());



/***/ }),

/***/ "./src/app/interactor/chart-configurator/chart-configurator.service.ts":
/*!*****************************************************************************!*\
  !*** ./src/app/interactor/chart-configurator/chart-configurator.service.ts ***!
  \*****************************************************************************/
/*! exports provided: ChartConfiguratorService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChartConfiguratorService", function() { return ChartConfiguratorService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _core_data_service_data_service_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../core/data-service/data-service.service */ "./src/app/core/data-service/data-service.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ChartConfiguratorService = /** @class */ (function () {
    function ChartConfiguratorService(dataService) {
        this.dataService = dataService;
        this.chartOptions = null;
    }
    ChartConfiguratorService.prototype.getChartConfigurations = function (option) {
        this.get(option);
        return this.chartOptions;
    };
    ChartConfiguratorService.prototype.get = function (option) {
        var data;
        var size;
        if (option == "test") {
            data = this.dataService.getTest().points;
            size = 5;
        }
        else {
            data = this.dataService.getResidues();
            size = 100;
        }
        if (data === null)
            return null;
        this.chartOptions = {
            chart: {
                type: 'scatter3d',
                description: '',
                options3d: {
                    enabled: true,
                    alpha: 0,
                    beta: 0,
                    depth: 250,
                    viewDistance: 100,
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
            title: {
                text: undefined
            },
            subtitle: {
                text: undefined
            },
            accessibility: {
                keyboardNavigation: {
                    wrapAround: true,
                    mode: "serialize",
                    focusBorder: {
                        margin: 5,
                        style: {
                            color: "green",
                            lineWidth: 5,
                            borderRadius: 10
                        }
                    }
                }
            },
            lang: {
                accessibility: {
                    chartContainerLabel: ""
                }
            },
            plotOptions: {
                series: {
                    marker: {
                        fillColor: 'black',
                        radius: 5 // inherit from series 
                    },
                    dataLabels: {
                        enabled: true,
                        formatter: function () {
                            return this.point['label'];
                        }
                    }
                }
            },
            xAxis: {
                min: 0,
                max: size,
                title: { text: undefined },
                labels: {
                    enabled: false
                }
            },
            yAxis: {
                min: 0,
                max: size,
                title: { text: undefined },
                labels: {
                    enabled: false
                }
            },
            zAxis: {
                min: 0,
                max: size
            },
            series: [{
                    lineWidth: 1,
                    lineColor: 'black',
                    showInLegend: false,
                    data: data,
                }],
            tooltip: { enabled: false }
        };
    };
    ChartConfiguratorService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_core_data_service_data_service_service__WEBPACK_IMPORTED_MODULE_1__["DataService"]])
    ], ChartConfiguratorService);
    return ChartConfiguratorService;
}());



/***/ }),

/***/ "./src/app/interactor/interactor.module.ts":
/*!*************************************************!*\
  !*** ./src/app/interactor/interactor.module.ts ***!
  \*************************************************/
/*! exports provided: InteractorModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InteractorModule", function() { return InteractorModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _protein_viewer_protein_viewer_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./protein-viewer/protein-viewer.component */ "./src/app/interactor/protein-viewer/protein-viewer.component.ts");
/* harmony import */ var _core_core_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../core/core.module */ "./src/app/core/core.module.ts");
/* harmony import */ var _talker_talker_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./talker/talker.service */ "./src/app/interactor/talker/talker.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _summary_summary_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./summary/summary.component */ "./src/app/interactor/summary/summary.component.ts");
/* harmony import */ var _pre_viewer_pre_viewer_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./pre-viewer/pre-viewer.component */ "./src/app/interactor/pre-viewer/pre-viewer.component.ts");
/* harmony import */ var _printer_printer_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./printer/printer.component */ "./src/app/interactor/printer/printer.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






// import { HighchartsChartComponent } from 'highcharts-angular';



var InteractorModule = /** @class */ (function () {
    function InteractorModule() {
    }
    InteractorModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            declarations: [_protein_viewer_protein_viewer_component__WEBPACK_IMPORTED_MODULE_2__["ProteinViewerComponent"], _summary_summary_component__WEBPACK_IMPORTED_MODULE_6__["SummaryComponent"], _pre_viewer_pre_viewer_component__WEBPACK_IMPORTED_MODULE_7__["PreViewerComponent"], _printer_printer_component__WEBPACK_IMPORTED_MODULE_8__["PrinterComponent"]],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _core_core_module__WEBPACK_IMPORTED_MODULE_3__["CoreModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_5__["RouterModule"]
            ],
            providers: [_talker_talker_service__WEBPACK_IMPORTED_MODULE_4__["TalkerService"]]
        })
    ], InteractorModule);
    return InteractorModule;
}());



/***/ }),

/***/ "./src/app/interactor/pre-viewer/pre-viewer.component.css":
/*!****************************************************************!*\
  !*** ./src/app/interactor/pre-viewer/pre-viewer.component.css ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "ul{\n    list-style-type: none;\n}\n#successful{\n    padding: 1px;\n    color:white;\n}\n#successful p{\n    width:80%;\n    margin: 1% auto;\n}\n#successful *:focus{\n    border: 3px dashed white;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvaW50ZXJhY3Rvci9wcmUtdmlld2VyL3ByZS12aWV3ZXIuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtJQUNJLHFCQUFxQjtBQUN6QjtBQUNBO0lBQ0ksWUFBWTtJQUNaLFdBQVc7QUFDZjtBQUNBO0lBQ0ksU0FBUztJQUNULGVBQWU7QUFDbkI7QUFDQTtJQUNJLHdCQUF3QjtBQUM1QiIsImZpbGUiOiJzcmMvYXBwL2ludGVyYWN0b3IvcHJlLXZpZXdlci9wcmUtdmlld2VyLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyJ1bHtcbiAgICBsaXN0LXN0eWxlLXR5cGU6IG5vbmU7XG59XG4jc3VjY2Vzc2Z1bHtcbiAgICBwYWRkaW5nOiAxcHg7XG4gICAgY29sb3I6d2hpdGU7XG59XG4jc3VjY2Vzc2Z1bCBwe1xuICAgIHdpZHRoOjgwJTtcbiAgICBtYXJnaW46IDElIGF1dG87XG59XG4jc3VjY2Vzc2Z1bCAqOmZvY3Vze1xuICAgIGJvcmRlcjogM3B4IGRhc2hlZCB3aGl0ZTtcbn0iXX0= */"

/***/ }),

/***/ "./src/app/interactor/pre-viewer/pre-viewer.component.ts":
/*!***************************************************************!*\
  !*** ./src/app/interactor/pre-viewer/pre-viewer.component.ts ***!
  \***************************************************************/
/*! exports provided: PreViewerComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PreViewerComponent", function() { return PreViewerComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _core_data_service_data_service_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../core/data-service/data-service.service */ "./src/app/core/data-service/data-service.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var PreViewerComponent = /** @class */ (function () {
    function PreViewerComponent(_data, _router) {
        this._data = _data;
        this._router = _router;
        this.protein = this._data.getProtein();
    }
    PreViewerComponent.prototype.ngOnInit = function () {
        if (this.protein == undefined)
            this._router.navigate(['/buscador']);
        document.getElementById("focus").focus();
    };
    PreViewerComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-pre-viewer',
            template: __webpack_require__(/*! raw-loader!./pre-viewer.component.html */ "./node_modules/raw-loader/index.js!./src/app/interactor/pre-viewer/pre-viewer.component.html"),
            styles: [__webpack_require__(/*! ./pre-viewer.component.css */ "./src/app/interactor/pre-viewer/pre-viewer.component.css")]
        }),
        __metadata("design:paramtypes", [_core_data_service_data_service_service__WEBPACK_IMPORTED_MODULE_1__["DataService"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], PreViewerComponent);
    return PreViewerComponent;
}());



/***/ }),

/***/ "./src/app/interactor/printer/printer.component.css":
/*!**********************************************************!*\
  !*** ./src/app/interactor/printer/printer.component.css ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "ul{\n    list-style: none;\n   \n}\nli{\n    margin:10px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvaW50ZXJhY3Rvci9wcmludGVyL3ByaW50ZXIuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtJQUNJLGdCQUFnQjs7QUFFcEI7QUFDQTtJQUNJLFdBQVc7QUFDZiIsImZpbGUiOiJzcmMvYXBwL2ludGVyYWN0b3IvcHJpbnRlci9wcmludGVyLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyJ1bHtcbiAgICBsaXN0LXN0eWxlOiBub25lO1xuICAgXG59XG5saXtcbiAgICBtYXJnaW46MTBweDtcbn0iXX0= */"

/***/ }),

/***/ "./src/app/interactor/printer/printer.component.ts":
/*!*********************************************************!*\
  !*** ./src/app/interactor/printer/printer.component.ts ***!
  \*********************************************************/
/*! exports provided: PrinterComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PrinterComponent", function() { return PrinterComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var jquery_dist_jquery_min_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jquery/dist/jquery.min.js */ "./node_modules/jquery/dist/jquery.min.js");
/* harmony import */ var jquery_dist_jquery_min_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(jquery_dist_jquery_min_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var src_app_core_data_service_data_service_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/core/data-service/data-service.service */ "./src/app/core/data-service/data-service.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var PrinterComponent = /** @class */ (function () {
    function PrinterComponent(_dataService, _router) {
        this._dataService = _dataService;
        this._router = _router;
        this.bonds = 'no';
    }
    PrinterComponent.prototype.ngOnInit = function () {
        if (this._dataService.getProtein() == undefined)
            this._router.navigate(['/menu']);
    };
    PrinterComponent.prototype.generateFile = function () {
        var component = this;
        var hackDiv = document.createElement("div");
        hackDiv.id = "icn3dwrap";
        document.body.appendChild(hackDiv);
        jquery_dist_jquery_min_js__WEBPACK_IMPORTED_MODULE_1__(document).ready(function () {
            //Options are available at: https://www.ncbi.nlm.nih.gov/Structure/icn3d/icn3d.html#DisplayOptions
            var opts = {};
            opts['chemicals'] = 'nothing';
            opts['water'] = 'nothing';
            opts['ions'] = 'nothing';
            opts['hbonds'] = component.bonds;
            opts['ssbonds'] = component.bonds;
            var cfg = {
                divid: 'icn3dwrap',
                width: '100%',
                height: '100%',
                showmenu: false
            };
            cfg['pdbid'] = component._dataService.getProtein().identifier;
            cfg['options'] = opts;
            var icn3dui = new iCn3DUI(cfg);
            //communicate with the 3D viewer with chained functions
            jquery_dist_jquery_min_js__WEBPACK_IMPORTED_MODULE_1__["when"](icn3dui.show3DStructure()).then(function () {
                icn3dui.exportStlFile("");
                document.getElementById("icn3dwrap").remove();
                alert("Download realizado com sucesso!");
            });
        });
    };
    PrinterComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-printer',
            template: __webpack_require__(/*! raw-loader!./printer.component.html */ "./node_modules/raw-loader/index.js!./src/app/interactor/printer/printer.component.html"),
            styles: [__webpack_require__(/*! ./printer.component.css */ "./src/app/interactor/printer/printer.component.css")]
        }),
        __metadata("design:paramtypes", [src_app_core_data_service_data_service_service__WEBPACK_IMPORTED_MODULE_2__["DataService"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"]])
    ], PrinterComponent);
    return PrinterComponent;
}());



/***/ }),

/***/ "./src/app/interactor/protein-viewer/protein-viewer.component.ts":
/*!***********************************************************************!*\
  !*** ./src/app/interactor/protein-viewer/protein-viewer.component.ts ***!
  \***********************************************************************/
/*! exports provided: ProteinViewerComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProteinViewerComponent", function() { return ProteinViewerComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _chart_configurator_chart_configurator_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../chart-configurator/chart-configurator.service */ "./src/app/interactor/chart-configurator/chart-configurator.service.ts");
/* harmony import */ var highcharts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! highcharts */ "./node_modules/highcharts/highcharts.js");
/* harmony import */ var highcharts__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(highcharts__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var highcharts_highcharts_3d_src__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! highcharts/highcharts-3d.src */ "./node_modules/highcharts/highcharts-3d.src.js");
/* harmony import */ var highcharts_highcharts_3d_src__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(highcharts_highcharts_3d_src__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _talker_talker_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../talker/talker.service */ "./src/app/interactor/talker/talker.service.ts");
/* harmony import */ var _core_data_service_data_service_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../core/data-service/data-service.service */ "./src/app/core/data-service/data-service.service.ts");
/* harmony import */ var highcharts_modules_accessibility__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! highcharts/modules/accessibility */ "./node_modules/highcharts/modules/accessibility.js");
/* harmony import */ var highcharts_modules_accessibility__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(highcharts_modules_accessibility__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _core_http_pdb_http_pdb_requester_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../core/http-pdb/http-pdb-requester.service */ "./src/app/core/http-pdb/http-pdb-requester.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










highcharts_highcharts_3d_src__WEBPACK_IMPORTED_MODULE_5___default()(highcharts__WEBPACK_IMPORTED_MODULE_3__);
highcharts_modules_accessibility__WEBPACK_IMPORTED_MODULE_8___default()(highcharts__WEBPACK_IMPORTED_MODULE_3__);
var ProteinViewerComponent = /** @class */ (function () {
    function ProteinViewerComponent(_router, _chartConfigurator, _data, _http) {
        this._router = _router;
        this._chartConfigurator = _chartConfigurator;
        this._data = _data;
        this._http = _http;
        this.seletor = null;
        this.history = Array();
        this.visited = new Set();
        this.chartOptions = null;
    }
    /**
     * @ignore
     */
    ProteinViewerComponent.prototype.ngOnInit = function () {
        document.getElementById("header").focus();
        this.chartOptions = this._chartConfigurator.getChartConfigurations(this._data.getSeletor());
        if (this.chartOptions === null)
            this._router.navigate(['/menu']);
        highcharts__WEBPACK_IMPORTED_MODULE_3__["chart"]('pv', this.chartOptions);
        this.configurePoints();
        if (this._data.getSeletor() == "test")
            this.configureTestHTML();
    };
    ProteinViewerComponent.prototype.ngAfterViewInit = function () {
        this.removeDefaultsAria();
        this.configureRotation();
    };
    ProteinViewerComponent.prototype.configureTestHTML = function () {
        var list = document.getElementsByTagName("ul")[0];
        list.children[4].remove();
        list.children[2].remove();
        list.children[1].remove();
    };
    /**
     * Realiza a navegação no gráfico.
     * Fala os comandos básicos do gráfico.
     */
    ProteinViewerComponent.prototype.init = function () {
        document.getElementById('pv').setAttribute("aria-label", "Aperte TAB para iniciar a navegação. Utilize as setas DIREITA, para avançar, e ESQUERDA, para voltar nos aminoácidos. Utilize a tecla 'A' para repetir a posição atual, e  a letra 'Z' para repetir a próxima posição. Utilize a tecla 'W', ou 'TAB' para sair do visualizador.");
        document.getElementById('pv').focus();
    };
    /**
     * @ignore
     * Dirtyfix para poder tornar a navegação viável.
     * Sem essa simulação de clique, NÃO funciona.
     */
    ProteinViewerComponent.prototype.fakeClick = function (event) {
        if (event.key == "Enter")
            document.getElementById("init").click();
        this.trap('first', 'back', event);
    };
    ProteinViewerComponent.prototype.goTo = function (page) {
        this._router.navigate([page]).then(function () {
            if (page == "menu")
                window.location.reload();
        });
    };
    ProteinViewerComponent.prototype.tmpRemSVG = function () {
        document.getElementsByTagName("svg")[0].setAttribute("aria-hidden", "true");
        setTimeout(function () {
            document.getElementsByTagName("svg")[0].setAttribute("aria-hidden", "false");
        }, 100);
    };
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
    ProteinViewerComponent.prototype.event = function (event, data) {
        if (event instanceof KeyboardEvent) {
            var message = void 0;
            if (event.key.toUpperCase() === "A")
                message = data['message'];
            else if (event.key.toUpperCase() === "Z")
                message = data['transition'];
            else if (event.key.toUpperCase() === "H") {
                message = "Histórico de aminoácidos navegados :";
                for (var x = this.history.length - 10; x < this.history.length; x++)
                    message += this.history[x];
            }
            else if (event.key.toUpperCase() == "W" || event.keyCode == 9) {
                event.stopImmediatePropagation();
                return document.getElementById("init").focus();
            }
            if (message != undefined)
                return _talker_talker_service__WEBPACK_IMPORTED_MODULE_6__["TalkerService"].speak(message);
        }
    };
    /**
     * Configura os pontos do gráfico para poder serem navegáveis.
     * Configura os eventos de teclado de cada ponto
     * Configura os aria-labels de cada ponto para o leitor de tela
     */
    ProteinViewerComponent.prototype.configurePoints = function () {
        var _this = this;
        var last = highcharts__WEBPACK_IMPORTED_MODULE_3__["charts"].length;
        var data = highcharts__WEBPACK_IMPORTED_MODULE_3__["charts"][last - 1].series[0].data;
        var _loop_1 = function (x) {
            var html = data[x]["graphic"].element;
            html.setAttribute("aria-label", data[x]["message"] + data[x]["transition"]);
            html.addEventListener('keydown', function (e) {
                data[x]['isLast'] = x == data.length - 1;
                _this.event(e, data[x]);
            });
            html.addEventListener('focus', function () {
                _this.visited.add(data[x]);
                _this.history.push(data[x]['name']);
            });
            console.log(html.getAttribute("aria-label"));
        };
        for (var x = 0; x < data.length; x++) {
            _loop_1(x);
        }
    };
    ProteinViewerComponent.prototype.reconfigurePoints = function (data) {
        var last = highcharts__WEBPACK_IMPORTED_MODULE_3__["charts"].length;
        var htmls = highcharts__WEBPACK_IMPORTED_MODULE_3__["charts"][last - 1].series[0].data;
        for (var x = 0; x < data.length; x++) {
            var html = htmls[x]["graphic"].element;
            html.setAttribute("aria-label", data[x]["message"] + data[x]["transition"]);
            console.log(html.getAttribute("aria-label"));
        }
    };
    /**
     * Cria uma trap na navegação de menus.
     * O usuário fica preso dentro de um determinado fluxo de itens do menu.
     * @param position Posição do elemento no menu
     * @param idFocus Id do elemento que deseja-se focar
     * @param event Evento causado no atual elemento
     *
     */
    ProteinViewerComponent.prototype.trap = function (position, idFocus, event) {
        if (position == "first") {
            if (event.shiftKey && event.key == "Tab") {
                event.preventDefault();
                document.getElementById(idFocus).focus();
            }
        }
        else if (position == "last")
            if (!event.shiftKey && (event.key == "Tab" || event.key == "ArrowDown")) {
                event.preventDefault();
                document.getElementById(idFocus).focus();
            }
    };
    /**
     * Remove os aria-labels do HighCharts que causam problemas na navegação.
     */
    ProteinViewerComponent.prototype.removeDefaultsAria = function () {
        document.getElementsByTagName("svg")[0].setAttribute("aria-label", "");
        document.getElementById("pv").setAttribute("role", "application");
        for (var i = 0; true; i++)
            if (document.getElementsByTagName("desc")[i] != null)
                document.getElementsByTagName("desc")[i].remove();
            else
                break;
        if (document.getElementById("highcharts-information-region-1") != null)
            document.getElementById("highcharts-information-region-1").remove();
        if (document.getElementById("highcharts-information-region-0") != null)
            document.getElementById("highcharts-information-region-0").remove();
    };
    ProteinViewerComponent.prototype.configureRotation = function () {
        var component = this;
        var last = highcharts__WEBPACK_IMPORTED_MODULE_3__["charts"].length - 1;
        var chart = highcharts__WEBPACK_IMPORTED_MODULE_3__["charts"][last];
        jquery__WEBPACK_IMPORTED_MODULE_4__(chart.container).bind('mousedown.hc touchstart.hc', function (eStart) {
            eStart = chart.pointer.normalize(eStart);
            var posX = eStart.pageX;
            var posY = eStart.pageY;
            var alpha = chart.options.chart.options3d.alpha;
            var beta = chart.options.chart.options3d.beta;
            var sensitivity = 5; // lower is more sensitive
            jquery__WEBPACK_IMPORTED_MODULE_4__(document).bind({
                'mousemove.hc touchdrag.hc': function (e) {
                    chart.options.chart.options3d.beta = beta + (posX - e.pageX) / sensitivity;
                    chart.options.chart.options3d.alpha = alpha + (e.pageY - posY) / sensitivity;
                    ;
                    chart.redraw(false);
                },
                'touchend mouseup': function () {
                    jquery__WEBPACK_IMPORTED_MODULE_4__(document).unbind('.hc');
                    var newPlot = new Array();
                    var RADIUS = 5;
                    for (var i = 0; i < chart.series[0].data.length; i++) {
                        var x = chart.series[0].data[i]['graphic']['x'] + RADIUS;
                        var y = chart.series[0].data[i]['graphic']['y'] + RADIUS * 2;
                        var z = chart.series[0].data[i]['z'];
                        var message = chart.series[0].data[i]['message'];
                        if (z == 0)
                            z = 1;
                        var arrAux = [x, y, z];
                        var dictionary = { message: message, position: arrAux };
                        newPlot.push(dictionary);
                    }
                    var type = component._data.getSeletor();
                    component._http.requestRotation(newPlot, type).subscribe(function (result) {
                        component.reconfigurePoints(result);
                    }, function (error) {
                        alert("Ocorreu um erro. Verifique sua internet e tente novamente");
                    });
                }
            });
        });
    };
    ProteinViewerComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-protein-viewer',
            template: __webpack_require__(/*! raw-loader!./protein-viewer.html */ "./node_modules/raw-loader/index.js!./src/app/interactor/protein-viewer/protein-viewer.html"),
            styles: [__webpack_require__(/*! ./protein.css */ "./src/app/interactor/protein-viewer/protein.css")]
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"], _chart_configurator_chart_configurator_service__WEBPACK_IMPORTED_MODULE_2__["ChartConfiguratorService"], _core_data_service_data_service_service__WEBPACK_IMPORTED_MODULE_7__["DataService"], _core_http_pdb_http_pdb_requester_service__WEBPACK_IMPORTED_MODULE_9__["HttpService"]])
    ], ProteinViewerComponent);
    return ProteinViewerComponent;
}());



/***/ }),

/***/ "./src/app/interactor/protein-viewer/protein.css":
/*!*******************************************************!*\
  !*** ./src/app/interactor/protein-viewer/protein.css ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#pv{\n    position: relative;\n    background-color: #ADD8E6;\n    min-height: 120vh;\n    width: 100%;\n    margin:0 auto;\n    box-sizing: border-box;\n}\nsvg{\n    width:inherit;\n    height: inherit;\n}\nul{\n    list-style: none;\n   \n}\nli{\n    margin:10px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvaW50ZXJhY3Rvci9wcm90ZWluLXZpZXdlci9wcm90ZWluLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtJQUNJLGtCQUFrQjtJQUNsQix5QkFBeUI7SUFDekIsaUJBQWlCO0lBQ2pCLFdBQVc7SUFDWCxhQUFhO0lBQ2Isc0JBQXNCO0FBQzFCO0FBQ0E7SUFDSSxhQUFhO0lBQ2IsZUFBZTtBQUNuQjtBQUNBO0lBQ0ksZ0JBQWdCOztBQUVwQjtBQUNBO0lBQ0ksV0FBVztBQUNmIiwiZmlsZSI6InNyYy9hcHAvaW50ZXJhY3Rvci9wcm90ZWluLXZpZXdlci9wcm90ZWluLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIiNwdntcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogI0FERDhFNjtcbiAgICBtaW4taGVpZ2h0OiAxMjB2aDtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBtYXJnaW46MCBhdXRvO1xuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG59XG5zdmd7XG4gICAgd2lkdGg6aW5oZXJpdDtcbiAgICBoZWlnaHQ6IGluaGVyaXQ7XG59XG51bHtcbiAgICBsaXN0LXN0eWxlOiBub25lO1xuICAgXG59XG5saXtcbiAgICBtYXJnaW46MTBweDtcbn0iXX0= */"

/***/ }),

/***/ "./src/app/interactor/summary/summary.component.css":
/*!**********************************************************!*\
  !*** ./src/app/interactor/summary/summary.component.css ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "p{\n    font-size: 1.3em;\n}\nul{list-style: none;}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvaW50ZXJhY3Rvci9zdW1tYXJ5L3N1bW1hcnkuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtJQUNJLGdCQUFnQjtBQUNwQjtBQUNBLEdBQUcsZ0JBQWdCLENBQUMiLCJmaWxlIjoic3JjL2FwcC9pbnRlcmFjdG9yL3N1bW1hcnkvc3VtbWFyeS5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsicHtcbiAgICBmb250LXNpemU6IDEuM2VtO1xufVxudWx7bGlzdC1zdHlsZTogbm9uZTt9Il19 */"

/***/ }),

/***/ "./src/app/interactor/summary/summary.component.ts":
/*!*********************************************************!*\
  !*** ./src/app/interactor/summary/summary.component.ts ***!
  \*********************************************************/
/*! exports provided: SummaryComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SummaryComponent", function() { return SummaryComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _core_data_service_data_service_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../core/data-service/data-service.service */ "./src/app/core/data-service/data-service.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var SummaryComponent = /** @class */ (function () {
    function SummaryComponent(_dataS, _router) {
        this._dataS = _dataS;
        this._router = _router;
        this.protein = this._dataS.getProtein();
    }
    SummaryComponent.prototype.goMenu = function () {
        this._router.navigate(['/menu']);
        document.getElementById("header").focus();
    };
    SummaryComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-summary',
            template: __webpack_require__(/*! raw-loader!./summary.component.html */ "./node_modules/raw-loader/index.js!./src/app/interactor/summary/summary.component.html"),
            styles: [__webpack_require__(/*! ./summary.component.css */ "./src/app/interactor/summary/summary.component.css")]
        }),
        __metadata("design:paramtypes", [_core_data_service_data_service_service__WEBPACK_IMPORTED_MODULE_1__["DataService"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], SummaryComponent);
    return SummaryComponent;
}());



/***/ }),

/***/ "./src/app/interactor/talker/talker.service.ts":
/*!*****************************************************!*\
  !*** ./src/app/interactor/talker/talker.service.ts ***!
  \*****************************************************/
/*! exports provided: TalkerService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TalkerService", function() { return TalkerService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var TalkerService = /** @class */ (function () {
    function TalkerService() {
    }
    TalkerService_1 = TalkerService;
    TalkerService.speak = function (message) {
        if (speechSynthesis.speaking) {
            // SpeechSyn is currently speaking, cancel the current utterance(s)
            speechSynthesis.cancel();
            // Make sure we don't create more than one timeout...
            if (TalkerService_1.sayTimeout !== null)
                clearTimeout(TalkerService_1.sayTimeout);
        }
        // Good to go
        var msg = new SpeechSynthesisUtterance(message);
        msg.volume = 1.0;
        msg.pitch = 1.0;
        msg.rate = 0.9;
        msg.voice = TalkerService_1.toPortuguese();
        msg.lang = "pt-BR";
        speechSynthesis.speak(msg);
        console.log(message);
    };
    TalkerService.toPortuguese = function () {
        var i;
        for (i = 0; speechSynthesis.getVoices()[i].lang.toLowerCase() != "pt-br"; i++) { }
        console.log(speechSynthesis.getVoices()[i]);
        return speechSynthesis.getVoices()[i];
    };
    var TalkerService_1;
    TalkerService.talker = new SpeechSynthesisUtterance();
    TalkerService.sayTimeout = setTimeout(function () { TalkerService_1.speak(""); }, 250);
    TalkerService = TalkerService_1 = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        })
    ], TalkerService);
    return TalkerService;
}());



/***/ }),

/***/ "./src/app/interfaces/points.ts":
/*!**************************************!*\
  !*** ./src/app/interfaces/points.ts ***!
  \**************************************/
/*! exports provided: Points */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Points", function() { return Points; });
var Points = /** @class */ (function () {
    function Points() {
    }
    return Points;
}());



/***/ }),

/***/ "./src/app/interfaces/protein.ts":
/*!***************************************!*\
  !*** ./src/app/interfaces/protein.ts ***!
  \***************************************/
/*! exports provided: Protein */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Protein", function() { return Protein; });
var Protein = /** @class */ (function () {
    function Protein(identifier, title, authors, version, dep_date, experiment, residues) {
        this._identifier = identifier;
        this._title = title;
        this._authors = authors;
        this._version = version;
        this._dep_date = dep_date;
        this._experiment = experiment;
        this._residues = residues;
    }
    Object.defineProperty(Protein.prototype, "identifier", {
        get: function () {
            return this._identifier;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Protein.prototype, "authors", {
        get: function () {
            return this._authors;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Protein.prototype, "experiment", {
        get: function () {
            return this._experiment;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Protein.prototype, "classification", {
        get: function () {
            return this._classification;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Protein.prototype, "dep_date", {
        get: function () {
            return this._dep_date;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Protein.prototype, "residues", {
        get: function () {
            return this._residues;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Protein.prototype, "version", {
        get: function () {
            return this._version;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Protein.prototype, "title", {
        get: function () {
            return this._title;
        },
        enumerable: true,
        configurable: true
    });
    return Protein;
}());



/***/ }),

/***/ "./src/app/interfaces/testGraphic.ts":
/*!*******************************************!*\
  !*** ./src/app/interfaces/testGraphic.ts ***!
  \*******************************************/
/*! exports provided: TestGraphic */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TestGraphic", function() { return TestGraphic; });
var TestGraphic = /** @class */ (function () {
    function TestGraphic(points) {
        this.points = points;
    }
    return TestGraphic;
}());



/***/ }),

/***/ "./src/app/menu/form/form.component.css":
/*!**********************************************!*\
  !*** ./src/app/menu/form/form.component.css ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "button{\n    width: 15%;\n    border-radius: 45;\n}\n#messageError{\n    visibility: hidden\n}\n#messageError:focus, #successful:focus{\n    border: 3px dashed black;\n}\nul{\n    list-style: none;\n}\nli, #successful li{\n    margin: 0 10px;\n}\nli a{\n    width: 300px;\n    height: auto;\n}\np{\n    width: 620px;\n    margin : 0 auto;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbWVudS9mb3JtL2Zvcm0uY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtJQUNJLFVBQVU7SUFDVixpQkFBaUI7QUFDckI7QUFDQTtJQUNJO0FBQ0o7QUFDQTtJQUNJLHdCQUF3QjtBQUM1QjtBQUVBO0lBQ0ksZ0JBQWdCO0FBQ3BCO0FBQ0E7SUFDSSxjQUFjO0FBQ2xCO0FBQ0E7SUFDSSxZQUFZO0lBQ1osWUFBWTtBQUNoQjtBQUNBO0lBQ0ksWUFBWTtJQUNaLGVBQWU7QUFDbkIiLCJmaWxlIjoic3JjL2FwcC9tZW51L2Zvcm0vZm9ybS5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiYnV0dG9ue1xuICAgIHdpZHRoOiAxNSU7XG4gICAgYm9yZGVyLXJhZGl1czogNDU7XG59XG4jbWVzc2FnZUVycm9ye1xuICAgIHZpc2liaWxpdHk6IGhpZGRlblxufVxuI21lc3NhZ2VFcnJvcjpmb2N1cywgI3N1Y2Nlc3NmdWw6Zm9jdXN7XG4gICAgYm9yZGVyOiAzcHggZGFzaGVkIGJsYWNrO1xufVxuXG51bHtcbiAgICBsaXN0LXN0eWxlOiBub25lO1xufVxubGksICNzdWNjZXNzZnVsIGxpe1xuICAgIG1hcmdpbjogMCAxMHB4O1xufVxubGkgYXtcbiAgICB3aWR0aDogMzAwcHg7XG4gICAgaGVpZ2h0OiBhdXRvO1xufVxucHtcbiAgICB3aWR0aDogNjIwcHg7XG4gICAgbWFyZ2luIDogMCBhdXRvO1xufSJdfQ== */"

/***/ }),

/***/ "./src/app/menu/form/form.component.ts":
/*!*********************************************!*\
  !*** ./src/app/menu/form/form.component.ts ***!
  \*********************************************/
/*! exports provided: FormComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FormComponent", function() { return FormComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _core_data_service_data_service_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../core/data-service/data-service.service */ "./src/app/core/data-service/data-service.service.ts");
/* harmony import */ var _core_http_pdb_http_pdb_requester_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../core/http-pdb/http-pdb-requester.service */ "./src/app/core/http-pdb/http-pdb-requester.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var FormComponent = /** @class */ (function () {
    function FormComponent(_pdbRequester, _router, dataService) {
        this._pdbRequester = _pdbRequester;
        this._router = _router;
        this.dataService = dataService;
    }
    FormComponent.prototype.ngOnInit = function () {
        document.getElementById("principalHeader").focus();
    };
    /**
     * Faz a busca pela proteína desejada.
     * Caso ocorra algum erro, é escrito na tela.
     * Se não, navega para a página para visualizar as informações gerais da proteína.
     * O nome usado é o do input 'protein'
     */
    FormComponent.prototype.requestProtein = function () {
        var _this = this;
        this._pdbRequester.requestTags(this.pdbFile).subscribe(function (result) {
            _this.dataService.setProtein(result);
            _this.dataService.setSeletor('protein');
            _this._router.navigate(['preView']);
        }, function (error) {
            var errEl = document.getElementById('messageError');
            errEl.style.visibility = 'visible';
            errEl.innerHTML = 'Um erro aconteceu. Verifique se o nome do identificador' +
                ' da proteína está correto e/ou se você possui internet.';
            errEl.focus();
        });
    };
    FormComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-form',
            template: __webpack_require__(/*! raw-loader!./form.component.html */ "./node_modules/raw-loader/index.js!./src/app/menu/form/form.component.html"),
            styles: [__webpack_require__(/*! ./form.component.css */ "./src/app/menu/form/form.component.css")]
        }),
        __metadata("design:paramtypes", [_core_http_pdb_http_pdb_requester_service__WEBPACK_IMPORTED_MODULE_3__["HttpService"], _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"], _core_data_service_data_service_service__WEBPACK_IMPORTED_MODULE_2__["DataService"]])
    ], FormComponent);
    return FormComponent;
}());



/***/ }),

/***/ "./src/app/menu/manual/manual.component.css":
/*!**************************************************!*\
  !*** ./src/app/menu/manual/manual.component.css ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "p{\n    text-align: center;\n    padding:0 10vw;\n    letter-spacing: 1px;\n    font-size: 1.2em;\n}\nnav *,span {\n    color:blue;\n    cursor:pointer;    \n}\nnav{\n    border:thin solid black;\n    border-bottom:none;\n}\nnav ul, .submenu ul {\n    list-style-type: none;\n    padding : 0;\n}\nsection p {\n    text-align: left;\n    padding:0 1px;\n}\n.title{\n    font-size: 1.5em;\n    border-bottom:thin solid black;\n    text-indent: 2em;\n}\n.subtitle{\n    font-size: 1.1em;\n    text-indent: 3.5em;\n    border-bottom:thin solid black;\n}\n.submenu{\n    border:none;\n}   \n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbWVudS9tYW51YWwvbWFudWFsLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7SUFDSSxrQkFBa0I7SUFDbEIsY0FBYztJQUNkLG1CQUFtQjtJQUNuQixnQkFBZ0I7QUFDcEI7QUFDQTtJQUNJLFVBQVU7SUFDVixjQUFjO0FBQ2xCO0FBQ0E7SUFDSSx1QkFBdUI7SUFDdkIsa0JBQWtCO0FBQ3RCO0FBQ0E7SUFDSSxxQkFBcUI7SUFDckIsV0FBVztBQUNmO0FBQ0E7SUFDSSxnQkFBZ0I7SUFDaEIsYUFBYTtBQUNqQjtBQUNBO0lBQ0ksZ0JBQWdCO0lBQ2hCLDhCQUE4QjtJQUM5QixnQkFBZ0I7QUFDcEI7QUFDQTtJQUNJLGdCQUFnQjtJQUNoQixrQkFBa0I7SUFDbEIsOEJBQThCO0FBQ2xDO0FBQ0E7SUFDSSxXQUFXO0FBQ2YiLCJmaWxlIjoic3JjL2FwcC9tZW51L21hbnVhbC9tYW51YWwuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbInB7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIHBhZGRpbmc6MCAxMHZ3O1xuICAgIGxldHRlci1zcGFjaW5nOiAxcHg7XG4gICAgZm9udC1zaXplOiAxLjJlbTtcbn1cbm5hdiAqLHNwYW4ge1xuICAgIGNvbG9yOmJsdWU7XG4gICAgY3Vyc29yOnBvaW50ZXI7ICAgIFxufVxubmF2e1xuICAgIGJvcmRlcjp0aGluIHNvbGlkIGJsYWNrO1xuICAgIGJvcmRlci1ib3R0b206bm9uZTtcbn1cbm5hdiB1bCwgLnN1Ym1lbnUgdWwge1xuICAgIGxpc3Qtc3R5bGUtdHlwZTogbm9uZTtcbiAgICBwYWRkaW5nIDogMDtcbn1cbnNlY3Rpb24gcCB7XG4gICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICBwYWRkaW5nOjAgMXB4O1xufVxuLnRpdGxle1xuICAgIGZvbnQtc2l6ZTogMS41ZW07XG4gICAgYm9yZGVyLWJvdHRvbTp0aGluIHNvbGlkIGJsYWNrO1xuICAgIHRleHQtaW5kZW50OiAyZW07XG59XG4uc3VidGl0bGV7XG4gICAgZm9udC1zaXplOiAxLjFlbTtcbiAgICB0ZXh0LWluZGVudDogMy41ZW07XG4gICAgYm9yZGVyLWJvdHRvbTp0aGluIHNvbGlkIGJsYWNrO1xufVxuLnN1Ym1lbnV7XG4gICAgYm9yZGVyOm5vbmU7XG59ICAgIl19 */"

/***/ }),

/***/ "./src/app/menu/manual/manual.component.ts":
/*!*************************************************!*\
  !*** ./src/app/menu/manual/manual.component.ts ***!
  \*************************************************/
/*! exports provided: ManualComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ManualComponent", function() { return ManualComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var ManualComponent = /** @class */ (function () {
    function ManualComponent() {
    }
    ManualComponent.prototype.ngOnInit = function () {
        document.getElementById('principalTitle').focus();
    };
    /**
     *
     * @ignore
     */
    ManualComponent.prototype.goTo = function (event, el) {
        event.preventDefault();
        document.getElementById(el).focus();
    };
    ManualComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-manual',
            template: __webpack_require__(/*! raw-loader!./manual.component.html */ "./node_modules/raw-loader/index.js!./src/app/menu/manual/manual.component.html"),
            styles: [__webpack_require__(/*! ./manual.component.css */ "./src/app/menu/manual/manual.component.css")]
        })
    ], ManualComponent);
    return ManualComponent;
}());



/***/ }),

/***/ "./src/app/menu/menu.module.ts":
/*!*************************************!*\
  !*** ./src/app/menu/menu.module.ts ***!
  \*************************************/
/*! exports provided: MenuModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MenuModule", function() { return MenuModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _form_form_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./form/form.component */ "./src/app/menu/form/form.component.ts");
/* harmony import */ var _menu_menu_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./menu/menu.component */ "./src/app/menu/menu/menu.component.ts");
/* harmony import */ var _core_core_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../core/core.module */ "./src/app/core/core.module.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _core_http_pdb_http_pdb_requester_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../core/http-pdb/http-pdb-requester.service */ "./src/app/core/http-pdb/http-pdb-requester.service.ts");
/* harmony import */ var _manual_manual_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./manual/manual.component */ "./src/app/menu/manual/manual.component.ts");
/* harmony import */ var _testes_testes_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./testes/testes.component */ "./src/app/menu/testes/testes.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};










var MenuModule = /** @class */ (function () {
    function MenuModule() {
    }
    MenuModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            declarations: [
                _form_form_component__WEBPACK_IMPORTED_MODULE_3__["FormComponent"],
                _menu_menu_component__WEBPACK_IMPORTED_MODULE_4__["MenuComponent"],
                _manual_manual_component__WEBPACK_IMPORTED_MODULE_8__["ManualComponent"],
                _testes_testes_component__WEBPACK_IMPORTED_MODULE_9__["TestesComponent"]
            ],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
                _core_core_module__WEBPACK_IMPORTED_MODULE_5__["CoreModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_6__["RouterModule"]
            ],
            providers: [_core_http_pdb_http_pdb_requester_service__WEBPACK_IMPORTED_MODULE_7__["HttpService"]]
        })
    ], MenuModule);
    return MenuModule;
}());



/***/ }),

/***/ "./src/app/menu/menu/menu.component.css":
/*!**********************************************!*\
  !*** ./src/app/menu/menu/menu.component.css ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "button{\n    width: 75%;\n    border-radius: 45;\n}\nul{\n    list-style: none;\n}\nli{\n    margin:10px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbWVudS9tZW51L21lbnUuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtJQUNJLFVBQVU7SUFDVixpQkFBaUI7QUFDckI7QUFDQTtJQUNJLGdCQUFnQjtBQUNwQjtBQUNBO0lBQ0ksV0FBVztBQUNmIiwiZmlsZSI6InNyYy9hcHAvbWVudS9tZW51L21lbnUuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbImJ1dHRvbntcbiAgICB3aWR0aDogNzUlO1xuICAgIGJvcmRlci1yYWRpdXM6IDQ1O1xufVxudWx7XG4gICAgbGlzdC1zdHlsZTogbm9uZTtcbn1cbmxpe1xuICAgIG1hcmdpbjoxMHB4O1xufSJdfQ== */"

/***/ }),

/***/ "./src/app/menu/menu/menu.component.ts":
/*!*********************************************!*\
  !*** ./src/app/menu/menu/menu.component.ts ***!
  \*********************************************/
/*! exports provided: MenuComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MenuComponent", function() { return MenuComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var MenuComponent = /** @class */ (function () {
    function MenuComponent() {
    }
    /**
   * @ignore
   */
    MenuComponent.prototype.ngOnInit = function () {
        document.getElementById('menuLock').focus();
    };
    /**
     * @ignore
     */
    MenuComponent.prototype.lastMenuVerify = function (e) {
        if (e.keyCode == 9 && !e.shiftKey) {
            e.preventDefault();
            document.getElementById('menuLock').focus();
        }
    };
    MenuComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-menu',
            template: __webpack_require__(/*! raw-loader!./menu.component.html */ "./node_modules/raw-loader/index.js!./src/app/menu/menu/menu.component.html"),
            styles: [__webpack_require__(/*! ./menu.component.css */ "./src/app/menu/menu/menu.component.css")]
        })
    ], MenuComponent);
    return MenuComponent;
}());



/***/ }),

/***/ "./src/app/menu/testes/testes.component.css":
/*!**************************************************!*\
  !*** ./src/app/menu/testes/testes.component.css ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "ul{\n    list-style: none;\n}\nli{\n    margin-bottom:1%;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbWVudS90ZXN0ZXMvdGVzdGVzLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7SUFDSSxnQkFBZ0I7QUFDcEI7QUFDQTtJQUNJLGdCQUFnQjtBQUNwQiIsImZpbGUiOiJzcmMvYXBwL21lbnUvdGVzdGVzL3Rlc3Rlcy5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsidWx7XG4gICAgbGlzdC1zdHlsZTogbm9uZTtcbn1cbmxpe1xuICAgIG1hcmdpbi1ib3R0b206MSU7XG59Il19 */"

/***/ }),

/***/ "./src/app/menu/testes/testes.component.ts":
/*!*************************************************!*\
  !*** ./src/app/menu/testes/testes.component.ts ***!
  \*************************************************/
/*! exports provided: TestesComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TestesComponent", function() { return TestesComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _core_http_pdb_http_pdb_requester_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../core/http-pdb/http-pdb-requester.service */ "./src/app/core/http-pdb/http-pdb-requester.service.ts");
/* harmony import */ var _core_data_service_data_service_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../core/data-service/data-service.service */ "./src/app/core/data-service/data-service.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var TestesComponent = /** @class */ (function () {
    function TestesComponent(_pdb, _router, _dataS) {
        this._pdb = _pdb;
        this._router = _router;
        this._dataS = _dataS;
    }
    TestesComponent.prototype.ngOnInit = function () {
        document.getElementById("header").focus();
    };
    /**
     * Recebe o nome da figura geométrica desejada ,faz a busca por ela no Python e navega à página do gráfico
     * @param name
     *
     */
    TestesComponent.prototype.request = function (name) {
        var _this = this;
        this._pdb.requestTest(name).subscribe(function (result) {
            _this._dataS.setTest(result);
            _this._dataS.setSeletor('test');
            _this._router.navigate(['viewTest']);
        });
    };
    TestesComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-testes',
            template: __webpack_require__(/*! raw-loader!./testes.component.html */ "./node_modules/raw-loader/index.js!./src/app/menu/testes/testes.component.html"),
            styles: [__webpack_require__(/*! ./testes.component.css */ "./src/app/menu/testes/testes.component.css")]
        }),
        __metadata("design:paramtypes", [_core_http_pdb_http_pdb_requester_service__WEBPACK_IMPORTED_MODULE_1__["HttpService"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"], _core_data_service_data_service_service__WEBPACK_IMPORTED_MODULE_2__["DataService"]])
    ], TestesComponent);
    return TestesComponent;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.error(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /home/labio/Área de Trabalho/WalkingMol/ngCli/src/main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map