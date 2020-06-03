export interface Measurements {
  country_code: string;
  indicator_code: string;
  measurement_year: number;
  measurement: number;
}

export interface Indicators {
  indicator: string;
  indicator_code: string;
}

export interface Countries {
  country: string;
  country_code: string;
}

export interface Try {
  measurement: number;
  country_code: string;
  indicator_code: string;
  measurement_year: number;
}

export interface Scatter {
  M1_measurement: number;
  country_code: string;
  M2_measurement: number;
}
