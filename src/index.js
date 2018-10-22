const puppeteer = require('puppeteer');
const fs = require('fs');

(async function main(){
    
    const location = parseInt(process.argv[2]); 
    const swiss_meteo_url = 'https://www.meteosuisse.admin.ch/home/meteo/previsions.html';
    
    if(location){

        try{

            console.log(location);
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

            // Check user location
            const options = await page.$$('.autocomplete-list > li');
            if(options){
                
                // Get user location
                const location_infos = await page.evaluate(el => el.innerText, options[0]);
                if(options.length == 0 || location_infos == "Localité introuvable"){
                    console.log('Postal code not found');
                    process.exit(1);
                }else{

                    // Set location with postal code
                    await page.evaluate(() => {
                        const element = document.querySelector('input.locationChangeSubmit');
                        element.click();
                        return true;
                    });

                    // Navigate on current weather widget and wait for link
                    await page.goto(swiss_meteo_url);
                    await page.waitForSelector('.weather-widget__title');

                    // Get current weather infos                
                    const c_city = await page.evaluate(el => el.innerText, await page.$('.weather-widget__title'));
                    const c_temp = await page.evaluate(el => el.innerText, await page.$('.weather-widget__actual-weather__temp'));
                    const c_desc = await page.evaluate(el => el.innerText, await page.$('.weather-widget__actual-weather__desc'));
                    const c_date = await page.evaluate(el => el.innerText, await page.$('.weather-widget__date'));
                    
                    
                    /*const img = await page.$$('.weather-widget__forecast__list-item > img');
                    console.log(img.length);
                    for(let i = 0; i < img.length; i++){
                        const x = await page.evaluate(el => el.src, img[i]);
                        console.log(x);
                    }*/
                    
                    const data = await page.evaluate(() => {
                        const tds = Array.from(document.querySelectorAll('.weather-widget__forecast__list-item > strong'))
                        return tds.map(td => td.innerText)
                    });
                    
                    
                    const datas = await page.evaluate(() => {
                        const tds = Array.from(document.querySelectorAll('.weather-widget__forecast__list-item > img'))
                        return tds.map(td => td.src)
                    });
                    
                    
                    const datad = await page.evaluate(() => {
                        const tds = Array.from(document.querySelectorAll('.weather-widget__forecast__list-item > img'))
                        return tds.map(td => td.title)
                    });
                    
                    
                    const dataf = await page.evaluate(() => {
                        const tds = Array.from(document.querySelectorAll('.weather-widget__forecast__list-item > span'))
                        return tds.map(td => td.innerText)
                    });
                    console.log(dataf);
                    
                    const c_image = await page.evaluate(el => el.src, await page.$('.weather-widget__actual-weather__img'));
                    
                    
                    datas.push(c_image);
                    console.log(datas);
                    
                    
                    var viewSource = await page.goto(c_image);
                    fs.writeFile("./" + c_image.split('/').pop(), await viewSource.buffer(), function(err) {
                        if(err) {
                        return console.log(err);
                        }

                        console.log("The file was saved!");
                    });
                    
                    
                    console.log(c_city + ' ' + c_desc + ' ' + c_temp +  ' ' + c_date + c_image);

                }
            }
            await browser.close();
            

        }catch(error){
            console.log('Error: ', error)

        }
    }else{
        console.log('You must add a valid swiss postal code');
        process.exit(1);
    }
    
})();