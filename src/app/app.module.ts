import { NgModule, ViewContainerRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChartsComponent } from './Components/charts/charts.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CheckboxsComponent } from './Components/checkboxs/checkboxs.component';
import { LoaderDirective } from './utils/loader.directive';
import {MatRadioModule} from '@angular/material/radio';
import {CalendarModule} from '@syncfusion/ej2-angular-calendars';
import { DatePickerComponent } from './Components/date-picker/date-picker.component';
import { FormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import {DateAdapter, MAT_DATE_FORMATS,MAT_DATE_LOCALE} from '@angular/material/core';
@NgModule({
  declarations: [
    AppComponent,
    ChartsComponent,
    CheckboxsComponent,
    LoaderDirective,
    DatePickerComponent,

  ],
  imports: [
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatRadioModule,
    CalendarModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule

  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
