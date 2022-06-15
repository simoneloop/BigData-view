import { SharedService } from './utils/shared.service';
import { CheckboxsComponent } from './Components/checkboxs/checkboxs.component';
import { Component } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {ThemePalette} from '@angular/material/core';
import { stringify } from 'querystring';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'spark-view';

  readonly ROOT_URL='http://localhost:8080';
  readonly FUNC1="/func1"
  readonly FUNC2="/func2"
  readonly FUNC3="/func3"
  readonly INIT="/init"

  colorMap:any={
    "nucleare":"green",
    "geotermico":"ground",
    "biomassa":"lightYellow",
    "carbone":"brown",
    "eolico":"lightBlue",
    "idroelettrico":"elettricBlue",
    "accumuloidro":"orangeDuracell",
    "batterieaccu":"orangeDuracell",
    "gas":"greenGray",
    "petrolio":"petrolGreen",
    "sconosciuto":"black"


  }


  stato_is_checked:boolean=true;
  sotto_stato_is_checked:boolean=false;


  initMap: any={}

  running:string="not running";
  timeSlots=[{select:true,name:'TUTTO IL GIORNO',class:"checkbox-title spaceBottom"},{select:true,name:'mattina'},{select:true,name:'pomeriggio'},{select:true,name:'sera'},{select:true,name:'notte'}]


  response:any;
  statesToShow:any;

  constructor(private http:HttpClient,private SharedService:SharedService){}
  ngOnInit(){
    this.initValueFromBackend()
  }
  initBarGrapf(){
    let toSend:any={};
    toSend.func="clear";
    this.SharedService.sendClickEvent(toSend);
  }
  clearGraph(){
    let toSend:any={};
    toSend.func="default";
    this.SharedService.sendClickEvent(toSend);
  }

  initValueFromBackend(){

    let url=this.ROOT_URL+this.INIT
    this.http.get(url).subscribe(data => {
      this.response=data;

      this.initMap.QUERY_TIME=[];

      this.initMap.START_TIME=new Date(Number(this.response['start_time'][0]) * 1000);

      this.initMap.END_TIME=new Date(Number(this.response['end_time'][0]) * 1000);

      this.initMap.FONTI=[]
      this.initMap.FONTI.push({select:false,name:"SELEZIONA TUTTE LE FONTI",color:"spaceBottom checkbox-title"},)

      this.initMap.STATI=[]
      this.initMap.STATI.push({select:false,name:"SELEZIONA TUTTI GLI STATI",color:"spaceBottom checkbox-title"},)

      this.initMap.SOTTO_STATI=[]
      this.initMap.SOTTO_STATI.push({select:false,name:"SELEZIONA TUTTI GLI STATI",color:"spaceBottom checkbox-title"},)
      this.response['stati_sottostati'].forEach((element: string) => {
        this.initMap.SOTTO_STATI.push({select:false,name:element})
      });

      this.response['fonti'].forEach((element: string) => {
        this.initMap.FONTI.push({select:false,name:element,color:this.colorMap[element]})
      });

      this.response['stati'].forEach((element: String) => {
        this.initMap.STATI.push({select:false,name:element})
      });

      this.statesToShow=this.initMap.STATI

      this.running="running";
      document.getElementById("spark-icon")?.classList.add("spark-icon")
      console.log(document.getElementsByClassName("toHideAtStart"))
      for(let i=0;i<document.getElementsByClassName("toHideAtStart").length;i++){
        document.getElementsByClassName("toHideAtStart")[i]?.classList.remove("hide")
      }
    });
  }

  addValueToGraph(label:any,value:any,datasetLabel?:any,backgroundColor?:any,borderColor?:any){
    let toSend:any={};
    toSend.func="addValue";
    toSend.value=value;
    toSend.backgroundColor=backgroundColor?backgroundColor:"rgba(255, 99, 132, 0.2)"
    toSend.borderColor=borderColor?borderColor:"rgba(255, 99, 132, 1)"
    toSend.label=label
    toSend.datasetLabel=datasetLabel?datasetLabel:"query"
    this.SharedService.sendClickEvent(toSend);
  }
  addValueToGraphStacked(label:any,value:any,datasetLabel?:any,backgroundColor?:any,borderColor?:any){
    let toSend:any={};
    toSend.func="addValueStacked";
    toSend.value=value;
    toSend.backgroundColor=backgroundColor?backgroundColor:"rgba(255, 99, 132, 0.2)"
    toSend.borderColor=borderColor?borderColor:"rgba(255, 99, 132, 1)"
    toSend.label=label
    toSend.datasetLabel=datasetLabel?datasetLabel:"query"
    this.SharedService.sendClickEvent(toSend);
  }


  getParams(params:any){

    let res="";
    if(params!=={}){
      for (let k in params){
        if(params[k].includes(" ")){
          params[k]=params[k].replace(/ /g,"%");
        }
        res+=k+"="+params[k]+"&"
      }
      console.log(res)
      return res
    }
    else{
      return undefined;
    }

  }

  onChangeFonts($event: any){
    const name=$event.target.defaultValue
    let isChecked:boolean;

    isChecked=$event.target.checked
    if(name==="SELEZIONA TUTTE LE FONTI" && isChecked){
      this.initMap.FONTI=this.initMap.FONTI.map((s: {name:String, select: boolean; })=>{
        s.select=true;


        return s;
      })
    }
    else if(name==="SELEZIONA TUTTE LE FONTI" && !isChecked){
      this.initMap.FONTI=this.initMap.FONTI.map((s: {name:String, select: boolean; })=>{
        s.select=false;


        return s;
      })

    }
    else{

      this.initMap.FONTI= this.initMap.FONTI.map((s: { name: string; select: boolean; })=>{

        if(s.name===name){
          s.select=isChecked;
          this.initMap.FONTI=this.recap(this.initMap.FONTI);
          return s
        }


        return s;
      })
    }

  }

  onChangeStates($event: any){
    const name=$event.target.defaultValue
    let isChecked:boolean;

    isChecked=$event.target.checked
    if(name==="SELEZIONA TUTTI GLI STATI" && isChecked){
      this.statesToShow=this.statesToShow.map((s: {name:String, select: boolean; })=>{
        s.select=true;


        return s;
      })
    }
    else if(name==="SELEZIONA TUTTI GLI STATI" && !isChecked){
      this.statesToShow=this.statesToShow.map((s: {name:String, select: boolean; })=>{
        s.select=false;


        return s;
      })

    }
    else{

      this.statesToShow= this.statesToShow.map((s: { name: string; select: boolean; })=>{

        if(s.name===name){
          s.select=isChecked;
          this.statesToShow=this.recap(this.statesToShow);
          return s
        }


        return s;
      })
    }

  }

