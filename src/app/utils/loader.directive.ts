import { Directive, Input, Type, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appLoader]'
})
export class LoaderDirective {

  @Input() appLoader!: any;

  constructor(
    private viewContainerRef:ViewContainerRef
  ) { }

  ngAfterViewInit():void{
    this.viewContainerRef.createComponent(this.appLoader);
  }
}
