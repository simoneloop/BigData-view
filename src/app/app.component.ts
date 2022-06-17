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
    "sconosciuto":"black",
    "fotovoltaico":"solar"


  }




  stato_is_checked:boolean=true;
  sotto_stato_is_checked:boolean=false;
  one_state_selected:boolean=false;

  initMap: any={}

  running:string="not running";
/*   timeSlots=[{select:true,name:'TUTTO IL GIORNO',class:"checkbox-title spaceBottom"},{select:true,name:'mattina'},{select:true,name:'pomeriggio'},{select:true,name:'sera'},{select:true,name:'notte'}]
 */
  epsilon =0.3;
  min_samples = 2;
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
  initLineStackedGraph(value: any){
    let toSend:any={};
    toSend.func="initLineStackedGraph";
    toSend.value=value;
    this.SharedService.sendClickEvent(toSend);
  }
  initLineUnstackedGraph(value: any){
    let toSend:any={};
    toSend.func="initLineUnstackedGraph";
    toSend.value=value;
    this.SharedService.sendClickEvent(toSend);
  }
  initBubbleGraph(value:any){
    let toSend:any={};
    toSend.func="initBubbleGraph"
    toSend.value=value;
    this.SharedService.sendClickEvent(toSend);
  }
  clearGraph(){
    let toSend:any={};
    toSend.func="default";
    this.SharedService.sendClickEvent(toSend);
  }

  initValueFromBackend(){
    let list=document.getElementsByClassName("to-animate-at-start")
    for(let i=0;i<list.length;i++){
      list[i].classList.add("animate-checkbox")
    }
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

      this.initMap.timeSlots=[]
      this.initMap.timeSlots.push({select:true,name:'TUTTO IL GIORNO',class:"checkbox-title spaceBottom"})
      this.response['time_slots'].forEach((element: string) => {
        this.initMap.timeSlots.push({select:true,name:element})
      });



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
      (async () => {
        // Do something before delay
        console.log('before delay')

        await new Promise(f => setTimeout(f, 1200));

        for(let i=0;i<list.length;i++){
          list[i].classList.remove("animate-checkbox")
        }
      })();

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
  addValueToGraphStacked(columnLabel:any,value:any,fontLabel?:any){
    let toSend:any={};
    toSend.func="addValueStacked";
    toSend.value=value;
    toSend.columnLabel=columnLabel
    toSend.fontLabel=fontLabel?fontLabel:"query"
    this.SharedService.sendClickEvent(toSend);
  }

  addValueToGraphLineStacked(columnLabel:any,value:any,fontLabel?:any){
    let toSend:any={};
    toSend.func="addValueLineStacked";
    toSend.value=value;
    toSend.columnLabel=columnLabel
    toSend.fontLabel=fontLabel?fontLabel:"query"
    this.SharedService.sendClickEvent(toSend);
  }
  addValueToBubbleGraph(clusterLabel:any,value:any,bubbleLabel:any){
    let toSend:any={};
    toSend.func="addValueBubbleGraph";
    toSend.value=value;
    toSend.clusterLabel=clusterLabel
    toSend.bubbleLabel=bubbleLabel
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
    this.updateOneStateQuery()

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
    this.initMap.timeSlots=this.initMap.timeSlots.map((s: {name:string, select: boolean; })=>{
      s.select=true;


      return s;
    })
  }
  else if(name==="TUTTO IL GIORNO" && !isChecked){
    this.initMap.timeSlots=this.initMap.timeSlots.map((s: {name:string, select: boolean; })=>{
      s.select=false;
      return s;
    })

  }
  else{

    this.initMap.timeSlots= this.initMap.timeSlots.map((s: { name: string; select: boolean; })=>{

      if(s.name===name){
        s.select=isChecked;
        this.initMap.timeSlots=this.recap(this.initMap.timeSlots);
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
  if(selectedFonts[0]==="SELEZIONA TUTTE LE FONTI"){selectedFonts.shift()}

  return selectedFonts;
}

getSelectedTimeSlots(){
  let selectedTimeSlots: any[]=[]
  this.initMap.timeSlots.forEach((element: { select: any; name: any; }) => {
    if(element.select){
      selectedTimeSlots.push(element.name.split(' ')[0])
    }

  });
  return selectedTimeSlots;
}
selectButton(event:any){

  let list=document.getElementsByTagName("button")
  console.log("list",list)
  for(let i=0;i<list.length;i++){
    list[i].classList.remove("selected-btn")
  }
  event.target.setAttribute("class",event.target.getAttribute("class")+" selected-btn")
}

makeSimpleQuery(address_service:String, event?:any){
  this.selectButton(event)

  document.getElementsByClassName("from-angular-to-spark")[0].classList.remove("hide")
  document.getElementsByClassName("arrow-logo")[0].classList.add("animation-pulse")

  let params:any={}
  params.tipo=this.stato_is_checked?"stati":"sotto_stati"
  let valueToTake="stato"//stato
  params.stati="["+this.getSelectedStates()+"]"
  params.giorni="["+this.initMap.QUERY_TIME+"]"
  params.fascia_oraria="["+this.getSelectedTimeSlots()+"]"


  document.getElementsByClassName("arrow-logo")[0].classList.remove("animation-pulse")
  document.getElementsByClassName("arrow-logo")[0].classList.add("animation-pulseReverse")



  this.makeGetRequest(address_service,params).subscribe(data => {

    document.getElementsByClassName("arrow-logo")[0].classList.remove("animation-pulseReverse");
    document.getElementsByClassName("from-angular-to-spark")[0].classList.add("hide");

    this.initBarGrapf();this.response=data;this.response.forEach((element: { [x: string]: any; }) => {
    let red=Math.floor(Math.random() * 256)
    let green=Math.floor(Math.random() * 256)
    let blue=Math.floor(Math.random() * 256)
    this.addValueToGraph(element[valueToTake],element['value'],element['label'],"rgba("+red+","+green+","+blue+",0.5)","rgba(100,100,100,1)")});
  })
}


makeComplexQuery(address_service:String, event?:any){
  this.selectButton(event)

  let params:any={}
  params.tipo=this.stato_is_checked?"stati":"sotto_stati"
  let valueToTake="stato"
  params.stati="["+this.getSelectedStates()+"]"
  params.giorni="["+this.initMap.QUERY_TIME+"]"
  params.fascia_oraria="["+this.getSelectedTimeSlots()+"]"
  params.fonti="["+this.getSelectedFonts()+"]"
  this.makeGetRequest(address_service,params).subscribe(data => {console.log("data",data); this.initBarGrapf();this.response=data; console.log("data",this.response);this.response.forEach((element: { [x: string]: any; }) => {


    this.addValueToGraphStacked(element[valueToTake],element['value'],element['label'])});
  })
}
animationIs(value:String){
  if(value==="sending"){
    document.getElementsByClassName("from-angular-to-spark")[0].classList.remove("hide")
    document.getElementsByClassName("arrow-logo")[0].classList.add("animation-pulse")
  }
  else if(value==="receiving"){
    document.getElementsByClassName("arrow-logo")[0].classList.remove("animation-pulse")
    document.getElementsByClassName("arrow-logo")[0].classList.add("animation-pulseReverse")
  }
  else if(value==="received"){
    document.getElementsByClassName("arrow-logo")[0].classList.remove("animation-pulseReverse");
    document.getElementsByClassName("from-angular-to-spark")[0].classList.add("hide");
  }
  else if(value==="loading"){
    document.getElementsByClassName("angular-updating")[0].classList.remove("hide");
    document.getElementsByClassName("angular-updating")[0].classList.add("flexible");
  }
  else{
    document.getElementsByClassName("angular-updating")[0].classList.remove("flexible");
    document.getElementsByClassName("angular-updating")[0].classList.add("hide");
  }
}
makeLineComplexQuery(address_service:String,stacked:boolean, event?:any){

  if(/* this.one_state_selected */true){
    this.selectButton(event)

    this.animationIs("sending")
    let params:any={}
    params.tipo=this.stato_is_checked?"stati":"sotto_stati"
    let valueToTake="timestamp"
    params.stati="["+this.getSelectedStates()+"]"
    params.giorni="["+this.initMap.QUERY_TIME+"]"
    params.fascia_oraria="["+this.getSelectedTimeSlots()+"]"
    params.fonti="["+this.getSelectedFonts()+"]"
    let firstTime=true;

    this.animationIs("receiving")
    this.makeGetRequest(address_service,params).subscribe(data => {
      this.animationIs("received")
      console.log("received")
      /* this.animationIs("loading") */

      this.response=data;
      console.log("risposta",this.response);
      let cont=0;
      this.response.forEach((element: { [x: string]: any; }) => {
      cont++;
      if(firstTime){
        if(stacked){
          this.initLineStackedGraph(element['value'])

        }
        else{
          this.initLineUnstackedGraph(element['value'])
        }
        firstTime=false;

      }
      this.addValueToGraphLineStacked(element[valueToTake],element['value'],element['label'])});
      /* this.animationIs("stop") */
    })

  }

}
makeDbScanQuery(address_service:String, event?:any){
  this.animationIs("sending")
  let params:any={}
  params.eps=this.epsilon.toString();
  params.ms=this.min_samples.toString();
  params.tipo=this.stato_is_checked?"stati":"sotto_stati"
  let valueToTake="stati"
  params.stati="["+this.getSelectedStates()+"]"
  params.giorni="["+this.initMap.QUERY_TIME+"]"
  params.fascia_oraria="["+this.getSelectedTimeSlots()+"]"
  params.fonti="["+this.getSelectedFonts()+"]"
  let firstTime=true;

  this.animationIs("receiving")
  this.makeGetRequest(address_service,params).subscribe(data => {
    this.animationIs("received")
    /* this.animationIs("loading") */

    this.response=data;

    this.response.forEach((element: { [x: string]: any; }) => {

    if(firstTime){
      this.initBubbleGraph(element['value'])
      firstTime=false;

    }
    console.log(element)
    this.addValueToBubbleGraph(element['label'],element['value'],element[valueToTake])});
    /* this.animationIs("stop") */
  })



}


updateEpsilon(value: string) {
  if(value && parseFloat(value)>0){this.epsilon = parseFloat(value);}
  else{this.epsilon=0.3}

}
updateMin_samples(value: string) {
  if(value && parseFloat(value)>0){this.min_samples = parseInt(value);}
  else{this.min_samples=2}
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
  this.initMap.QUERY_TIME=[];
  for(let i=0;i<numD;i++){
    this.initMap.QUERY_TIME.push(inizio+(i*86400))
  }

}
updateOneStateQuery(){
  let itemsBtn=document.getElementsByClassName("oneStateQueryBtn")
  let itemsPar=document.getElementsByClassName("oneStateQueryParag")
  let count=0;
  this.statesToShow.forEach((element: { select: any; }) => {
    if(element.select)
      count++;
      if(count!=1){
        this.one_state_selected=false;
      }
      else if(count==1){
        this.one_state_selected=true;
      }

  });
  if(this.one_state_selected){
    for(let i=0;i<itemsPar.length;i++){
      if(itemsPar[i].classList.contains("visible")){
        itemsPar[i].classList.remove("visible")
        itemsPar[i].classList.add("hide")
      }
     }
   for(let i=0;i<itemsBtn.length;i++){
    itemsBtn[i].classList.remove("unclickable")

   }
  }
  else{
    for(let i=0;i<itemsPar.length;i++){
      if(itemsPar[i].classList.contains("hide")){
        itemsPar[i].classList.remove("hide")
        itemsPar[i].classList.add("visible")
      }
    }
    for(let i=0;i<itemsBtn.length;i++){
      itemsBtn[i].classList.add("unclickable")

    }
  }

}


}
