import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";

// import Components
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { BarChartComponent } from "./bar-chart/bar-chart.component";
import { LineChartComponent } from "./line-chart/line-chart.component";

// import Material
import { MatStepperModule } from "@angular/material/stepper";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ScatterplotChartComponent } from './scatterplot-chart/scatterplot-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BarChartComponent,
    LineChartComponent,
    ScatterplotChartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatStepperModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
