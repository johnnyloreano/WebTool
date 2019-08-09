(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["styles"],{

/***/ "./node_modules/@angular-devkit/build-angular/src/angular-cli-files/plugins/raw-css-loader.js!./node_modules/postcss-loader/src/index.js?!./src/assets/icn3d/icn3d_full_ui.css":
/*!*************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@angular-devkit/build-angular/src/angular-cli-files/plugins/raw-css-loader.js!./node_modules/postcss-loader/src??embedded!./src/assets/icn3d/icn3d_full_ui.css ***!
  \*************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = [[module.i, ".icn3d-text {font-family: Verdana, Arial, Helvetica, sans-serif; font-size:12px!important;}\n\n.ui-dialog { font-size: 12px;}\n\n.ui-dialog .ui-dialog-title { font-size: 16px; height: 18px; }\n\n.ui-dialog .ui-button { width: 12px; height:12px; margin: -5px 0px 0px 0px;}\n\n.ui-dialog .ui-dialog-titlebar { padding: 0px 1em 2px 1em; }\n\n.ui-accordion .ui-accordion-icons { padding-left: 0; text-align: center; }\n\n.icn3d-menu {float:left; width:110px;}\n\naccordion {font-size: 14px!important; z-index:1999; }\n\naccordion h3 {width: 100px; font-size: 14px!important;}\n\naccordion h3 > .ui-icon { display: none !important; }\n\n//accordion ul {width: 110px}\n\naccordion ul ul  {width: 160px}\n\naccordion ul li {cursor:default!important; white-space:nowrap;}\n\n/*accordion ul .icn3d-link, div .icn3d-link, accordion li input, accordion li label, button {cursor:pointer!important; } */\n\n.icn3d-link, accordion li input, accordion li label, button {cursor:pointer!important; }\n\n.icn3d-blue {color:blue!important;}\n\n/*.icn3d-dl_sequence {background: white; padding-left:10px;}*/\n\n.icn3d-dl_sequence {background: white;}\n\n.icn3d-highlightSeq {background-color: #FFFF00;}\n\n.icn3d-highlightSeqBox {border:3px solid #FFA500;}\n\n/* used to identify a residue when clicking a residue in sequence*/\n\n.icn3d-residue {font-weight:regular;}\n\n.icn3d-residueNum {color: green; width:40px!important; text-align:center; white-space:nowrap;}\n\n.icn3d-dl_sequence span {display:inline-block; font-size:11px; width:10px; text-align:center;}\n\n.icn3d-dl_2ddgm {}\n\n//{min-width: 150px!important; min-height: 150px!important;}\n\n.icn3d-chemical {width:30px!important;}\n\nbutton, select, input { font-size: 10px; }\n\n.icn3d-hidden {display: none;}\n\n.icn3d-shown {display: block;}\n\n.icn3d-seqTitle, .icn3d-seqTitle2, .icn3d-annoTitle {display:inline-block; font-size:11px; font-weight:bold; width:60px;}\n\n.icn3d-annotation {white-space: nowrap;}\n\n.icn3d-annotation .icn3d-seqTitle, .icn3d-annotation .icn3d-seqTitle2, .icn3d-annotation .icn3d-annoTitle {display:inline-block; font-size:11px; font-weight:bold; width:120px;}\n\n.icn3d-seqLine {white-space:nowrap;}\n\n.icn3d-annoLargeTitle {font-size:14px; font-weight:bold; background-color: #DDDDDD;}\n\n.icn3d-large {font-size:14px; font-weight:bold;}\n\n.icn3d-dialog {font-family: Verdana, Arial, Helvetica, sans-serif; color: #666666;}\n\n.icn3d-commandTitle  {font-size: 12px; font-weight:bold; font-family: Verdana, Arial, Helvetica, sans-serif; color: #666666;}\n\n.icn3d-modeselection  {color: #f8b84e!important;}\n\n/*.icn3d-viewselection  {color: #800000!important;}*/\n\n.icn3d-viewselection  {color: #f8b84e!important;}\n\n.icn3d-middleIcon {opacity: 1.0}\n\n.icn3d-endIcon {opacity: 0.2}\n\n.icn3d-box {border: solid 1px #ccc; padding: 5px; margin: 5px;}\n\n/* sequence alignent, 'cons' means aligned and conserved, 'ncons' means aligned and not conserved, 'nalign' means not aligned*/\n\n.icn3d-cons {}\n\n.icn3d-ncons {}\n\n.icn3d-nalign {}\n\n.icn3d-node {cursor:pointer!important; }\n\n.icn3d-interaction {cursor:pointer!important; }\n\n.ui-dialog .ui-resizable-se {\n    width: 14px;\n    height: 14px;\n    right: 3px;\n    bottom: 3px;\n    background-position: -80px -224px;\n}\n\n.ui-menu-icon {\n    float: right;\n}\n\n/* toggle button: http://www.w3schools.com/howto/howto_css_switch.asp */\n\n.icn3d-switch {\n  position: relative;\n  display: inline-block;\n  width: 33px;\n  height: 18px;\n}\n\n.icn3d-switch input {display:none;}\n\n.icn3d-slider {\n  position: absolute;\n  cursor: pointer;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-color: #ccc;\n  transition: .4s;\n}\n\n.icn3d-slider:before {\n  position: absolute;\n  content: \"\";\n  height: 13px;\n  width: 13px;\n  left: 4px;\n  bottom: 3px;\n  background-color: white;\n  transition: .4s;\n}\n\ninput:checked + .icn3d-slider {\n  background-color: #f8b84e;\n}\n\ninput:focus + .icn3d-slider {\n  box-shadow: 0 0 1px #f8b84e;\n}\n\ninput:checked + .icn3d-slider:before {\n  -webkit-transform: translateX(13px);\n  transform: translateX(13px);\n}\n\n.icn3d-slider.icn3d-round {\n  border-radius: 18px;\n}\n\n.icn3d-slider.icn3d-round:before {\n  border-radius: 50%;\n}\n\n/* jquery UI 1.12.1\n   for jquery tooltip */\n\n.icn3d-tooltip {\n  display: inline-block;\n  width: 200px;\n}\n\n.snptip {\n  max-height: 150px;\n  overflow:auto;\n}\n\n.ui-widget {\n  font-family: Arial,Helvetica,sans-serif;\n  font-size: 12px!important;\n}\n\n.ui-menu-item {\n  position: relative;\n  padding: 3px 1em 3px .4em;\n}\n\n.icn3d-clinvar {color:green; font-size:12px; font-weight:bold;}\n\n.icn3d-clinvar-path {color:purple; font-size:12px; font-weight:bold;}\n\n/*.icn3d-sheet {background-image: linear-gradient(transparent, transparent 25%, #FFC800 25%, #FFC800 75%, transparent 75%, transparent 100%);} */\n\n.icn3d-sheet {background-image: linear-gradient(transparent, transparent 25%, #008000 25%, #008000 75%, transparent 75%, transparent 100%);}\n\n.icn3d-sheet2 {background-image: url('trig.png'); background-size: contain; background-repeat: no-repeat;}\n\n.icn3d-sheety {background-image: linear-gradient(transparent, transparent 25%, #FFC800 25%, #FFC800 75%, transparent 75%, transparent 100%);}\n\n.icn3d-sheet2y {background-image: url('triy.png'); background-size: contain; background-repeat: no-repeat;}\n\n.icn3d-helix {background-image: url('helix.png'); background-size: contain; background-repeat: no-repeat;}\n\n.icn3d-helix2 {background-image: url('helix2.png'); background-size: contain; background-repeat: no-repeat;}\n\n.icn3d-coil {background-image: linear-gradient(transparent, transparent 45%, #6080FF 45%, #6080FF 55%, transparent 55%, transparent 100%);}\n\n.icn3d-other {background-image: linear-gradient(transparent, transparent 45%, #DDDDDD 45%, #DDDDDD 55%, transparent 55%, transparent 100%);}\n\n.icn3d-helix-color {color: #FF0080;}\n\n.icn3d-sheet-color {color: #008000;}\n\n.icn3d-sheet-colory {color: #FFC800;}\n\n.icn3d-fixed-pos {position:fixed;}\n\n/*.icn3d-space-title {width:160px; display:inline-block;} */\n\n.icn3d-bkgd {background-color:#eee;}\n\n/* remove the extra bar in the menu */\n\n/* background: #eee url(images/ui-bg_highlight-soft_100_eeeeee_1x100.png) 50% top repeat-x; */\n\n.ui-widget-content {\n    border: 1px solid #ddd;\n    background: #eee;\n    color: #333;\n}\n\n.icn3d-rad > input{ /* HIDE RADIO */\n  visibility: hidden; /* Makes input not-clickable */\n  position: absolute; /* Remove input from document flow */\n}\n\n.icn3d-rad > input + .ui-icon{ /* IMAGE STYLES */\n  cursor:pointer;\n  //border:2px solid transparent;\n}\n\n.icn3d-rad > input:checked + .ui-icon{ /* (RADIO CHECKED) IMAGE STYLES */\n  //border:2px solid #f00;\n  background-position: -64px -144px; \n}\n\n.ui-menu-icons .ui-menu-item-wrapper {\n    padding-left: 0em;\n}\n\n.icn3d-rad-text {\n    padding-left: 2em;\n}\n\n.icn3d-popup {display:none; position:absolute; z-index:9999; top:-1000px; left:-1000px; background-color:#DDDDDD; text-align:center; width:80px; height:18px; padding:3px;}\n\n.color-picker,\n.color-picker:before,\n.color-picker:after,\n.color-picker *,\n.color-picker *:before,\n.color-picker *:after {\n  box-sizing:border-box;\n}\n\n.color-picker {\n  position:absolute;\n  top:0;\n  left:0;\n  z-index:9999;\n  width:172px;\n}\n\n.color-picker-control {\n  border:1px solid #000;\n  box-shadow:1px 5px 10px rgba(0,0,0,.5);\n}\n\n.color-picker-control *,\n.color-picker-control *:before,\n.color-picker-control *:after {border-color:inherit}\n\n.color-picker-control:after {\n  content:\" \";\n  display:table;\n  clear:both;\n}\n\n.color-picker i {font:inherit}\n\n.color-picker-h {\n  position:relative;\n  width:20px;\n  height:150px;\n  float:right;\n  border-left:1px solid;\n  border-left-color:inherit;\n  cursor:ns-resize;\n  background-image:linear-gradient(to top,#f00 0%,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,#f00 100%);\n  background-size:100% 100%;\n  overflow:hidden;\n}\n\n.color-picker-h i {\n  position:absolute;\n  top:-3px;\n  right:0;\n  left:0;\n  z-index:3;\n  display:block;\n  height:6px;\n}\n\n.color-picker-h i:before {\n  content:\"\";\n  position:absolute;\n  top:0;\n  right:0;\n  bottom:0;\n  left:0;\n  display:block;\n  border:3px solid;\n  border-color:inherit;\n  border-top-color:transparent;\n  border-bottom-color:transparent;\n}\n\n.color-picker-sv {\n  position:relative;\n  width:150px;\n  height:150px;\n  float:left;\n  background-image:linear-gradient(to top,#000,rgba(0,0,0,0)),linear-gradient(to right,#fff,rgba(255,255,255,0));\n  background-size:100% 100%;\n  cursor:crosshair;\n}\n\n.color-picker-sv i {\n  position:absolute;\n  top:-4px;\n  right:-4px;\n  z-index:3;\n  display:block;\n  width:8px;\n  height:8px;\n}\n\n.color-picker-sv i:before,\n.color-picker-sv i:after {\n  content:\"\";\n  position:absolute;\n  top:0;\n  right:0;\n  bottom:0;\n  left:0;\n  display:block;\n  border:1px solid;\n  border-color:inherit;\n  border-radius:100%;\n}\n\n.color-picker-sv i:before {\n  top:-1px;\n  right:-1px;\n  bottom:-1px;\n  left:-1px;\n  border-color:#fff;\n}\n\n.color-picker-h,\n.color-picker-sv {\n  -webkit-touch-callout:none;\n  -webkit-user-select:none;\n  -moz-user-select:none;\n  -ms-user-select:none;\n  user-select:none;\n  -webkit-tap-highlight-color:rgba(0,0,0,0);\n  -webkit-tap-highlight-color:transparent;\n}\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hc3NldHMvaWNuM2QvaWNuM2RfZnVsbF91aS5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsYUFBYSxrREFBa0QsRUFBRSx3QkFBd0IsQ0FBQzs7QUFFMUYsYUFBYSxlQUFlLENBQUM7O0FBQzdCLDhCQUE4QixlQUFlLEVBQUUsWUFBWSxFQUFFOztBQUM3RCx3QkFBd0IsV0FBVyxFQUFFLFdBQVcsRUFBRSx3QkFBd0IsQ0FBQzs7QUFDM0UsaUNBQWlDLHdCQUF3QixFQUFFOztBQUUzRCxvQ0FBb0MsZUFBZSxFQUFFLGtCQUFrQixFQUFFOztBQUV6RSxhQUFhLFVBQVUsRUFBRSxXQUFXLENBQUM7O0FBQ3JDLFdBQVcseUJBQXlCLEVBQUUsWUFBWSxFQUFFOztBQUNwRCxjQUFjLFlBQVksRUFBRSx5QkFBeUIsQ0FBQzs7QUFDdEQsMEJBQTBCLHdCQUF3QixFQUFFOztBQUNwRCxnQkFBZ0IsWUFBWTs7QUFDNUIsa0JBQWtCLFlBQVk7O0FBQzlCLGlCQUFpQix3QkFBd0IsRUFBRSxrQkFBa0IsQ0FBQzs7QUFDOUQsMEhBQTBIOztBQUMxSCw2REFBNkQsd0JBQXdCLEVBQUU7O0FBQ3ZGLGFBQWEsb0JBQW9CLENBQUM7O0FBRWxDLDZEQUE2RDs7QUFDN0Qsb0JBQW9CLGlCQUFpQixDQUFDOztBQUN0QyxxQkFBcUIseUJBQXlCLENBQUM7O0FBQy9DLHdCQUF3Qix3QkFBd0IsQ0FBQzs7QUFFakQsa0VBQWtFOztBQUNsRSxnQkFBZ0IsbUJBQW1CLENBQUM7O0FBQ3BDLG1CQUFtQixZQUFZLEVBQUUsb0JBQW9CLEVBQUUsaUJBQWlCLEVBQUUsa0JBQWtCLENBQUM7O0FBRTdGLHlCQUF5QixvQkFBb0IsRUFBRSxjQUFjLEVBQUUsVUFBVSxFQUFFLGlCQUFpQixDQUFDOztBQUM3RixpQkFBaUI7O0FBQUUsR0FBRywwQkFBMEIsRUFBRSwyQkFBMkIsQ0FBQzs7QUFDOUUsaUJBQWlCLG9CQUFvQixDQUFDOztBQUV0Qyx3QkFBd0IsZUFBZSxFQUFFOztBQUV6QyxlQUFlLGFBQWEsQ0FBQzs7QUFDN0IsY0FBYyxjQUFjLENBQUM7O0FBRTdCLHFEQUFxRCxvQkFBb0IsRUFBRSxjQUFjLEVBQUUsZ0JBQWdCLEVBQUUsVUFBVSxDQUFDOztBQUN4SCxtQkFBbUIsbUJBQW1CLENBQUM7O0FBQ3ZDLDJHQUEyRyxvQkFBb0IsRUFBRSxjQUFjLEVBQUUsZ0JBQWdCLEVBQUUsV0FBVyxDQUFDOztBQUMvSyxnQkFBZ0Isa0JBQWtCLENBQUM7O0FBQ25DLHVCQUF1QixjQUFjLEVBQUUsZ0JBQWdCLEVBQUUseUJBQXlCLENBQUM7O0FBQ25GLGNBQWMsY0FBYyxFQUFFLGdCQUFnQixDQUFDOztBQUUvQyxlQUFlLGtEQUFrRCxFQUFFLGNBQWMsQ0FBQzs7QUFDbEYsc0JBQXNCLGVBQWUsRUFBRSxnQkFBZ0IsRUFBRSxrREFBa0QsRUFBRSxjQUFjLENBQUM7O0FBQzVILHVCQUF1Qix3QkFBd0IsQ0FBQzs7QUFDaEQsb0RBQW9EOztBQUNwRCx1QkFBdUIsd0JBQXdCLENBQUM7O0FBRWhELG1CQUFtQixZQUFZOztBQUMvQixnQkFBZ0IsWUFBWTs7QUFFNUIsWUFBWSxzQkFBc0IsRUFBRSxZQUFZLEVBQUUsV0FBVyxDQUFDOztBQUU5RCw4SEFBOEg7O0FBQzlILGFBQWE7O0FBQ2IsY0FBYzs7QUFDZCxlQUFlOztBQUVmLGFBQWEsd0JBQXdCLEVBQUU7O0FBQ3ZDLG9CQUFvQix3QkFBd0IsRUFBRTs7QUFFOUM7SUFDSSxXQUFXO0lBQ1gsWUFBWTtJQUNaLFVBQVU7SUFDVixXQUFXO0lBQ1gsaUNBQWlDO0FBQ3JDOztBQUVBO0lBQ0ksWUFBWTtBQUNoQjs7QUFFQSx1RUFBdUU7O0FBQ3ZFO0VBQ0Usa0JBQWtCO0VBQ2xCLHFCQUFxQjtFQUNyQixXQUFXO0VBQ1gsWUFBWTtBQUNkOztBQUVBLHFCQUFxQixZQUFZLENBQUM7O0FBRWxDO0VBQ0Usa0JBQWtCO0VBQ2xCLGVBQWU7RUFDZixNQUFNO0VBQ04sT0FBTztFQUNQLFFBQVE7RUFDUixTQUFTO0VBQ1Qsc0JBQXNCO0VBRXRCLGVBQWU7QUFDakI7O0FBRUE7RUFDRSxrQkFBa0I7RUFDbEIsV0FBVztFQUNYLFlBQVk7RUFDWixXQUFXO0VBQ1gsU0FBUztFQUNULFdBQVc7RUFDWCx1QkFBdUI7RUFFdkIsZUFBZTtBQUNqQjs7QUFFQTtFQUNFLHlCQUF5QjtBQUMzQjs7QUFFQTtFQUNFLDJCQUEyQjtBQUM3Qjs7QUFFQTtFQUNFLG1DQUFtQztFQUVuQywyQkFBMkI7QUFDN0I7O0FBRUE7RUFDRSxtQkFBbUI7QUFDckI7O0FBRUE7RUFDRSxrQkFBa0I7QUFDcEI7O0FBRUE7dUJBQ3VCOztBQUN2QjtFQUNFLHFCQUFxQjtFQUNyQixZQUFZO0FBQ2Q7O0FBRUE7RUFDRSxpQkFBaUI7RUFDakIsYUFBYTtBQUNmOztBQUVBO0VBQ0UsdUNBQXVDO0VBQ3ZDLHlCQUF5QjtBQUMzQjs7QUFDQTtFQUNFLGtCQUFrQjtFQUNsQix5QkFBeUI7QUFDM0I7O0FBRUEsZ0JBQWdCLFdBQVcsRUFBRSxjQUFjLEVBQUUsZ0JBQWdCLENBQUM7O0FBQzlELHFCQUFxQixZQUFZLEVBQUUsY0FBYyxFQUFFLGdCQUFnQixDQUFDOztBQUVwRSxnSkFBZ0o7O0FBQ2hKLGNBQWMsNEhBQTRILENBQUM7O0FBQzNJLGVBQWUsaUNBQTBDLEVBQUUsd0JBQXdCLEVBQUUsNEJBQTRCLENBQUM7O0FBRWxILGVBQWUsNEhBQTRILENBQUM7O0FBQzVJLGdCQUFnQixpQ0FBMEMsRUFBRSx3QkFBd0IsRUFBRSw0QkFBNEIsQ0FBQzs7QUFFbkgsY0FBYyxrQ0FBMkMsRUFBRSx3QkFBd0IsRUFBRSw0QkFBNEIsQ0FBQzs7QUFDbEgsZUFBZSxtQ0FBNEMsRUFBRSx3QkFBd0IsRUFBRSw0QkFBNEIsQ0FBQzs7QUFFcEgsYUFBYSw0SEFBNEgsQ0FBQzs7QUFDMUksY0FBYyw0SEFBNEgsQ0FBQzs7QUFFM0ksb0JBQW9CLGNBQWMsQ0FBQzs7QUFFbkMsb0JBQW9CLGNBQWMsQ0FBQzs7QUFDbkMscUJBQXFCLGNBQWMsQ0FBQzs7QUFFcEMsa0JBQWtCLGNBQWMsQ0FBQzs7QUFDakMsMkRBQTJEOztBQUUzRCxhQUFhLHFCQUFxQixDQUFDOztBQUVuQyxxQ0FBcUM7O0FBQ2pDLDZGQUE2Rjs7QUFDakc7SUFDSSxzQkFBc0I7SUFDdEIsZ0JBQWdCO0lBQ2hCLFdBQVc7QUFDZjs7QUFFQSxvQkFBb0IsZUFBZTtFQUNqQyxrQkFBa0IsRUFBRSw4QkFBOEI7RUFDbEQsa0JBQWtCLEVBQUUsb0NBQW9DO0FBQzFEOztBQUNBLCtCQUErQixpQkFBaUI7RUFDOUMsY0FBYztFQUNkLDhCQUE4QjtBQUNoQzs7QUFDQSx1Q0FBdUMsaUNBQWlDO0VBQ3RFLHVCQUF1QjtFQUN2QixpQ0FBaUM7QUFDbkM7O0FBRUE7SUFDSSxpQkFBaUI7QUFDckI7O0FBRUE7SUFDSSxpQkFBaUI7QUFDckI7O0FBRUEsY0FBYyxZQUFZLEVBQUUsaUJBQWlCLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxZQUFZLEVBQUUsd0JBQXdCLEVBQUUsaUJBQWlCLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxXQUFXLENBQUM7O0FBRTFLOzs7Ozs7RUFRRSxxQkFBcUI7QUFDdkI7O0FBQ0E7RUFDRSxpQkFBaUI7RUFDakIsS0FBSztFQUNMLE1BQU07RUFDTixZQUFZO0VBQ1osV0FBVztBQUNiOztBQUNBO0VBQ0UscUJBQXFCO0VBR3JCLHNDQUFzQztBQUN4Qzs7QUFDQTs7K0JBRStCLG9CQUFvQjs7QUFDbkQ7RUFDRSxXQUFXO0VBQ1gsYUFBYTtFQUNiLFVBQVU7QUFDWjs7QUFDQSxpQkFBaUIsWUFBWTs7QUFDN0I7RUFDRSxpQkFBaUI7RUFDakIsVUFBVTtFQUNWLFlBQVk7RUFDWixXQUFXO0VBQ1gscUJBQXFCO0VBQ3JCLHlCQUF5QjtFQUN6QixnQkFBZ0I7RUFHaEIsdUdBQXVHO0VBR3ZHLHlCQUF5QjtFQUN6QixlQUFlO0FBQ2pCOztBQUNBO0VBQ0UsaUJBQWlCO0VBQ2pCLFFBQVE7RUFDUixPQUFPO0VBQ1AsTUFBTTtFQUNOLFNBQVM7RUFDVCxhQUFhO0VBQ2IsVUFBVTtBQUNaOztBQUNBO0VBQ0UsVUFBVTtFQUNWLGlCQUFpQjtFQUNqQixLQUFLO0VBQ0wsT0FBTztFQUNQLFFBQVE7RUFDUixNQUFNO0VBQ04sYUFBYTtFQUNiLGdCQUFnQjtFQUNoQixvQkFBb0I7RUFDcEIsNEJBQTRCO0VBQzVCLCtCQUErQjtBQUNqQzs7QUFDQTtFQUNFLGlCQUFpQjtFQUNqQixXQUFXO0VBQ1gsWUFBWTtFQUNaLFVBQVU7RUFHViw4R0FBOEc7RUFHOUcseUJBQXlCO0VBQ3pCLGdCQUFnQjtBQUNsQjs7QUFDQTtFQUNFLGlCQUFpQjtFQUNqQixRQUFRO0VBQ1IsVUFBVTtFQUNWLFNBQVM7RUFDVCxhQUFhO0VBQ2IsU0FBUztFQUNULFVBQVU7QUFDWjs7QUFDQTs7RUFFRSxVQUFVO0VBQ1YsaUJBQWlCO0VBQ2pCLEtBQUs7RUFDTCxPQUFPO0VBQ1AsUUFBUTtFQUNSLE1BQU07RUFDTixhQUFhO0VBQ2IsZ0JBQWdCO0VBQ2hCLG9CQUFvQjtFQUdwQixrQkFBa0I7QUFDcEI7O0FBQ0E7RUFDRSxRQUFRO0VBQ1IsVUFBVTtFQUNWLFdBQVc7RUFDWCxTQUFTO0VBQ1QsaUJBQWlCO0FBQ25COztBQUNBOztFQUVFLDBCQUEwQjtFQUMxQix3QkFBd0I7RUFDeEIscUJBQXFCO0VBQ3JCLG9CQUFvQjtFQUNwQixnQkFBZ0I7RUFDaEIseUNBQXlDO0VBQ3pDLHVDQUF1QztBQUN6QyIsImZpbGUiOiJzcmMvYXNzZXRzL2ljbjNkL2ljbjNkX2Z1bGxfdWkuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmljbjNkLXRleHQge2ZvbnQtZmFtaWx5OiBWZXJkYW5hLCBBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmOyBmb250LXNpemU6MTJweCFpbXBvcnRhbnQ7fVxuXG4udWktZGlhbG9nIHsgZm9udC1zaXplOiAxMnB4O31cbi51aS1kaWFsb2cgLnVpLWRpYWxvZy10aXRsZSB7IGZvbnQtc2l6ZTogMTZweDsgaGVpZ2h0OiAxOHB4OyB9XG4udWktZGlhbG9nIC51aS1idXR0b24geyB3aWR0aDogMTJweDsgaGVpZ2h0OjEycHg7IG1hcmdpbjogLTVweCAwcHggMHB4IDBweDt9XG4udWktZGlhbG9nIC51aS1kaWFsb2ctdGl0bGViYXIgeyBwYWRkaW5nOiAwcHggMWVtIDJweCAxZW07IH1cblxuLnVpLWFjY29yZGlvbiAudWktYWNjb3JkaW9uLWljb25zIHsgcGFkZGluZy1sZWZ0OiAwOyB0ZXh0LWFsaWduOiBjZW50ZXI7IH1cblxuLmljbjNkLW1lbnUge2Zsb2F0OmxlZnQ7IHdpZHRoOjExMHB4O31cbmFjY29yZGlvbiB7Zm9udC1zaXplOiAxNHB4IWltcG9ydGFudDsgei1pbmRleDoxOTk5OyB9XG5hY2NvcmRpb24gaDMge3dpZHRoOiAxMDBweDsgZm9udC1zaXplOiAxNHB4IWltcG9ydGFudDt9XG5hY2NvcmRpb24gaDMgPiAudWktaWNvbiB7IGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDsgfVxuLy9hY2NvcmRpb24gdWwge3dpZHRoOiAxMTBweH1cbmFjY29yZGlvbiB1bCB1bCAge3dpZHRoOiAxNjBweH1cbmFjY29yZGlvbiB1bCBsaSB7Y3Vyc29yOmRlZmF1bHQhaW1wb3J0YW50OyB3aGl0ZS1zcGFjZTpub3dyYXA7fVxuLyphY2NvcmRpb24gdWwgLmljbjNkLWxpbmssIGRpdiAuaWNuM2QtbGluaywgYWNjb3JkaW9uIGxpIGlucHV0LCBhY2NvcmRpb24gbGkgbGFiZWwsIGJ1dHRvbiB7Y3Vyc29yOnBvaW50ZXIhaW1wb3J0YW50OyB9ICovXG4uaWNuM2QtbGluaywgYWNjb3JkaW9uIGxpIGlucHV0LCBhY2NvcmRpb24gbGkgbGFiZWwsIGJ1dHRvbiB7Y3Vyc29yOnBvaW50ZXIhaW1wb3J0YW50OyB9IFxuLmljbjNkLWJsdWUge2NvbG9yOmJsdWUhaW1wb3J0YW50O31cblxuLyouaWNuM2QtZGxfc2VxdWVuY2Uge2JhY2tncm91bmQ6IHdoaXRlOyBwYWRkaW5nLWxlZnQ6MTBweDt9Ki9cbi5pY24zZC1kbF9zZXF1ZW5jZSB7YmFja2dyb3VuZDogd2hpdGU7fVxuLmljbjNkLWhpZ2hsaWdodFNlcSB7YmFja2dyb3VuZC1jb2xvcjogI0ZGRkYwMDt9XG4uaWNuM2QtaGlnaGxpZ2h0U2VxQm94IHtib3JkZXI6M3B4IHNvbGlkICNGRkE1MDA7fVxuXG4vKiB1c2VkIHRvIGlkZW50aWZ5IGEgcmVzaWR1ZSB3aGVuIGNsaWNraW5nIGEgcmVzaWR1ZSBpbiBzZXF1ZW5jZSovXG4uaWNuM2QtcmVzaWR1ZSB7Zm9udC13ZWlnaHQ6cmVndWxhcjt9IFxuLmljbjNkLXJlc2lkdWVOdW0ge2NvbG9yOiBncmVlbjsgd2lkdGg6NDBweCFpbXBvcnRhbnQ7IHRleHQtYWxpZ246Y2VudGVyOyB3aGl0ZS1zcGFjZTpub3dyYXA7fVxuXG4uaWNuM2QtZGxfc2VxdWVuY2Ugc3BhbiB7ZGlzcGxheTppbmxpbmUtYmxvY2s7IGZvbnQtc2l6ZToxMXB4OyB3aWR0aDoxMHB4OyB0ZXh0LWFsaWduOmNlbnRlcjt9XG4uaWNuM2QtZGxfMmRkZ20ge30gLy97bWluLXdpZHRoOiAxNTBweCFpbXBvcnRhbnQ7IG1pbi1oZWlnaHQ6IDE1MHB4IWltcG9ydGFudDt9XG4uaWNuM2QtY2hlbWljYWwge3dpZHRoOjMwcHghaW1wb3J0YW50O30gXG4gXG5idXR0b24sIHNlbGVjdCwgaW5wdXQgeyBmb250LXNpemU6IDEwcHg7IH1cblxuLmljbjNkLWhpZGRlbiB7ZGlzcGxheTogbm9uZTt9XG4uaWNuM2Qtc2hvd24ge2Rpc3BsYXk6IGJsb2NrO31cblxuLmljbjNkLXNlcVRpdGxlLCAuaWNuM2Qtc2VxVGl0bGUyLCAuaWNuM2QtYW5ub1RpdGxlIHtkaXNwbGF5OmlubGluZS1ibG9jazsgZm9udC1zaXplOjExcHg7IGZvbnQtd2VpZ2h0OmJvbGQ7IHdpZHRoOjYwcHg7fVxuLmljbjNkLWFubm90YXRpb24ge3doaXRlLXNwYWNlOiBub3dyYXA7fVxuLmljbjNkLWFubm90YXRpb24gLmljbjNkLXNlcVRpdGxlLCAuaWNuM2QtYW5ub3RhdGlvbiAuaWNuM2Qtc2VxVGl0bGUyLCAuaWNuM2QtYW5ub3RhdGlvbiAuaWNuM2QtYW5ub1RpdGxlIHtkaXNwbGF5OmlubGluZS1ibG9jazsgZm9udC1zaXplOjExcHg7IGZvbnQtd2VpZ2h0OmJvbGQ7IHdpZHRoOjEyMHB4O31cbi5pY24zZC1zZXFMaW5lIHt3aGl0ZS1zcGFjZTpub3dyYXA7fVxuLmljbjNkLWFubm9MYXJnZVRpdGxlIHtmb250LXNpemU6MTRweDsgZm9udC13ZWlnaHQ6Ym9sZDsgYmFja2dyb3VuZC1jb2xvcjogI0RERERERDt9XG4uaWNuM2QtbGFyZ2Uge2ZvbnQtc2l6ZToxNHB4OyBmb250LXdlaWdodDpib2xkO31cblxuLmljbjNkLWRpYWxvZyB7Zm9udC1mYW1pbHk6IFZlcmRhbmEsIEFyaWFsLCBIZWx2ZXRpY2EsIHNhbnMtc2VyaWY7IGNvbG9yOiAjNjY2NjY2O31cbi5pY24zZC1jb21tYW5kVGl0bGUgIHtmb250LXNpemU6IDEycHg7IGZvbnQtd2VpZ2h0OmJvbGQ7IGZvbnQtZmFtaWx5OiBWZXJkYW5hLCBBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmOyBjb2xvcjogIzY2NjY2Njt9XG4uaWNuM2QtbW9kZXNlbGVjdGlvbiAge2NvbG9yOiAjZjhiODRlIWltcG9ydGFudDt9XG4vKi5pY24zZC12aWV3c2VsZWN0aW9uICB7Y29sb3I6ICM4MDAwMDAhaW1wb3J0YW50O30qL1xuLmljbjNkLXZpZXdzZWxlY3Rpb24gIHtjb2xvcjogI2Y4Yjg0ZSFpbXBvcnRhbnQ7fVxuXG4uaWNuM2QtbWlkZGxlSWNvbiB7b3BhY2l0eTogMS4wfVxuLmljbjNkLWVuZEljb24ge29wYWNpdHk6IDAuMn1cblxuLmljbjNkLWJveCB7Ym9yZGVyOiBzb2xpZCAxcHggI2NjYzsgcGFkZGluZzogNXB4OyBtYXJnaW46IDVweDt9XG5cbi8qIHNlcXVlbmNlIGFsaWduZW50LCAnY29ucycgbWVhbnMgYWxpZ25lZCBhbmQgY29uc2VydmVkLCAnbmNvbnMnIG1lYW5zIGFsaWduZWQgYW5kIG5vdCBjb25zZXJ2ZWQsICduYWxpZ24nIG1lYW5zIG5vdCBhbGlnbmVkKi9cbi5pY24zZC1jb25zIHt9XG4uaWNuM2QtbmNvbnMge31cbi5pY24zZC1uYWxpZ24ge30gXG5cbi5pY24zZC1ub2RlIHtjdXJzb3I6cG9pbnRlciFpbXBvcnRhbnQ7IH0gXG4uaWNuM2QtaW50ZXJhY3Rpb24ge2N1cnNvcjpwb2ludGVyIWltcG9ydGFudDsgfSBcblxuLnVpLWRpYWxvZyAudWktcmVzaXphYmxlLXNlIHtcbiAgICB3aWR0aDogMTRweDtcbiAgICBoZWlnaHQ6IDE0cHg7XG4gICAgcmlnaHQ6IDNweDtcbiAgICBib3R0b206IDNweDtcbiAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAtODBweCAtMjI0cHg7XG59XG5cbi51aS1tZW51LWljb24ge1xuICAgIGZsb2F0OiByaWdodDtcbn1cblxuLyogdG9nZ2xlIGJ1dHRvbjogaHR0cDovL3d3dy53M3NjaG9vbHMuY29tL2hvd3RvL2hvd3RvX2Nzc19zd2l0Y2guYXNwICovXG4uaWNuM2Qtc3dpdGNoIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIHdpZHRoOiAzM3B4O1xuICBoZWlnaHQ6IDE4cHg7XG59XG5cbi5pY24zZC1zd2l0Y2ggaW5wdXQge2Rpc3BsYXk6bm9uZTt9XG5cbi5pY24zZC1zbGlkZXIge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgdG9wOiAwO1xuICBsZWZ0OiAwO1xuICByaWdodDogMDtcbiAgYm90dG9tOiAwO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2NjO1xuICAtd2Via2l0LXRyYW5zaXRpb246IC40cztcbiAgdHJhbnNpdGlvbjogLjRzO1xufVxuXG4uaWNuM2Qtc2xpZGVyOmJlZm9yZSB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgY29udGVudDogXCJcIjtcbiAgaGVpZ2h0OiAxM3B4O1xuICB3aWR0aDogMTNweDtcbiAgbGVmdDogNHB4O1xuICBib3R0b206IDNweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XG4gIC13ZWJraXQtdHJhbnNpdGlvbjogLjRzO1xuICB0cmFuc2l0aW9uOiAuNHM7XG59XG5cbmlucHV0OmNoZWNrZWQgKyAuaWNuM2Qtc2xpZGVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y4Yjg0ZTtcbn1cblxuaW5wdXQ6Zm9jdXMgKyAuaWNuM2Qtc2xpZGVyIHtcbiAgYm94LXNoYWRvdzogMCAwIDFweCAjZjhiODRlO1xufVxuXG5pbnB1dDpjaGVja2VkICsgLmljbjNkLXNsaWRlcjpiZWZvcmUge1xuICAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlWCgxM3B4KTtcbiAgLW1zLXRyYW5zZm9ybTogdHJhbnNsYXRlWCgxM3B4KTtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDEzcHgpO1xufVxuXG4uaWNuM2Qtc2xpZGVyLmljbjNkLXJvdW5kIHtcbiAgYm9yZGVyLXJhZGl1czogMThweDtcbn1cblxuLmljbjNkLXNsaWRlci5pY24zZC1yb3VuZDpiZWZvcmUge1xuICBib3JkZXItcmFkaXVzOiA1MCU7XG59XG5cbi8qIGpxdWVyeSBVSSAxLjEyLjFcbiAgIGZvciBqcXVlcnkgdG9vbHRpcCAqL1xuLmljbjNkLXRvb2x0aXAge1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIHdpZHRoOiAyMDBweDtcbn1cblxuLnNucHRpcCB7XG4gIG1heC1oZWlnaHQ6IDE1MHB4O1xuICBvdmVyZmxvdzphdXRvO1xufVxuXG4udWktd2lkZ2V0IHtcbiAgZm9udC1mYW1pbHk6IEFyaWFsLEhlbHZldGljYSxzYW5zLXNlcmlmO1xuICBmb250LXNpemU6IDEycHghaW1wb3J0YW50O1xufVxuLnVpLW1lbnUtaXRlbSB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgcGFkZGluZzogM3B4IDFlbSAzcHggLjRlbTtcbn1cblxuLmljbjNkLWNsaW52YXIge2NvbG9yOmdyZWVuOyBmb250LXNpemU6MTJweDsgZm9udC13ZWlnaHQ6Ym9sZDt9XG4uaWNuM2QtY2xpbnZhci1wYXRoIHtjb2xvcjpwdXJwbGU7IGZvbnQtc2l6ZToxMnB4OyBmb250LXdlaWdodDpib2xkO31cblxuLyouaWNuM2Qtc2hlZXQge2JhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCh0cmFuc3BhcmVudCwgdHJhbnNwYXJlbnQgMjUlLCAjRkZDODAwIDI1JSwgI0ZGQzgwMCA3NSUsIHRyYW5zcGFyZW50IDc1JSwgdHJhbnNwYXJlbnQgMTAwJSk7fSAqL1xuLmljbjNkLXNoZWV0IHtiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQodHJhbnNwYXJlbnQsIHRyYW5zcGFyZW50IDI1JSwgIzAwODAwMCAyNSUsICMwMDgwMDAgNzUlLCB0cmFuc3BhcmVudCA3NSUsIHRyYW5zcGFyZW50IDEwMCUpO30gXG4uaWNuM2Qtc2hlZXQyIHtiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJzc2ltYWdlcy90cmlnLnBuZ1wiKTsgYmFja2dyb3VuZC1zaXplOiBjb250YWluOyBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O31cblxuLmljbjNkLXNoZWV0eSB7YmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KHRyYW5zcGFyZW50LCB0cmFuc3BhcmVudCAyNSUsICNGRkM4MDAgMjUlLCAjRkZDODAwIDc1JSwgdHJhbnNwYXJlbnQgNzUlLCB0cmFuc3BhcmVudCAxMDAlKTt9IFxuLmljbjNkLXNoZWV0Mnkge2JhY2tncm91bmQtaW1hZ2U6IHVybChcInNzaW1hZ2VzL3RyaXkucG5nXCIpOyBiYWNrZ3JvdW5kLXNpemU6IGNvbnRhaW47IGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7fVxuXG4uaWNuM2QtaGVsaXgge2JhY2tncm91bmQtaW1hZ2U6IHVybChcInNzaW1hZ2VzL2hlbGl4LnBuZ1wiKTsgYmFja2dyb3VuZC1zaXplOiBjb250YWluOyBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O31cbi5pY24zZC1oZWxpeDIge2JhY2tncm91bmQtaW1hZ2U6IHVybChcInNzaW1hZ2VzL2hlbGl4Mi5wbmdcIik7IGJhY2tncm91bmQtc2l6ZTogY29udGFpbjsgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDt9XG5cbi5pY24zZC1jb2lsIHtiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQodHJhbnNwYXJlbnQsIHRyYW5zcGFyZW50IDQ1JSwgIzYwODBGRiA0NSUsICM2MDgwRkYgNTUlLCB0cmFuc3BhcmVudCA1NSUsIHRyYW5zcGFyZW50IDEwMCUpO30gXG4uaWNuM2Qtb3RoZXIge2JhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCh0cmFuc3BhcmVudCwgdHJhbnNwYXJlbnQgNDUlLCAjREREREREIDQ1JSwgI0RERERERCA1NSUsIHRyYW5zcGFyZW50IDU1JSwgdHJhbnNwYXJlbnQgMTAwJSk7fSBcblxuLmljbjNkLWhlbGl4LWNvbG9yIHtjb2xvcjogI0ZGMDA4MDt9XG5cbi5pY24zZC1zaGVldC1jb2xvciB7Y29sb3I6ICMwMDgwMDA7fVxuLmljbjNkLXNoZWV0LWNvbG9yeSB7Y29sb3I6ICNGRkM4MDA7fVxuXG4uaWNuM2QtZml4ZWQtcG9zIHtwb3NpdGlvbjpmaXhlZDt9XG4vKi5pY24zZC1zcGFjZS10aXRsZSB7d2lkdGg6MTYwcHg7IGRpc3BsYXk6aW5saW5lLWJsb2NrO30gKi9cblxuLmljbjNkLWJrZ2Qge2JhY2tncm91bmQtY29sb3I6I2VlZTt9XG5cbi8qIHJlbW92ZSB0aGUgZXh0cmEgYmFyIGluIHRoZSBtZW51ICovXG4gICAgLyogYmFja2dyb3VuZDogI2VlZSB1cmwoaW1hZ2VzL3VpLWJnX2hpZ2hsaWdodC1zb2Z0XzEwMF9lZWVlZWVfMXgxMDAucG5nKSA1MCUgdG9wIHJlcGVhdC14OyAqL1xuLnVpLXdpZGdldC1jb250ZW50IHtcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjZGRkO1xuICAgIGJhY2tncm91bmQ6ICNlZWU7XG4gICAgY29sb3I6ICMzMzM7XG59XG5cbi5pY24zZC1yYWQgPiBpbnB1dHsgLyogSElERSBSQURJTyAqL1xuICB2aXNpYmlsaXR5OiBoaWRkZW47IC8qIE1ha2VzIGlucHV0IG5vdC1jbGlja2FibGUgKi9cbiAgcG9zaXRpb246IGFic29sdXRlOyAvKiBSZW1vdmUgaW5wdXQgZnJvbSBkb2N1bWVudCBmbG93ICovXG59XG4uaWNuM2QtcmFkID4gaW5wdXQgKyAudWktaWNvbnsgLyogSU1BR0UgU1RZTEVTICovXG4gIGN1cnNvcjpwb2ludGVyO1xuICAvL2JvcmRlcjoycHggc29saWQgdHJhbnNwYXJlbnQ7XG59XG4uaWNuM2QtcmFkID4gaW5wdXQ6Y2hlY2tlZCArIC51aS1pY29ueyAvKiAoUkFESU8gQ0hFQ0tFRCkgSU1BR0UgU1RZTEVTICovXG4gIC8vYm9yZGVyOjJweCBzb2xpZCAjZjAwO1xuICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAtNjRweCAtMTQ0cHg7IFxufVxuXG4udWktbWVudS1pY29ucyAudWktbWVudS1pdGVtLXdyYXBwZXIge1xuICAgIHBhZGRpbmctbGVmdDogMGVtO1xufVxuXG4uaWNuM2QtcmFkLXRleHQge1xuICAgIHBhZGRpbmctbGVmdDogMmVtO1xufVxuXG4uaWNuM2QtcG9wdXAge2Rpc3BsYXk6bm9uZTsgcG9zaXRpb246YWJzb2x1dGU7IHotaW5kZXg6OTk5OTsgdG9wOi0xMDAwcHg7IGxlZnQ6LTEwMDBweDsgYmFja2dyb3VuZC1jb2xvcjojREREREREOyB0ZXh0LWFsaWduOmNlbnRlcjsgd2lkdGg6ODBweDsgaGVpZ2h0OjE4cHg7IHBhZGRpbmc6M3B4O31cblxuLmNvbG9yLXBpY2tlcixcbi5jb2xvci1waWNrZXI6YmVmb3JlLFxuLmNvbG9yLXBpY2tlcjphZnRlcixcbi5jb2xvci1waWNrZXIgKixcbi5jb2xvci1waWNrZXIgKjpiZWZvcmUsXG4uY29sb3ItcGlja2VyICo6YWZ0ZXIge1xuICAtd2Via2l0LWJveC1zaXppbmc6Ym9yZGVyLWJveDtcbiAgLW1vei1ib3gtc2l6aW5nOmJvcmRlci1ib3g7XG4gIGJveC1zaXppbmc6Ym9yZGVyLWJveDtcbn1cbi5jb2xvci1waWNrZXIge1xuICBwb3NpdGlvbjphYnNvbHV0ZTtcbiAgdG9wOjA7XG4gIGxlZnQ6MDtcbiAgei1pbmRleDo5OTk5O1xuICB3aWR0aDoxNzJweDtcbn1cbi5jb2xvci1waWNrZXItY29udHJvbCB7XG4gIGJvcmRlcjoxcHggc29saWQgIzAwMDtcbiAgLXdlYmtpdC1ib3gtc2hhZG93OjFweCA1cHggMTBweCByZ2JhKDAsMCwwLC41KTtcbiAgLW1vei1ib3gtc2hhZG93OjFweCA1cHggMTBweCByZ2JhKDAsMCwwLC41KTtcbiAgYm94LXNoYWRvdzoxcHggNXB4IDEwcHggcmdiYSgwLDAsMCwuNSk7XG59XG4uY29sb3ItcGlja2VyLWNvbnRyb2wgKixcbi5jb2xvci1waWNrZXItY29udHJvbCAqOmJlZm9yZSxcbi5jb2xvci1waWNrZXItY29udHJvbCAqOmFmdGVyIHtib3JkZXItY29sb3I6aW5oZXJpdH1cbi5jb2xvci1waWNrZXItY29udHJvbDphZnRlciB7XG4gIGNvbnRlbnQ6XCIgXCI7XG4gIGRpc3BsYXk6dGFibGU7XG4gIGNsZWFyOmJvdGg7XG59XG4uY29sb3ItcGlja2VyIGkge2ZvbnQ6aW5oZXJpdH1cbi5jb2xvci1waWNrZXItaCB7XG4gIHBvc2l0aW9uOnJlbGF0aXZlO1xuICB3aWR0aDoyMHB4O1xuICBoZWlnaHQ6MTUwcHg7XG4gIGZsb2F0OnJpZ2h0O1xuICBib3JkZXItbGVmdDoxcHggc29saWQ7XG4gIGJvcmRlci1sZWZ0LWNvbG9yOmluaGVyaXQ7XG4gIGN1cnNvcjpucy1yZXNpemU7XG4gIGJhY2tncm91bmQtaW1hZ2U6LXdlYmtpdC1saW5lYXItZ3JhZGllbnQodG8gdG9wLCNmMDAgMCUsI2ZmMCAxNyUsIzBmMCAzMyUsIzBmZiA1MCUsIzAwZiA2NyUsI2YwZiA4MyUsI2YwMCAxMDAlKTtcbiAgYmFja2dyb3VuZC1pbWFnZTotbW96LWxpbmVhci1ncmFkaWVudCh0byB0b3AsI2YwMCAwJSwjZmYwIDE3JSwjMGYwIDMzJSwjMGZmIDUwJSwjMDBmIDY3JSwjZjBmIDgzJSwjZjAwIDEwMCUpO1xuICBiYWNrZ3JvdW5kLWltYWdlOmxpbmVhci1ncmFkaWVudCh0byB0b3AsI2YwMCAwJSwjZmYwIDE3JSwjMGYwIDMzJSwjMGZmIDUwJSwjMDBmIDY3JSwjZjBmIDgzJSwjZjAwIDEwMCUpO1xuICAtd2Via2l0LWJhY2tncm91bmQtc2l6ZToxMDAlIDEwMCU7XG4gIC1tb3otYmFja2dyb3VuZC1zaXplOjEwMCUgMTAwJTtcbiAgYmFja2dyb3VuZC1zaXplOjEwMCUgMTAwJTtcbiAgb3ZlcmZsb3c6aGlkZGVuO1xufVxuLmNvbG9yLXBpY2tlci1oIGkge1xuICBwb3NpdGlvbjphYnNvbHV0ZTtcbiAgdG9wOi0zcHg7XG4gIHJpZ2h0OjA7XG4gIGxlZnQ6MDtcbiAgei1pbmRleDozO1xuICBkaXNwbGF5OmJsb2NrO1xuICBoZWlnaHQ6NnB4O1xufVxuLmNvbG9yLXBpY2tlci1oIGk6YmVmb3JlIHtcbiAgY29udGVudDpcIlwiO1xuICBwb3NpdGlvbjphYnNvbHV0ZTtcbiAgdG9wOjA7XG4gIHJpZ2h0OjA7XG4gIGJvdHRvbTowO1xuICBsZWZ0OjA7XG4gIGRpc3BsYXk6YmxvY2s7XG4gIGJvcmRlcjozcHggc29saWQ7XG4gIGJvcmRlci1jb2xvcjppbmhlcml0O1xuICBib3JkZXItdG9wLWNvbG9yOnRyYW5zcGFyZW50O1xuICBib3JkZXItYm90dG9tLWNvbG9yOnRyYW5zcGFyZW50O1xufVxuLmNvbG9yLXBpY2tlci1zdiB7XG4gIHBvc2l0aW9uOnJlbGF0aXZlO1xuICB3aWR0aDoxNTBweDtcbiAgaGVpZ2h0OjE1MHB4O1xuICBmbG9hdDpsZWZ0O1xuICBiYWNrZ3JvdW5kLWltYWdlOi13ZWJraXQtbGluZWFyLWdyYWRpZW50KHRvIHRvcCwjMDAwLHJnYmEoMCwwLDAsMCkpLGxpbmVhci1ncmFkaWVudCh0byByaWdodCwjZmZmLHJnYmEoMjU1LDI1NSwyNTUsMCkpO1xuICBiYWNrZ3JvdW5kLWltYWdlOi1tb3otbGluZWFyLWdyYWRpZW50KHRvIHRvcCwjMDAwLHJnYmEoMCwwLDAsMCkpLGxpbmVhci1ncmFkaWVudCh0byByaWdodCwjZmZmLHJnYmEoMjU1LDI1NSwyNTUsMCkpO1xuICBiYWNrZ3JvdW5kLWltYWdlOmxpbmVhci1ncmFkaWVudCh0byB0b3AsIzAwMCxyZ2JhKDAsMCwwLDApKSxsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQsI2ZmZixyZ2JhKDI1NSwyNTUsMjU1LDApKTtcbiAgLXdlYmtpdC1iYWNrZ3JvdW5kLXNpemU6MTAwJSAxMDAlO1xuICAtbW96LWJhY2tncm91bmQtc2l6ZToxMDAlIDEwMCU7XG4gIGJhY2tncm91bmQtc2l6ZToxMDAlIDEwMCU7XG4gIGN1cnNvcjpjcm9zc2hhaXI7XG59XG4uY29sb3ItcGlja2VyLXN2IGkge1xuICBwb3NpdGlvbjphYnNvbHV0ZTtcbiAgdG9wOi00cHg7XG4gIHJpZ2h0Oi00cHg7XG4gIHotaW5kZXg6MztcbiAgZGlzcGxheTpibG9jaztcbiAgd2lkdGg6OHB4O1xuICBoZWlnaHQ6OHB4O1xufVxuLmNvbG9yLXBpY2tlci1zdiBpOmJlZm9yZSxcbi5jb2xvci1waWNrZXItc3YgaTphZnRlciB7XG4gIGNvbnRlbnQ6XCJcIjtcbiAgcG9zaXRpb246YWJzb2x1dGU7XG4gIHRvcDowO1xuICByaWdodDowO1xuICBib3R0b206MDtcbiAgbGVmdDowO1xuICBkaXNwbGF5OmJsb2NrO1xuICBib3JkZXI6MXB4IHNvbGlkO1xuICBib3JkZXItY29sb3I6aW5oZXJpdDtcbiAgLXdlYmtpdC1ib3JkZXItcmFkaXVzOjEwMCU7XG4gIC1tb3otYm9yZGVyLXJhZGl1czoxMDAlO1xuICBib3JkZXItcmFkaXVzOjEwMCU7XG59XG4uY29sb3ItcGlja2VyLXN2IGk6YmVmb3JlIHtcbiAgdG9wOi0xcHg7XG4gIHJpZ2h0Oi0xcHg7XG4gIGJvdHRvbTotMXB4O1xuICBsZWZ0Oi0xcHg7XG4gIGJvcmRlci1jb2xvcjojZmZmO1xufVxuLmNvbG9yLXBpY2tlci1oLFxuLmNvbG9yLXBpY2tlci1zdiB7XG4gIC13ZWJraXQtdG91Y2gtY2FsbG91dDpub25lO1xuICAtd2Via2l0LXVzZXItc2VsZWN0Om5vbmU7XG4gIC1tb3otdXNlci1zZWxlY3Q6bm9uZTtcbiAgLW1zLXVzZXItc2VsZWN0Om5vbmU7XG4gIHVzZXItc2VsZWN0Om5vbmU7XG4gIC13ZWJraXQtdGFwLWhpZ2hsaWdodC1jb2xvcjpyZ2JhKDAsMCwwLDApO1xuICAtd2Via2l0LXRhcC1oaWdobGlnaHQtY29sb3I6dHJhbnNwYXJlbnQ7XG59XG4iXX0= */", '', '']]

/***/ }),

/***/ "./node_modules/@angular-devkit/build-angular/src/angular-cli-files/plugins/raw-css-loader.js!./node_modules/postcss-loader/src/index.js?!./src/styles.css":
/*!*****************************************************************************************************************************************************************!*\
  !*** ./node_modules/@angular-devkit/build-angular/src/angular-cli-files/plugins/raw-css-loader.js!./node_modules/postcss-loader/src??embedded!./src/styles.css ***!
  \*****************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = [[module.i, "li a{\n    width: 300px;\n    height: auto;\n}\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zdHlsZXMuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksWUFBWTtJQUNaLFlBQVk7QUFDaEIiLCJmaWxlIjoic3JjL3N0eWxlcy5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyJsaSBhe1xuICAgIHdpZHRoOiAzMDBweDtcbiAgICBoZWlnaHQ6IGF1dG87XG59XG4iXX0= */", '', '']]

/***/ }),

