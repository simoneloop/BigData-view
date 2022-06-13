import { Component, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent implements OnChanges  {

  @Input("minDate") minDate!: Date;
  @Input ("maxDate") maxDate!: Date;
  startDate:any;
  endDate:any;

  @Output() newEvent=new EventEmitter();

  constructor() {
    /* const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear,6, 1);
    this.maxDate = new Date(currentYear,6, 10); */
   }

   ngOnChanges(changes: SimpleChanges) {
    console.log( this.minDate)
    console.log(changes)


    // changes.prop contains the old and the new value...
  }

  returnToParent(start:any,end:any){
    let startEnd=start+"%"+end;
    this.newEvent.emit(startEnd);
  }
  DateSelected:any;
  fetch(){
    console.log(this.startDate)
    console.log(this.endDate)
  }
}
