import { Component, Input, OnInit } from '@angular/core';
import Chart from 'node_modules/chart.js/auto';
import { SharedService } from 'src/app/utils/shared.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {
  @Input("value") value!:any;
  myChart :any;
  clickEventSubscription: Subscription;
  constructor(private SharedService:SharedService) {
    this.clickEventSubscription=this.SharedService.getClickEvent().subscribe((value)=>{
      console.log(value);
      if(value.func==="init"){
        this.initChart();
        this.myChart.data.datasets[0].label=value.datasetLabel
        this.myChart.update()
      }
      else if(value.func==="addValue"){
        this.addValue(value.value,value.backgroundColor,value.borderColor,value.label)
        this.myChart.data.datasets[0].label=value.datasetLabel
        this.myChart.update()
      }
      else if(value.func==="clear"){
        this.clear();
        this.myChart.data.datasets[0].label=""
        this.myChart.update()

      }


    })
  }

  ngOnInit(): void {
    this.myChart = new Chart("sparkChart", {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: '',
            data:[],
            backgroundColor: [

            ],
            borderColor: [

            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
/* this.initChart() */
  }
  initChart(){
    this.myChart.data.datasets[0].data.push(1)
    this.myChart.data.datasets[0].backgroundColor.push("red")
    this.myChart.data.datasets[0].borderColor.push("red")
    this.myChart.data.labels.push("fatto")


    this.myChart.data.datasets[0].data.push(2)
    this.myChart.data.datasets[0].data.push(3)


    this.myChart.data.datasets[0].backgroundColor.push("green")
    this.myChart.data.datasets[0].backgroundColor.push("blue")

    this.myChart.data.datasets[0].borderColor.push("green")

    this.myChart.data.datasets[0].borderColor.push("blue")


    this.myChart.data.labels.push("nell'")
    this.myChart.data.labels.push("onInit")


    this.myChart.update()
  }

  modifyChart(){
    let n=Math.random()*10
    this.myChart.data.datasets[0].data.push(n)
    let color;
    let borderColor;
    if(n<3 && n>=0){
      color="red"
    }
    else if(n>3 && n<6){
      color="blue"
    }
    else if(n>6 && n<=9){
      color="green"
    }

    if(n<3 && n>=0){
      borderColor="green"
    }
    else if(n>3 && n<6){
      borderColor="red"
    }
    else if(n>6 && n<=9){
      borderColor="blue"
    }
    this.myChart.data.datasets[0].backgroundColor.push(color)
    this.myChart.data.datasets[0].borderColor.push(borderColor)
    this.myChart.data.labels.push(n)
    this.myChart.update()
  }


  clear(){
    this.myChart.data.datasets[0].backgroundColor=[]
    this.myChart.data.datasets[0].borderColor=[]
    this.myChart.data.labels=[]
    this.myChart.data.datasets[0].data=[];
    this.myChart.update()
  }

  addValue(value:any,backgroundColor:any,borderColor:any,label:any){
    this.myChart.data.datasets[0].data.push(value)
    this.myChart.data.datasets[0].backgroundColor.push(backgroundColor)
    this.myChart.data.datasets[0].borderColor.push(borderColor)
    this.myChart.data.labels.push(label)
    this.myChart.update()
  }

}
