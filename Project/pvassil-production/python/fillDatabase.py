import csv
import mysql.connector

host = "localhost"
user = "root"
passwd = "screamformeioannina"
database = "WORLDBANK"

############### ~~~~~~ DATABASE ~~~~~~ ###############

# creates the connection.
mydb = mysql.connector.connect(
    host=host,
    user=user,
    passwd=passwd,
    database=database
)

# Communicator for mySQL.
mycursor = mydb.cursor()


def dropTables():
    mycursor.execute("drop tables measurements, countries, indicators, years;")


def createTables():
    mycursor.execute(
        "CREATE TABLE countries (country VARCHAR(20), country_code VARCHAR(5), primary key (country_code))ENGINE=innodb;")
    mycursor.execute(
        "CREATE TABLE indicators (indicator VARCHAR(150), indicator_code VARCHAR(50), primary key (indicator_code))ENGINE=innodb;")
    mycursor.execute("CREATE TABLE years (measurement_year INTEGER, 5yearperiod VARCHAR(20), 10yearperiod VARCHAR(20), 20yearperiod VARCHAR(20), primary key (measurement_year))ENGINE=innodb;")
    # Creates a table of measurements
    mycursor.execute("CREATE TABLE measurements (country_code VARCHAR(5), indicator_code VARCHAR(20), measurement_year INTEGER, measurement FLOAT, primary key (country_code, indicator_code, measurement_year), FOREIGN KEY(country_code) REFERENCES countries(country_code) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (indicator_code) REFERENCES indicators(indicator_code) ON DELETE CASCADE ON UPDATE CASCADE, FOREIGN KEY (measurement_year) REFERENCES years(measurement_year) ON DELETE CASCADE ON UPDATE CASCADE)ENGINE=innodb;")


def fillCountries():
    sqlFormula = "INSERT INTO countries (country, country_code) VALUES (%s,%s)"

    ############### ~~~~~~ OPENING CSV ~~~~~ ###############
    with open('countries.csv', 'r') as csv_file:
        csv_reader = csv.reader(csv_file)

        for line in csv_reader:
            mycursor.execute(sqlFormula, line)  # in the for loop, we execute the sqlFormula


def fillIndicators():
    sqlFormula = "INSERT INTO indicators (indicator, indicator_code) VALUES (%s,%s)"

    ############### ~~~~~~ OPENING CSV ~~~~~ ###############
    with open('indicators.csv', 'r') as csv_file:
        csv_reader = csv.reader(csv_file)

        for line in csv_reader:
            mycursor.execute(sqlFormula, line)  # in the for loop, we execute the sqlFormula


def fillYears():
    sqlFormula = "INSERT INTO years (measurement_year, 5yearperiod, 10yearperiod, 20yearperiod) VALUES (%s,%s,%s,%s)"

    ############### ~~~~~~ OPENING CSV ~~~~~ ###############
    with open('years.csv', 'r') as csv_file:
        csv_reader = csv.reader(csv_file)

        for line in csv_reader:
            mycursor.execute(sqlFormula, line)  # in the for loop, we execute the sqlFormula


def fillMeasurements():
    # We are creating a formula. inserting one row to db.
    sqlFormula = "INSERT INTO measurements (country_code, indicator_code, measurement_year, measurement) VALUES (%s,%s,%s,%s)"

    ############### ~~~~~~ OPENING CSV ~~~~~ ###############
    with open('measurements.csv', 'r') as csv_file:
        csv_reader = csv.reader(csv_file)

        for line in csv_reader:
            mycursor.execute(sqlFormula, line)  # in the for loop, we execute the sqlFormula


dropTables()
createTables()
fillCountries()
fillIndicators()
fillYears()
fillMeasurements()

# required so we can do the changes
mydb.commit()
mydb.close()

### NAISU!!! ###
