# Meteosuisse current weather 
Get current weather and 5 days forecast for a specific swiss postal code.

## Install
The npm commande will install puppeteer

    $ npm install

## Run

    $ node index.js 1214
  
  
## Result
Icon file (state_day_time_name.svg) downloaded in the directory (./datas/icons).    

Json file (./datas/state_day_time.json) created with the current weather and 5 days forecast:

    Vernier_mardi_12h00.json
    
    [  
       {  
          "city":"Vernier",
          "time":"12h00",
          "temp":"4° | 17°",
          "date":"mer",
          "desc":"assez ensoleillé, quelques passages nuageux",
          "icon":"https://www.meteosuisse.admin.ch/etc/designs/meteoswiss/assets/images/icons/meteo/weather-symbols/2.svg",
          "icon_local":"./datas/icons/Vernier_mer_12h00_2.svg"
       },
       {  
          "city":"Vernier",
          "time":"12h00",
          "temp":"10° | 17°",
          "date":"jeu",
          "desc":"ensoleillé",
          "icon":"https://www.meteosuisse.admin.ch/etc/designs/meteoswiss/assets/images/icons/meteo/weather-symbols/1.svg",
          "icon_local":"./datas/icons/Vernier_jeu_12h00_1.svg"
       },
       {  
          "city":"Vernier",
          "time":"12h00",
          "temp":"7° | 17°",
          "date":"ven",
          "desc":"ensoleillé",
          "icon":"https://www.meteosuisse.admin.ch/etc/designs/meteoswiss/assets/images/icons/meteo/weather-symbols/1.svg",
          "icon_local":"./datas/icons/Vernier_ven_12h00_1.svg"
       },
       {  
          "city":"Vernier",
          "time":"12h00",
          "temp":"12° | 13°",
          "date":"sam",
          "desc":"très nuageux, pluie continue ",
          "icon":"https://www.meteosuisse.admin.ch/etc/designs/meteoswiss/assets/images/icons/meteo/weather-symbols/20.svg",
          "icon_local":"./datas/icons/Vernier_sam_12h00_20.svg"
       },
       {  
          "city":"Vernier",
          "time":"12h00",
          "temp":"7° | 9°",
          "date":"dim",
          "desc":"très nuageux, faibles pluies",
          "icon":"https://www.meteosuisse.admin.ch/etc/designs/meteoswiss/assets/images/icons/meteo/weather-symbols/14.svg",
          "icon_local":"./datas/icons/Vernier_dim_12h00_14.svg"
       },
       {  
          "city":"Vernier",
          "time":"12h00",
          "temp":"12",
          "date":"mardi",
          "desc":"ensoleillé",
          "icon":"https://www.meteosuisse.admin.ch/etc/designs/meteoswiss/assets/images/icons/meteo/weather-symbols/1.svg",
          "icon_local":"./datas/icons/Vernier_mardi_12h00_1.svg"
       }
    ]



