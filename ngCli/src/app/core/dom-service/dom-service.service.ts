import {
  ComponentFactoryResolver,
  Injectable,
  Inject,
  ViewContainerRef
} from '@angular/core'
import {LabelComponent} from '../../shared/label/label.component'
import {Label} from '../../shared/label'
// import { SharedModule  } from '../../shared/shared.module';
@Injectable({providedIn:'root'})
export class DomService {
  private factoryResolver : ComponentFactoryResolver;
  public rootViewContainer : ViewContainerRef;
  constructor(@Inject(ComponentFactoryResolver) factoryResolver) {
    this.factoryResolver = factoryResolver
  }
  setRootViewContainerRef(viewContainerRef) {
    this.rootViewContainer = viewContainerRef
  }
  addDynamicComponent(componentRef) {
    const factory = this.factoryResolver.resolveComponentFactory(componentRef.constructor)
    const component = factory
      .create(this.rootViewContainer.parentInjector)
    if(component.instance instanceof LabelComponent){
      component.instance.initials = componentRef.getInitials()();
    }
    this.rootViewContainer.insert(component.hostView)
  }
  addArrayComponent(componentArray: Array<Label>){
    const factory = this.factoryResolver.resolveComponentFactory(LabelComponent)
  }
  removeAllChild(){
    this.rootViewContainer.clear();
  }
}