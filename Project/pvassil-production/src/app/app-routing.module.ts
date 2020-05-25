import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { BarChartComponent } from "./bar-chart/bar-chart.component";
import { LineChartComponent } from "./line-chart/line-chart.component";
import { ScatterplotChartComponent } from "./scatterplot-chart/scatterplot-chart.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "barchart", component: BarChartComponent },
  { path: "linechart", component: LineChartComponent },
  { path: "scatterplotchart", component: ScatterplotChartComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
