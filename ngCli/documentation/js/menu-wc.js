'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">ng-cl-i documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="dependencies.html" data-type="chapter-link">
                                <span class="icon ion-ios-list"></span>Dependencies
                            </a>
                        </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse" ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-96b1b41eec49cd3c9c9f3aad6551366a"' : 'data-target="#xs-components-links-module-AppModule-96b1b41eec49cd3c9c9f3aad6551366a"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-96b1b41eec49cd3c9c9f3aad6551366a"' :
                                            'id="xs-components-links-module-AppModule-96b1b41eec49cd3c9c9f3aad6551366a"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-96b1b41eec49cd3c9c9f3aad6551366a"' : 'data-target="#xs-injectables-links-module-AppModule-96b1b41eec49cd3c9c9f3aad6551366a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-96b1b41eec49cd3c9c9f3aad6551366a"' :
                                        'id="xs-injectables-links-module-AppModule-96b1b41eec49cd3c9c9f3aad6551366a"' }>
                                        <li class="link">
                                            <a href="injectables/DataService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>DataService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CoreModule.html" data-type="entity-link">CoreModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CoreModule-a68884ccc00b2a17600a813409b375df"' : 'data-target="#xs-injectables-links-module-CoreModule-a68884ccc00b2a17600a813409b375df"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CoreModule-a68884ccc00b2a17600a813409b375df"' :
                                        'id="xs-injectables-links-module-CoreModule-a68884ccc00b2a17600a813409b375df"' }>
                                        <li class="link">
                                            <a href="injectables/DataService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>DataService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/HttpService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>HttpService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/InteractorModule.html" data-type="entity-link">InteractorModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-InteractorModule-bf1ff98eb2ffc58292f396b0f40d936a"' : 'data-target="#xs-components-links-module-InteractorModule-bf1ff98eb2ffc58292f396b0f40d936a"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-InteractorModule-bf1ff98eb2ffc58292f396b0f40d936a"' :
                                            'id="xs-components-links-module-InteractorModule-bf1ff98eb2ffc58292f396b0f40d936a"' }>
                                            <li class="link">
                                                <a href="components/PreViewerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PreViewerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProteinViewerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProteinViewerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SummaryComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SummaryComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-InteractorModule-bf1ff98eb2ffc58292f396b0f40d936a"' : 'data-target="#xs-injectables-links-module-InteractorModule-bf1ff98eb2ffc58292f396b0f40d936a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-InteractorModule-bf1ff98eb2ffc58292f396b0f40d936a"' :
                                        'id="xs-injectables-links-module-InteractorModule-bf1ff98eb2ffc58292f396b0f40d936a"' }>
                                        <li class="link">
                                            <a href="injectables/TalkerService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>TalkerService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/MenuModule.html" data-type="entity-link">MenuModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-MenuModule-63dbaeb269bc46324fee529a77b4256b"' : 'data-target="#xs-components-links-module-MenuModule-63dbaeb269bc46324fee529a77b4256b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MenuModule-63dbaeb269bc46324fee529a77b4256b"' :
                                            'id="xs-components-links-module-MenuModule-63dbaeb269bc46324fee529a77b4256b"' }>
                                            <li class="link">
                                                <a href="components/FormComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FormComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ManualComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ManualComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MenuComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MenuComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TestesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TestesComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-MenuModule-63dbaeb269bc46324fee529a77b4256b"' : 'data-target="#xs-injectables-links-module-MenuModule-63dbaeb269bc46324fee529a77b4256b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-MenuModule-63dbaeb269bc46324fee529a77b4256b"' :
                                        'id="xs-injectables-links-module-MenuModule-63dbaeb269bc46324fee529a77b4256b"' }>
                                        <li class="link">
                                            <a href="injectables/HttpService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>HttpService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Points.html" data-type="entity-link">Points</a>
                            </li>
                            <li class="link">
                                <a href="classes/Protein.html" data-type="entity-link">Protein</a>
                            </li>
                            <li class="link">
                                <a href="classes/TestGraphic.html" data-type="entity-link">TestGraphic</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/ChartConfiguratorService.html" data-type="entity-link">ChartConfiguratorService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});