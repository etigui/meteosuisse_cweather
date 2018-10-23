const puppeteer = require('puppeteer');
const fs = require('fs');

(async function main(){
    
    const location = parseInt(process.argv[2]); 
    const swiss_meteo_url = 'https://www.meteosuisse.admin.ch/home/meteo/previsions.html';
    
    if(location){

        try{
            const browser = await puppeteer.launch({headless: true});
            const page = await browser.newPage();

            // Act like nomal browser not as bot 
            page.setUserAgent('Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.67 Safari/537.36');

            // Navigate on current weather widget and wait for link
            await page.goto(swiss_meteo_url);
            await page.waitForSelector('a.weather-widget__warning__tooltip');

            // Get form to set location
            const button_change_location = await page.$('a.weather-widget__warning__tooltip');
            button_change_location.click();    

            // Write location with postal code and show dropdown choices    
            await page.evaluate((location) => {
                document.querySelector('input.locationChangeInput').value = location;
            }, location);
            await (await page.$( 'input.locationChangeInput' )).press('ArrowLeft');
            await page.waitForSelector('.autocomplete-list');
            
            // Check if Autocomplete list exist (chown)
            try {
                await page.waitForSelector('.autocomplete-list')
                
                            // Check user location
            const options = await page.$$('.autocomplete-list > li');
            if(options !== undefined){
                            
                // Get user location
                const location_infos = await page.evaluate(el => el.innerText, options[0]);
                if(options.length == 0 || location_infos == "Localité introuvable"){
                    console.log('Postal code not found');
                    process.exit(1);
                }else{

                    // Set location with postal code
                    await page.evaluate(() => {
                        const el = document.querySelector('input.locationChangeSubmit');
                        el.click();
                        return true;
                    });

                    // Navigate on current weather widget and wait for link
                    await page.goto(swiss_meteo_url);
                    await page.waitForSelector('.weather-widget__title');

                    // Get current weather infos
                    const c_city = await page.evaluate(el => el.innerText, await page.$('.weather-widget__title'));
                    const c_temp = await page.evaluate(el => el.innerText, await page.$('.weather-widget__actual-weather__temp'));
                    const c_desc = await page.evaluate(el => el.innerText, await page.$('.weather-widget__actual-weather__desc'));
                    let c_date = await page.evaluate(el => el.innerText, await page.$('.weather-widget__date'));
                    const c_icon = await page.evaluate(el => el.src, await page.$('.weather-widget__actual-weather__img'));
                    
                    // Format time and date
                    c_date = c_date.replace(',','.').replace(' ','');
                    const c_time = c_date.split('.')[1];
                    c_date = c_date.split('.')[0] + ".";
                                      
                    // Forecast icon
                    const f_icons = await page.evaluate(() => {
                        const els = Array.from(document.querySelectorAll('.weather-widget__forecast__list-item > img'));
                        return els.map(el => el.src);
                    });
                    
                    // Forecast icon alt text
                    const f_icons_desc = await page.evaluate(() => {
                        const els = Array.from(document.querySelectorAll('.weather-widget__forecast__list-item > img'));
                        return els.map(el => el.title);
                    });
                    
                    // Forecast temp
                    const f_temp = await page.evaluate(() => {
                        const els = Array.from(document.querySelectorAll('.weather-widget__forecast__list-item > span'));
                        return els.map(el => el.innerText);
                    });
                    
                    // Forecast day
                    const f_date = await page.evaluate(() => {
                        const els = Array.from(document.querySelectorAll('.weather-widget__forecast__list-item > strong'));
                        return els.map(el => el.innerText);
                    });
                                       
                    // Add current weather to array
                    f_icons.push(c_icon);
                    f_icons_desc.push(c_desc);
                    f_temp.push(c_temp);
                    f_date.push(c_date);
                                
                    // Array to store weather (current and forecast)
                    var weather = new Array();

                    // Download icons
                    for(let i = 0; i < f_icons.length; i++){  
                        var viewSource = await page.goto(f_icons[i]);
                        const icon_local = "./datas/icons/" + c_city + "_" + f_date[i].replace('.','_') + c_time + "_"+f_icons[i].split('/').pop();
                        fs.writeFile(icon_local, await viewSource.buffer(), function(err) {
                            if(err) {
                                return console.log(err);
                            }
                        }); 
                        
                        // Convert values to object
                        let obj = new Object();
                        obj.city = c_city;
                        obj.time = c_time;
                        obj.temp = f_temp[i];
                        obj.date = f_date[i].replace('.','');
                        obj.desc = f_icons_desc[i];
                        obj.icon = f_icons[i];
                        obj.icon_local = icon_local;
                        weather.push(obj);
                    }
                    
                    // Save weather to json file
                    fs.writeFile("./datas/"+ c_city + "_" + c_date.replace('.','_') + c_time + ".json", JSON.stringify(weather), 'utf8', function (err) {
                        if (err) {
                            return console.log(err);
                        }
                    });                 
                }
            }
            console.log("Swiss meteo widget saved");
            await browser.close();

            } catch (error) {
                console.log("Autocomplete list postal code error")
            }
        }catch(error){
            console.log('Error: ', error)

        }
    }else{
        console.log('You must add a valid swiss postal code');
        process.exit(1);
    }
})();