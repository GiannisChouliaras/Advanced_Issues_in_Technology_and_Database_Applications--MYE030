#!/bin/bash

python3 CorrectCSVFormat.py
sleep $3
python3 fillDatabase.py
echo "Filled the database correctly"