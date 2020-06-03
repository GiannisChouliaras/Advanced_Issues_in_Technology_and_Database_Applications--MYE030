import { Countries, Indicators, Scatter } from "./../datas";
import { DataService } from "./../data.service";
import { Component, OnInit } from "@angular/core";

// Import D3!
import * as d3 from "d3";

@Component({
  selector: "app-scatterplot-chart",
  templateUrl: "./scatterplot-chart.component.html",
  styleUrls: ["./scatterplot-chart.component.scss"],
})
export class ScatterplotChartComponent implements OnInit {
  // flags for steps.
  step0: boolean = false;
  step1: boolean = false;
  step2: boolean = false;
  f1: boolean = false;
  createGraph: boolean = false;

  // arrays for Countries, Indicators, Years
  countries$: Countries[];
  indicators$: Indicators[];
  c_indicators$: Indicators[];
  measurements$: Scatter[];

  countrySelect: String = "None";

  indicatorSelect1: String = "None";
  indicatorSelect2: String = "None";

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.getCountries();
  }

  // Get all countries and call it in ngOnInit
  getCountries() {
    this.dataService.getAllCountries().subscribe((data) => {
      this.countries$ = data;
    });
  }

  // get Indicators -> will triggered after Countries next Button
  getIndicators() {
    this.dataService.getAllIndicators().subscribe((data) => {
      this.indicators$ = data;
      this.c_indicators$ = data;
    });
  }

  changeStep0() {
    this.step0 = true;
  }

  changeStep1() {
    this.step1 = true;
  }

  changeStep2() {
    this.step2 = true;
  }

  epilogi() {
    this.createGraph = true;
    this.f1 = true;
  }

  query() {
    this.dataService
      .getMeasurementsScatter(
        this.countrySelect,
        this.indicatorSelect1,
        this.indicatorSelect2
      )
      .subscribe((data) => {
        this.measurements$ = data;
      });
  }

  byeIndicator() {
    let updatedArray = [];
    for (let el of this.indicators$) {
      if (el.indicator_code !== this.indicatorSelect1) {
        updatedArray.push(el);
      }
    }
    this.indicators$ = updatedArray;
  }

  // D3!
  playData() {
    let indicator1 = "none";
    let indicator2 = "none";
    let country = "none";

    for (let i = 0; i < this.countries$.length; i++)
      if (this.countrySelect === this.countries$[i].country_code)
        country = this.countries$[i].country;

    for (let i = 0; i < this.c_indicators$.length; i++) {
      if (this.indicatorSelect1 === this.c_indicators$[i].indicator_code)
        indicator1 = this.c_indicators$[i].indicator;

      if (this.indicatorSelect2 === this.c_indicators$[i].indicator_code)
        indicator2 = this.c_indicators$[i].indicator;
    }

    const data = this.measurements$;
    const margin = { top: 20, right: 30, bottom: 60, left: 100 };
    const height = 500;
    const width = 900;
    const canvas = d3.select(".d3");

    const svg = canvas
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const maxM1 = d3.max(data, (d) => d.M1_measurement);
    const minM1 = d3.min(data, (d) => d.M1_measurement);
    const maxM2 = d3.max(data, (d) => d.M2_measurement);
    const minM2 = d3.min(data, (d) => d.M2_measurement);

    let x = d3
      .scaleLinear()
      .domain([minM1, maxM1])
      .range([margin.left, width - margin.right]);

    let y = d3
      .scaleLinear()
      .domain([minM2, maxM2])
      .range([height - margin.bottom, margin.top]);

    let yAxis = (g: any) =>
      g.attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y));

    let xAxis = (g: any) =>
      g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    let color = d3
      .scaleLinear<string>()
      .domain([minM2, maxM2])
      .range(["#D48EE9", "#8EC4E9"]);

    let tooltip = d3
      .select(".d3")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("border-radius", "5px")
      .style("background-color", "rgb(50,50,50)")
      .style("padding", "10px");

    svg
      .append("g")
      .selectAll("circle")
      .data(data)
      .enter()
      .append("g")
      .append("circle")
      .attr("cx", margin.left)
      .attr("cy", height - margin.bottom)
      .attr("r", 3)
      .attr("fill", "red")
      .on("mouseover", (d) => {
        d3.select(d3.event.currentTarget)
          .attr("opacity", 0.6)
          .attr("stroke", "black")
          .attr("r", 12);

        tooltip
          .style("opacity", 1)
          .style("color", "rgb(240,240,240)")
          .html(
            "Country: " +
              country +
              "<br>" +
              indicator1 +
              ": " +
              d.M1_measurement +
              "<br>" +
              indicator2 +
              ": " +
              d.M2_measurement
          );
      })
      .on("mouseout", (d) => {
        d3.select(d3.event.currentTarget)
          .attr("opacity", 1)
          .attr("stroke", "none")
          .attr("r", 4.5);
        tooltip.style("opacity", 0);
      })
      .transition()
      .delay(1000)
      .duration(1000)
      .attr("cx", (d) => x(d.M1_measurement))
      .attr("cy", (d) => y(0))
      .attr("r", 12)
      .transition()
      .delay(0)
      .duration(1000)
      .attr("cy", (d) => y(d.M2_measurement))
      .attr("r", 4.5)
      .attr("fill", (d) => color(d.M2_measurement));

    svg
      .append("g")
      .call(xAxis)
      .selectAll(".tick line")
      .clone()
      .attr("y1", margin.top + margin.bottom - height)
      .attr("stroke", "lightgrey")
      .attr("opacity", 0.2);

    svg
      .append("g")
      .call(yAxis)
      .selectAll(".tick line")
      .clone()
      .attr("x1", width - margin.left - margin.right)
      .attr("stroke", "lightgrey")
      .attr("opacity", 0.2);

    svg.append("g").call(xAxis).style("color", "rgb(240,240,240)");
    svg.append("g").call(yAxis).style("color", "rgb(240,240,240)");

    this.f1 = false;
  }
}
