import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[a-host]',
})
export class AdDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}