recap(value: any){
  let shouldAllSelected=value[0].select
  if(shouldAllSelected){
    let allSelected=true;
    value.map((s:{name:string;select:boolean})=>{
      if(!s.select){
        allSelected=false;
      }
    })
    value[0].select=allSelected;
  }
  else{
    let allSelected=true;
    value.map((s:{name:string;select:boolean})=>{
      if(!s.select && (s.name!="SELEZIONA TUTTI GLI STATI"&&s.name!="SELEZIONA TUTTE LE FONTI"&&s.name!="TUTTO IL GIORNO")){
        allSelected=false;
      }
    })
    value[0].select=allSelected;
  }
  return value;

}


onChangeFormStates($event: any){
  console.log($event)
  if($event.value==2){
    this.statesToShow=this.initMap.SOTTO_STATI
    this.stato_is_checked=false;
    this.sotto_stato_is_checked=true;
  }
  else{
    this.statesToShow=this.initMap.STATI
    this.stato_is_checked=true;
    this.sotto_stato_is_checked=false;
  }
}
onChangeTimeSlots($event:any){


  const name=$event.target.defaultValue
  let isChecked:boolean;

  isChecked=$event.target.checked
  if(name==="TUTTO IL GIORNO" && isChecked){
    this.timeSlots=this.timeSlots.map((s: {name:string, select: boolean; })=>{
      s.select=true;


      return s;
    })
  }
  else if(name==="TUTTO IL GIORNO" && !isChecked){
    this.timeSlots=this.timeSlots.map((s: {name:string, select: boolean; })=>{
      s.select=false;
      return s;
    })

  }
  else{

    this.timeSlots= this.timeSlots.map((s: { name: string; select: boolean; })=>{

      if(s.name===name){
        s.select=isChecked;
        this.timeSlots=this.recap(this.timeSlots);
        return s
      }


      return s;
    })
  }


}

