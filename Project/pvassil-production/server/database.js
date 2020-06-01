const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(express.json());
app.use(cors());

/* CONNECTION ~~~~~~~~~*/
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "screamformeioannina",
  database: "WORLDBANK",
  port: "3306",
});
/* CONNECTION ~~~~~~~~~*/

/* QUERIES ~~~~~~~~~~~~*/
/*~~~~~~~~~~~~~~~~~~~~~*/

//GET all measurements
app.route("/api/measurements").get((req, res) => {
  pool.query(`SELECT * FROM measurements`, (err, result) => {
    if (err) throw err;
    res.json(result);
    console.log("All measurements transferred to Front-End.");
  });
});

app.route("/api/measurements:measurement").get((req, res) => {
  var measurement = req.params["measurement"];
  measurement = measurement.substring(1);
  var array = measurement.split("+");
  var country_code = array[0];
  var indicator_code = array[1];
  pool.query(
    `SELECT * FROM measurements WHERE country_code = ? && indicator_code = ?`,
    [country_code, indicator_code],
    (err, result) => {
      if (err) throw err;
      res.json(result);
      console.log("Measurements transferred to Front-End.");
    }
  );
});

//GET all countries
app.route("/api/countries").get((req, res) => {
  pool.query(`SELECT * FROM countries`, (err, result) => {
    if (err) throw err;
    res.json(result);
    console.log("All countries transferred to Front-End.");
  });
});

app.route("/api/countries:values").get((req, res) => {
  var values = req.params["values"];
  values = values.substring(1);
  pool.query(
    `SELECT * FROM countries WHERE country_code = ?`,
    values,
    (err, result) => {
      if (err) throw err;
      res.json(result);
      console.log("Single country transferred to Frond-End");
    }
  );
});

app.route("/api/indicators").get((req, res) => {
  pool.query(`SELECT * FROM indicators`, (err, result) => {
    if (err) throw err;
    res.json(result);
    console.log("All Indicators transferred to Frond-End");
  });
});

app.route("/api/indicators:indicator").get((req, res) => {
  var indicator = req.params["indicator"];
  indicator = indicator.substring(1);
  pool.query(
    `SELECT * FROM indicators WHERE indicator_code = ?`,
    indicator,
    (err, result) => {
      if (err) throw err;
      res.json(result);
      console.log("Indicator transferred to Frond-End");
    }
  );
});

app.route("/api/years:year").get((req, res) => {
  var year = req.params["year"];
  year = year.substring(1);
  array = year.split("+");
  pool.query(
    `SELECT * FROM years WHERE ${array[0]} = ?`,
    [array[1]],
    (err, result) => {
      if (err) throw err;
      res.json(result);
      console.log("year transferred to Frond-End");
    }
  );
});

app.route("/api/lcmul:patates").get((req, res) => {
  var patates = req.params["patates"];
  patates = patates.substring(1);
  var array = patates.split("&");
  var countries = array[0].split("+");
  var indicators = array[1].split("+");
  var period = array[2];
  var question = `SELECT AVG(measurement) as measurement, country_code, indicator_code, ANY_VALUE(years.measurement_year) as measurement_year
  FROM measurements, years WHERE measurements.measurement_year = years.measurement_year
  AND (indicator_code = "${indicators[0]}"`;
  for (let i = 1; i < indicators.length; i++)
    question += ` or indicator_code = "${indicators[i]}"`;
  question += `) AND (country_code = "${countries[0]}"`;
  for (let i = 1; i < countries.length; i++)
    question += ` or country_code = "${countries[i]}"`;
  question += `) GROUP BY country_code, indicator_code, ${period}`;

  pool.query(question, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.route("/api/lcsingle:values").get((req, res) => {
  var values = req.params["values"];
  values = values.substring(1);
  var array = values.split("&");
  var countries = array[0].split("+");
  var indicators = array[1].split("+");
  var question = `SELECT measurement, country_code, indicator_code, ANY_VALUE(years.measurement_year) as measurement_year
  FROM measurements, years WHERE measurements.measurement_year = years.measurement_year
  AND (indicator_code = "${indicators[0]}"`;
  for (let i = 1; i < indicators.length; i++)
    question += ` or indicator_code = "${indicators[i]}"`;
  question += `) AND (country_code = "${countries[0]}"`;
  for (let i = 1; i < countries.length; i++)
    question += ` or country_code = "${countries[i]}"`;
  question += `)`;

  pool.query(question, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.route("/api/scatter:values").get((req, res) => {
  var values = req.params["values"];
  values = values.substring(1);
  var array = values.split("+");

  pool.query(
    `SELECT ANY_VALUE(M1.measurement) as M1_measurement, ANY_VALUE(M2.measurement) as M2_measurement, ANY_VALUE(M1.country_code) as country_code
FROM measurements AS M1, measurements AS M2
WHERE (M1.indicator_code = ? AND M2.indicator_code = ?) and M1.country_code = ? and M2.country_code = ? AND M1.MEASUREMENT_YEAR = M2.MEASUREMENT_YEAR`,
    [array[0], array[1], array[2], array[2]],
    (err, result) => {
      if (err) throw err;
      res.json(result);
    }
  );
});
/*~~~~~~~~~~~~~~~~~~~~~*/
/* QUERIES ~~~~~~~~~~~~*/

/*Listening ~~~~~~~~~~~*/
app.listen(8000, () => {
  console.log("Server now listens at port: 8000.");
});
