import { FormControl } from "@angular/forms";
import { Try } from "./../datas";
import { DataService } from "./../data.service";
import { Component, OnInit } from "@angular/core";
import { Indicators, Countries } from "../datas";

// Import D3!
import * as d3 from "d3";

@Component({
  selector: "app-bar-chart",
  templateUrl: "./bar-chart.component.html",
  styleUrls: ["./bar-chart.component.scss"],
})
export class BarChartComponent implements OnInit {
  indicatorsForm = new FormControl();
  countriesForm = new FormControl();

  // my years to select
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

  // Year selection
  yearSelect: String = "None";

  // Constructor
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
    const data = this.measurements$;

    let margin = { top: 50, right: 40, bottom: 50, left: 100 };
    let width = 900;
    let height = 500;

    // create the svg in the div with class .d3
    let svg = d3
      .select(".d3")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
    //

    // Nest the data with Countries and Indicators
    let nested = d3
      .nest<Try>()
      .key((d) => d.country_code)
      .key((d) => d.indicator_code)
      .entries(data);
    //

    // get the max measurement, gonna be on top of yAxis
    const maxMeasurement = d3.max(data, (d) => d.measurement);

    // take the values for the xAxis
    let x = d3
      .scaleBand()
      .domain(data.map((d) => d.measurement_year.toString()))
      .rangeRound([margin.left, width - margin.right])
      .padding(0.1);
    //

    // take the values for the yAxis
    let y = d3
      .scaleLinear()
      .domain([0, maxMeasurement])
      .range([height - margin.bottom, margin.top]);
    //

    let yAxis = (g) =>
      g.attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y));
    //

    let xAxis = (g) =>
      g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));
    //

    let yTitle = (g) =>
      g
        .append("text")
        .attr("font-family", "nunito")
        .attr("fill", "white")
        .attr("font-size", 10)
        .attr("x", margin.left - 50)
        .attr("y", margin.top - 20)
        .text("↑ MEASUREMENTS");
    //

    let xTitle = (g) =>
      g
        .append("text")
        .attr("font-family", "nunito")
        .attr("fill", "white")
        .attr("font-size", 10)
        .attr("y", height - 10)
        .attr("x", width / 2)
        .text("YEARS →");
    //

    // in div with class .d3, create a new div to show the bar info
    let tooltip = d3
      .select(".d3")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("border-radius", "5px")
      .style("background-color", "rgb(50,50,50)")
      .style("padding", "10px");

    const countries = nested.length; // how many countries ?
    const indicators = nested[0].values.length; // how many indicators ?

    let myArray = [];
    let maxValues = 0;

    // if i have 1 country and 2 indicators or opposite, then maxValues
    // must be 2.
    // if i have 1 country and 1 indicator, maxValues must be 1.
    // otherwise take the sum
    if (
      (countries == 1 && indicators == 2) ||
      (countries == 2 && indicators == 1)
    ) {
      maxValues = 2;
      myArray[0] = 0;
      myArray[1] = 1;
    } else if (countries == 1 && indicators == 1) {
      maxValues = 1;
      myArray[0] = 0;
    } else {
      maxValues = countries + indicators;
      for (let i = 0; i < maxValues; i++) {
        myArray[i] = i;
      }
    }
    //

    // color range for each indicator will be in range 0 - maxValues
    let color = d3
      .scaleLinear<string>()
      .domain([0, maxValues])
      .range(["orange", "purple"]);
    //

    // ask me to explain!
    let xBars = d3
      .scaleBand()
      .domain(myArray)
      .range([0, x.bandwidth()])
      .padding(0);
    //

    let counter = 0;

    // lets do some work here for the bars. parse the d.values and then
    // for every element in d.values, create a bar with the corrent counter.
    let rect = svg.append("g").selectAll("rect").data(nested).enter();
    rect
      .selectAll(".rect")
      .data((d) => {
        return d.values;
      })
      .enter()
      .each((d: any) => {
        d.values.forEach((element) => {
          rect
            .append("rect")
            .attr("x", () => {
              return x(element.measurement_year) + xBars(counter.toString());
            })
            .attr("y", y(0))
            .attr("height", 0)
            .attr("fill", "black")
            .on("mouseover", () => {
              let country = "";
              let indicator = "";

              for (let i = 0; i < this.countries$.length; i++) {
                if (this.countries$[i].country_code === element.country_code) {
                  country = this.countries$[i].country;
                  break;
                }
              }

              for (let i = 0; i < this.indicators$.length; i++) {
                if (
                  this.indicators$[i].indicator_code === element.indicator_code
                ) {
                  indicator = this.indicators$[i].indicator;
                  break;
                }
              }

              tooltip
                .style("opacity", 1)
                .style("color", "rgb(240,240,240)")
                .html(
                  "Country: " +
                    country +
                    "<br>" +
                    "Indicator: " +
                    indicator +
                    "<br>" +
                    "Year: " +
                    element.measurement_year +
                    "<br>" +
                    "measurement: " +
                    element.measurement
                );
            })
            .on("mouseout", () => {
              tooltip.style("opacity", 0);
            })
            .transition()
            .delay(1000)
            .duration(1000)
            .attr("x", () => {
              return x(element.measurement_year) + xBars(counter.toString());
            })
            .attr("y", y(element.measurement))
            .attr("height", y(0) - y(element.measurement))
            .attr("width", x.bandwidth() / maxValues)
            .attr("fill", function () {
              return color(counter);
            });
        });
        counter = counter + 1;
      });
    // call axis
    svg
      .append("g")
      .call(xAxis)
      .selectAll("text")
      .style("color", "rgb(240,240,240)")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", function (d) {
        return "rotate(-50)";
      });
    svg.append("g").call(yAxis).style("color", "rgb(240,240,240)");
    svg.call(xTitle).style("color", "rgb(240,240,240)");
    svg.call(yTitle);

    this.f1 = false;
  }
}