getSelectedStates(){
  let selectedStates: any[]=[]
  this.statesToShow.forEach((element: { select: any; name: any; }) => {
    if(element.select){
      selectedStates.push(element.name)
    }

  });
  return selectedStates;
}
getSelectedFonts(){
  let selectedFonts: any[]=[]
  this.initMap.FONTI.forEach((element: { select: any; name: any; }) => {
    if(element.select){
      selectedFonts.push(element.name)
    }

  });
  return selectedFonts;
}

getSelectedTimeSlots(){
  let selectedTimeSlots: any[]=[]
  this.timeSlots.forEach((element: { select: any; name: any; }) => {
    if(element.select){
      selectedTimeSlots.push(element.name)
    }

  });
  return selectedTimeSlots;
}

makeSimpleQuery(address_service:String){
  let params:any={}
  params.tipo=this.stato_is_checked?"stati":"sotto_stati"
  let valueToTake="stato"//stato
  params.stati="["+this.getSelectedStates()+"]"
  params.giorni="["+this.initMap.QUERY_TIME+"]"
  params.fascia_oraria="["+this.getSelectedTimeSlots()+"]"
  this.makeGetRequest(address_service,params).subscribe(data => { this.initBarGrapf();this.response=data;this.response.forEach((element: { [x: string]: any; }) => {
    let red=Math.floor(Math.random() * 256)
    let green=Math.floor(Math.random() * 256)
    let blue=Math.floor(Math.random() * 256)
    this.addValueToGraph(element[valueToTake],element['value'],element['label'],"rgba("+red+","+green+","+blue+",0.5)","rgba(100,100,100,1)")});
    /* "rgba("+red+","+green+","+blue+",2.0)" */
  })
}


makeComplexQuery(address_service:String){
  let params:any={}
  params.tipo=this.stato_is_checked?"stati":"sotto_stati"
  let valueToTake="stato"
  params.stati="["+this.getSelectedStates()+"]"
  params.giorni="["+this.initMap.QUERY_TIME+"]"
  params.fascia_oraria="["+this.getSelectedTimeSlots()+"]"
  params.fonti="["+this.getSelectedFonts()+"]"
  this.makeGetRequest(address_service,params).subscribe(data => { this.initBarGrapf();this.response=data;this.response.forEach((element: { [x: string]: any; }) => {
    let red=Math.floor(Math.random() * 256)
    let green=Math.floor(Math.random() * 256)
    let blue=Math.floor(Math.random() * 256)
    /* for(let i=0;i<this.response['fonti'].length;i++){
      this.addValueToGraphStacked(element[valueToTake],element['value'][i],element['label'][i],"rgba("+red+","+green+","+blue+",0.5)","rgba(100,100,100,1)")
    } */
    this.addValueToGraphStacked(element[valueToTake],element['value'],element['label'],"rgba("+red+","+green+","+blue+",0.5)","rgba(100,100,100,1)")});
    /* "rgba("+red+","+green+","+blue+",2.0)" */
  })
}



makeGetRequest(address_service:String,params:any){
  console.log(params)
  let httpParams=this.getParams(params)
  console.log(httpParams)

  let url=this.ROOT_URL+"/"+address_service+(httpParams?"/?"+httpParams:"")
  console.log(url)
  if(httpParams)url=url.substring(0,url.length-1)
  return this.http.get(url);
}
saveSelectedTime(value:string){

  let fine=(new Date(value.split("%")[1]).getTime()/1000)
  let inizio=(new Date(value.split("%")[0]).getTime()/1000)
  let diff=fine-inizio;
  let numD=diff/3600/24+1
  for(let i=0;i<numD;i++){
    this.initMap.QUERY_TIME.push(inizio+(i*86400))
  }

}

}
