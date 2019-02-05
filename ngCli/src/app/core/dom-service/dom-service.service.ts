import {
  ComponentFactoryResolver,
  Injectable,
  Inject,
  ViewContainerRef
} from '@angular/core'
@Injectable({providedIn:'root'})
export class DomService {
  private factoryResolver : ComponentFactoryResolver;
  public rootViewContainer : ViewContainerRef;
  constructor(@Inject(ComponentFactoryResolver) factoryResolver) {
    this.factoryResolver = factoryResolver
  }
  removeAllChild(){
    this.rootViewContainer.clear();
  }
}