/***/ "./node_modules/style-loader/lib/addStyles.js":
/*!****************************************************!*\
  !*** ./node_modules/style-loader/lib/addStyles.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target, parent) {
  if (parent){
    return parent.querySelector(target);
  }
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target, parent) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target, parent);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(/*! ./urls */ "./node_modules/style-loader/lib/urls.js");

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertAt.before, target);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}

	if(options.attrs.nonce === undefined) {
		var nonce = getNonce();
		if (nonce) {
			options.attrs.nonce = nonce;
		}
	}

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function getNonce() {
	if (false) {}

	return __webpack_require__.nc;
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = typeof options.transform === 'function'
		 ? options.transform(obj.css) 
		 : options.transform.default(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ "./node_modules/style-loader/lib/urls.js":
/*!***********************************************!*\
  !*** ./node_modules/style-loader/lib/urls.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),

/***/ "./src/assets/icn3d/icn3d_full_ui.css":
/*!********************************************!*\
  !*** ./src/assets/icn3d/icn3d_full_ui.css ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../node_modules/@angular-devkit/build-angular/src/angular-cli-files/plugins/raw-css-loader.js!../../../node_modules/postcss-loader/src??embedded!./icn3d_full_ui.css */ "./node_modules/@angular-devkit/build-angular/src/angular-cli-files/plugins/raw-css-loader.js!./node_modules/postcss-loader/src/index.js?!./src/assets/icn3d/icn3d_full_ui.css");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./src/styles.css":
/*!************************!*\
  !*** ./src/styles.css ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../node_modules/@angular-devkit/build-angular/src/angular-cli-files/plugins/raw-css-loader.js!../node_modules/postcss-loader/src??embedded!./styles.css */ "./node_modules/@angular-devkit/build-angular/src/angular-cli-files/plugins/raw-css-loader.js!./node_modules/postcss-loader/src/index.js?!./src/styles.css");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ 3:
/*!*******************************************************************!*\
  !*** multi ./src/styles.css ./src/assets/icn3d/icn3d_full_ui.css ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! /home/labio/Área de Trabalho/WalkingMol/ngCli/src/styles.css */"./src/styles.css");
module.exports = __webpack_require__(/*! /home/labio/Área de Trabalho/WalkingMol/ngCli/src/assets/icn3d/icn3d_full_ui.css */"./src/assets/icn3d/icn3d_full_ui.css");


/***/ })

},[[3,"runtime"]]]);
//# sourceMappingURL=styles.js.map