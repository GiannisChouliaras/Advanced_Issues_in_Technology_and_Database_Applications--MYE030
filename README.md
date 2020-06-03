# CARPE NOCTEM

## Description
This project implements a simple webpage where you can select some countries, some indicators and display the measurements via graphs.

## Installation
1. Install Python and MySQL
2. Install node.js (visit the page [here](https://nodejs.org/en/download/).)
3. Install Angular
  * npm install
  * npm install -g @angular/cli
  * npm install -g @angular/cli@next (to install the latest version of angular)


## Usage
For this version the usage is:
1. Start your DBMS (MySQL) service, if not running
2. Create an empty Database (CREATE DATABASE db_name;)
  * NOTE: Change the fields for connecting to the database appropriately in the python files and server/database.js
3. navigate to the python files via terminal:
  * run: $python3 CorrectCSVFormat.py
  * and then: $python3 fillDatabase.py
  * At this point database should not be empty but filled with data from csv files.
4. Navigate via terminal inside the folder "server" (contains   database.js which is the API implementation)
  * run the command $npm run dev
  * "dev" is a small script where you can find it in package.json (line 11)
  * API will now listen at port 8000. Do not close this terminal tab.
5. To start the server:
  * open a new terminal tab
  * navigate to the project folder
  * run the command $ng serve -o
  * wait a few seconds, the compile of the project will start and the page localhost:4200 will open in your default browser.

## Versions
### v.1 [June 2020]
In the course "Advanced technology and database applications, we were asked to design and implement an integrated information system. The goal was to start with simple specifications and come up with an integrated system.

## Video and Report
You can find the video link and the report of the project in the folder Deliverables or click [here](https://github.com/GiannisChouliaras/Advanced_Issues_in_Technology_and_Database_Applications--MYE030/tree/master/Deliverables)

## Built With :
### For The Database
* [Python](https://www.python.org/)
* [MySQL](https://www.mysql.com/)

### For the Webpage:
* [Angular](https://angular.io/)
* [node.js](https://nodejs.org/en/)

### For graphs:
* [beloved D3.js](https://d3js.org/)

## Developer Team:
* **Gkitsakis Dimos** - AM: 2425
* **Kaloudis Spyridon** - AM: 2447
* **Chouliaras Ioannis** - AM: 2631
