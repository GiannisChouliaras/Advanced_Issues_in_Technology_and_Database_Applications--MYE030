array = []

#TODO fill with 9 more indicator codes & 9 country codes
indicators = ["NE.TRD.GNFS.ZS","TX.VAL.AGRI.ZS.UN","TM.VAL.FUEL.ZS.UN","TM.VAL.FOOD.ZS.UN",
              "SE.PRM.TCHR","FP.CPI.TOTL.ZG","FI.RES.TOTL.CD","SP.URB.TOTL.IN.ZS", "SP.POP.TOTL.MA.IN","SP.POP.TOTL.FE.ZS"]

countryFiles = ["API_GRC_DS2_en_csv_v2_822242.csv","API_DNK_DS2_en_csv_v2_896440.csv","API_GBR_DS2_en_csv_v2_889829.csv",
"API_IND_DS2_en_csv_v2_892624.csv","API_ITA_DS2_en_csv_v2_821753.csv","API_JPN_DS2_en_csv_v2_888431.csv","API_SWE_DS2_en_csv_v2_888864.csv",
"API_URY_DS2_en_csv_v2_898732.csv","API_USA_DS2_en_csv_v2_888413.csv","API_ZAF_DS2_en_csv_v2_888762.csv"]


def bigParser():
    numberOfLoop = 0  # check if first country in loop so that it writes down the indicators file
    for i in countryFiles:
        for j in indicators:
            file = open(i, "r")
            file = file.readlines()
            for x in range(0, 5):
                del file[0]
            for line in file:
                fields = line.split("\",\"")
                if fields[3] == j:
                    if numberOfLoop == 0:
                        writeIndicator(line)
                    array = parser(line)
                    writer(array)
        numberOfLoop += 1


def parser(line):
    x = line.split("\",\"")
    startingYear = 1960
    j = 0
    count = 0
    countryC = x[1]
    indC = x[3]
    y = []
    for i in x:
        if j==0 or j==1 or j==2 or j==3:
            pass
        else:
            if(i==""):
                z = countryC  + "," + indC + "," + "\"" + str(startingYear) + "\"" + "," + "\"0\""
            elif(i=="\",\n"):
                z = countryC  + "," + indC + "," + "\"" + str(startingYear) + "\"" + "," + "\"0\""
            else:
                if("\",\n" in i):
                    z = countryC + "," + indC + "," + "\"" + str(startingYear) + "\"" + "," + i.replace("\",\n", "")
                else:
                    z = countryC + "," + indC + "," + "\"" + str(startingYear) + "\"" + "," + i
            y.append(z)
            startingYear+=1
            count+=1
        j+=1
    return y


def writer(array):
    for i in array:
        f.write(i)
        f.write("\n")


def writeCountries():
    for i in countryFiles:
        file = open(i, "r")
        file = file.readlines()
        f.write(file[5].split(",")[0] + "," + file[5].split(",")[1])
        f.write("\n")


def writeIndicator(line):
    line = line.split("\",\"")
    indicatorFile.write(line[2].replace(",", "-") + ",\"" + line[3] + "\"")
    indicatorFile.write("\n")


def writeYears():
    startingYear5 = 60
    startingYear10 = 60
    startingYear20 = 60
    break5 = 0
    break10 = 0
    break20 = 0
    yearsFile = open("years.csv", "w")
    for i in range(1960,2020):

        if i < 1980:
            yearsFile.write(str(i) + "," + "\"" + str(startingYear5) + "-" + str(startingYear5 + 4) + "\"" + "," + "\"" + str(
                startingYear10) + "-" + str(startingYear10 + 9) + "\"" + "," + "\"" + str(startingYear20) + "-" + str(
                startingYear20 + 19) + "\"" )
        elif i >= 1980 and i<=1999:
            if i >= 1990:
                yearsFile.write(
                    str(i) + "," + "\"" + str(startingYear5) + "-" + str(startingYear5 + 4) + "\"" +  "," + "\"" + str(
                        startingYear10) + "-" + str(99) + "\"" +  "," + "\"" + str(startingYear20) + "-" + str(
                        99) +"\"")
            else:
                yearsFile.write(
                    str(i) + "," + "\"" + str(startingYear5) + "-" + str(startingYear5 + 4) + "\"" +  "," + "\"" + str(
                        startingYear10) + "-" + str(startingYear10 + 9) + "\"" + "," + "\"" + str(startingYear20) + "-" + str(
                        99) + "\"")
        else:
            if i == 2000:
                startingYear5 = 0
                startingYear10 = 0
                startingYear20 = 0

            if i >= 2010:
                yearsFile.write(str(i) + "," + "\"" + str(startingYear5) + "-" + str(
                    startingYear5 + 4) + "\"" + "," + "\"" + str(
                    startingYear10) + "-" +  str(startingYear10 + 9) + "\"" + "," + "\"" + "0" + str(
                    startingYear20) + "-" + str(
                    startingYear20 + 19) + "\"")
            else:
                yearsFile.write(str(i) + "," + "\"" + "0" + str(startingYear5) + "-" + "0" + str(
                    startingYear5 + 4) + "\"" + "," + "\"" + "0" + str(
                    startingYear10) + "-" + "0" + str(startingYear10 + 9) + "\"" + "," + "\"" + "0" + str(
                    startingYear20) + "-" + str(
                    startingYear20 + 19) +"\"")

        break5 += 1
        break10 += 1
        break20 += 1
        if break5 == 5:
            break5 = 0
            startingYear5 += 5
        if break10 == 10:
            break10 = 0
            startingYear10 += 10
        if break20 == 20:
            break20 = 0
            startingYear20 += 20

        yearsFile.write("\n")


indicatorFile = open("indicators.csv", "w")
f = open("measurements.csv", "w")
bigParser()
f.close()
f = open("countries.csv", "w")
writeCountries()
f.close()
writeYears()
