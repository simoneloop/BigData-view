import { Component, Inject, Injectable, Input, OnInit } from '@angular/core';
import {ThemePalette} from '@angular/material/core';



@Component({
  selector: 'app-checkboxs',
  templateUrl: './checkboxs.component.html',
  styleUrls: ['./checkboxs.component.css']
})
@Injectable()
export class CheckboxsComponent{

  @Input("name") name!:String;
  completed:boolean=false;
  @Input("color") color!:String;
  @Input("sublist") list?:String;
  allComplete=false;
  constructor() {

  }

  setAll(completed:boolean){
    this.allComplete=completed;
    if(this.list==null){
      return;
    }
    else{
      /* this.list.forEach(t=>(t.completed=completed)) */
    }
  }

};
