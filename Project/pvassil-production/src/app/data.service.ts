import { FormControl } from "@angular/forms";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Measurements, Countries, Indicators, Try, Scatter } from "./datas";

@Injectable({
  providedIn: "root",
})
export class DataService {
  API_URL = "http://localhost:8000/api/";

  constructor(private _http: HttpClient) {}

  getMeasurements(country: string, indicator: string) {
    let myReq = this.API_URL + "measurements+" + country + "+" + indicator;
    return this._http.get<Measurements[]>(myReq);
  }

  getAllIndicators() {
    let myReq = this.API_URL + "indicators";
    return this._http.get<Indicators[]>(myReq);
  }

  getAllCountries() {
    let myReq = this.API_URL + "countries";
    return this._http.get<Countries[]>(myReq);
  }

  getMeasurementsTrying(
    countries: FormControl,
    indicators: FormControl,
    year: String
  ) {
    if (year === "single") {
      let myReq = this.API_URL + "lcsingle:";
      myReq += countries.value[0];
      for (let i = 1; i < countries.value.length; i++) {
        myReq += "+" + countries.value[i];
      }
      myReq += "&" + indicators.value[0];
      for (let i = 1; i < indicators.value.length; i++) {
        myReq += "+" + indicators.value[i];
      }
      console.log(myReq);
      return this._http.get<Try[]>(myReq);
    } else {
      let myReq = this.API_URL + "lcmul:";
      myReq += countries.value[0];
      for (let i = 1; i < countries.value.length; i++) {
        myReq += "+" + countries.value[i];
      }
      myReq += "&" + indicators.value[0];
      for (let i = 1; i < indicators.value.length; i++) {
        myReq += "+" + indicators.value[i];
      }
      myReq += "&" + year;
      console.log(myReq);
      return this._http.get<Try[]>(myReq);
    }
  }

  getMeasurementsScatter(country: String, ind1: String, ind2: String) {
    let myReq = this.API_URL + "scatter:" + ind1 + "+" + ind2 + "+" + country;
    return this._http.get<Scatter[]>(myReq);
  }
}
