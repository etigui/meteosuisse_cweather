const puppeteer = require('puppeteer');

(async function main(){
    
    const location = parseInt(process.argv[2]); 
    
    if(location){

        try{

            console.log(location);
            const browser = await puppeteer.launch({headless: false});
            const page = await browser.newPage();

            // Act like nomal browser not as bot 
            page.setUserAgent('Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.67 Safari/537.36');

            // Navigate on current weather widget and wait for link
            await page.goto('https://www.meteosuisse.admin.ch/home/meteo/previsions.html');
            await page.waitForSelector('a.weather-widget__warning__tooltip');

            
            // Get form to set location
            const button_change_location = await page.$('a.weather-widget__warning__tooltip');
            button_change_location.click();
            await page.waitForSelector('a.weather-widget__warning__tooltip');
            

            // Write location with postal code and show dropdown choices    
            await page.evaluate((location) => {
                document.querySelector('input.locationChangeInput').value = location;
            }, location);
            await (await page.$( 'input.locationChangeInput' )).press('ArrowLeft');

            // Check and get location from user
            const options = await page.$$('.autocomplete-list > li');
            const location_infos = await page.evaluate(el => el.innerText, options[0]);

            if(options.length == 0 || location_infos == "Localité introuvable"){
                console.log('Postal code not found');
                process.exit(1);
            }else{

                // Get location infos
                const postal_code = location_infos.substring(0, 4);
                const state = location_infos.substring(5);

                // Set location with postal code
                const button_set_location = await page.$('input.locationChangeSubmit');
                button_set_location.click();
                await page.waitForSelector('input.locationChangeSubmit');

                // Navigate on current weather widget and wait for link
                await page.goto('https://www.meteosuisse.admin.ch/home/meteo/previsions.html');
                await page.waitForSelector('.weather-widget__title');

                // Get current weather infos                
                const city = await page.evaluate(el => el.innerText, await page.$('.weather-widget__title'));
                const c_temp = await page.evaluate(el => el.innerText, await page.$('.weather-widget__actual-weather__temp'));
                const desc = await page.evaluate(el => el.innerText, await page.$('.weather-widget__actual-weather__desc'));
                console.log(city + ' ' + desc + ' ' + c_temp);

            }
            

        }catch(error){
            console.log('Error: ', error)

        }
    }else{
        console.log('You must add a valid swiss postal code');
        process.exit(1);
    }
    await browser.close();
})();