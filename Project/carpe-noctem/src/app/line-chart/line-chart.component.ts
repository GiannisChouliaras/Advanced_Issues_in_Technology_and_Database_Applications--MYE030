import { Countries, Indicators, Try } from "./../datas";
import { FormControl } from "@angular/forms";
import { DataService } from "./../data.service";
import { Component, OnInit } from "@angular/core";

import * as d3 from "d3";

@Component({
  selector: "app-line-chart",
  templateUrl: "./line-chart.component.html",
  styleUrls: ["./line-chart.component.scss"],
})
export class LineChartComponent implements OnInit {
  indicatorsForm = new FormControl();
  countriesForm = new FormControl();

  years: String[] = ["single", "5yearperiod", "10yearperiod", "20yearperiod"];

  // flags for steps.
  step0: boolean = false;
  step1: boolean = false;
  step2: boolean = false;
  f1: boolean = false;
  createGraph: boolean = false;

  // arrays for Countries, Indicators, Years
  countries$: Countries[];
  indicators$: Indicators[];
  measurements$: Try[];

  yearSelect: String = "None";

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
    });
  }

  myQuery() {
    this.dataService
      .getMeasurementsTrying(
        this.countriesForm,
        this.indicatorsForm,
        this.yearSelect
      )
      .subscribe((data) => {
        this.measurements$ = data;
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

  playData() {
    let data = this.measurements$;

    const nested = d3
      .nest<Try>()
      .key((d) => {
        return d.country_code;
      })
      .key((d) => {
        return d.indicator_code;
      })
      .entries(data);
    //

    let svg = d3
      .select(".d3")
      .append("svg")
      .attr("width", 900)
      .attr("height", 500);
    //

    let margin = { top: 50, right: 40, bottom: 50, left: 100 };
    let width = 900;
    let height = 500;

    const maxMeasurement = d3.max(data, (d) => d.measurement);

    let x = d3
      .scaleBand<string>()
      .domain(data.map((d) => d.measurement_year.toString()))
      .rangeRound([margin.left, width - margin.right])
      .padding(1);

    let y = d3
      .scaleLinear()
      .domain([0, maxMeasurement])
      .nice()
      .range([height - margin.bottom, margin.top]);
    //

    let yAxis = (g) =>
      g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call((g) => g.select(".domain"))
        .call((g) =>
          g
            .select(".tick:last-of-type text")
            .clone()
            .attr("x", 3)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
        );

    let xAxis = (g) =>
      g.attr("transform", `translate(0,${height - margin.bottom})`).call(
        d3
          .axisBottom(x)
          .ticks(width / 80)
          .tickSizeOuter(0)
      );
    //

    let yTitle = (g) =>
      g
        .append("text")
        .attr("font-family", "nunito")
        .attr("fill", "white")
        .attr("font-size", 10)
        .attr("x", margin.left - 70)
        .attr("y", margin.top - 20)
        .text("↑ MEASUREMENTS");
    //

    let xTitle = (g) =>
      g
        .append("text")
        .attr("font-family", "nunito")
        .attr("fill", "white")
        .attr("font-size", 10)
        .attr("y", height - 5)
        .attr("x", width / 2)
        .text("YEARS →");
    //

    let tooltip = d3
      .select(".d3")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "rgb(50,50,50)")
      .style("border-radius", "5px")
      .style("padding", "10px");
    //

    let colorScale = d3
      .scaleOrdinal(d3.schemeCategory10)
      .domain(nested.map((d) => d.key))
      .range([
        "#FF0000",
        "#0004FF",
        "#FFA200",
        "#000000",
        "#A82B58",
        "#34D1C3",
      ]);

    const line = d3
      .line<Try>()
      .defined((d: Try) => !isNaN(d.measurement))
      .x((d: Try) => x(d.measurement_year.toString()))
      .y((d: Try) => y(d.measurement));

    let lineChart = svg.selectAll(".lineChart").data(nested).enter();
    lineChart
      .selectAll(".line")
      .data((d) => d.values)
      .join("path")
      .attr("stroke", function (d: any) {
        return colorScale(d.key + d.values[0].country_code);
      })
      .attr("stroke-width", 2)
      .attr("d", (d: any) => line(d.values))
      .attr("fill", "none")
      .on("mouseover", (d: any) => {
        let country = "";
        let indicator = "";

        for (let i = 0; i < this.countries$.length; i++) {
          if (this.countries$[i].country_code === d.values[0].country_code) {
            country = this.countries$[i].country;
            break;
          }
        }

        for (let i = 0; i < this.indicators$.length; i++) {
          if (
            this.indicators$[i].indicator_code === d.values[0].indicator_code
          ) {
            indicator = this.indicators$[i].indicator;
            break;
          }
        }

        tooltip
          .style("opacity", 1)
          .style("color", "white")
          .html(
            "Country: " + country + "<br>" + "Indicator: " + indicator + "<br>"
          );
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });

    svg
      .append("g")
      .call(xAxis)
      .style("color", "rgb(240,240,240)")
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", function (d) {
        return "rotate(-50)";
      });

    svg
      .append("g")
      .call(yAxis)
      .selectAll(".tick line")
      .clone()
      .attr("x1", width - margin.left - margin.right)
      .attr("stroke", "lightgrey")
      .attr("opacity", 0.2);

    svg.call(xTitle).style("color", "rgb(240,240,240)");
    svg.call(yTitle).style("color", "rgb(240,240,240)");

    this.f1 = false;
  } // end playData()
} // end of class
