import { CheckboxsComponent } from './Components/checkboxs/checkboxs.component';
import { Component } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import {ThemePalette} from '@angular/material/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'spark-view';
  /* checkboxFilter=new CheckboxsComponent("Fonti",[],"Accent");; */
  readonly ROOT_URL='http://localhost:8080';
  readonly FUNC1="/func1"
  readonly FUNC2="/func2"
  readonly FUNC3="/func3"
  readonly INIT="/init"

  /* colorMap=new Map<String,String>(); */
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





  initMap: any={}


  response:any;
  constructor(private http:HttpClient){}
  tuttiGliStati="SELEZIONA TUTTI GLI STATI"

  ngOnInit(){
    this.initValueFromBackend()
  }

  initValueFromBackend(){

    let url=this.ROOT_URL+this.INIT
    this.http.get(url).subscribe(data => {
      this.response=data;
      this.initMap.START_TIME=this.response['start_time'][0];
      this.initMap.END_TIME=this.response['end_time'][0];
      this.initMap.FONTI=[]
      this.initMap.FONTI.push({select:false,name:"SELEZIONA TUTTE LE FONTI"},)


      this.initMap.STATI=[]
      this.initMap.STATI.push({select:false,name:"SELEZIONA TUTTI GLI STATI",color:"red"},)

      this.initMap.SOTTO_STATI=this.response['sotto_stati'];
        this.response['fonti'].forEach((element: string) => {
        this.initMap.FONTI.push({select:false,name:element,color:this.colorMap[element]})
        console.log({select:false,name:element,color:this.colorMap[element]})
      });
        this.response['stati'].forEach((element: String) => {
        this.initMap.STATI.push({select:false,name:element})
      });
      console.log(this.initMap)

    });
  }

  getJson(){
    let params = new Map<string, any>();
    params.set("field1",'ciccio');
    params.set('field2',"ciao")
    let httpParams=this.getParams(params)
    /* let fParams=undefined; */
    /* let httpParams = new HttpParams();
    params.forEach((value, key) => { httpParams=httpParams.set(key,value) } )
    console.log(httpParams) */
    console.log("new")
    let url=this.ROOT_URL+this.INIT+(httpParams?"/?"+httpParams:"")
    if(httpParams)url=url.substring(0,url.length-1)
    this.http.get(url).subscribe(data => {this.response=data;console.log(this.response)});
  }

  getParams(params:Map<String,any>){
    let res="";
    if(params && params.size>0){
      params.forEach((value, key) => { res+=key+"="+value+"&" } );
      return res;
    }
    else{return undefined;}

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
      this.initMap.STFONTIATI=this.initMap.FONTI.map((s: {name:String, select: boolean; })=>{
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
      this.initMap.STATI=this.initMap.STATI.map((s: {name:String, select: boolean; })=>{
        s.select=true;


        return s;
      })
    }
    else if(name==="SELEZIONA TUTTI GLI STATI" && !isChecked){
      this.initMap.STATI=this.initMap.STATI.map((s: {name:String, select: boolean; })=>{
        s.select=false;


        return s;
      })

    }
    else{

      this.initMap.STATI= this.initMap.STATI.map((s: { name: string; select: boolean; })=>{

        if(s.name===name){
          s.select=isChecked;
          this.initMap.STATI=this.recap(this.initMap.STATI);
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
      if(!s.select && (s.name!="SELEZIONA TUTTI GLI STATI"&&s.name!="SELEZIONA TUTTE LE FONTI")){
        allSelected=false;
      }
    })
    value[0].select=allSelected;
  }

}

}
