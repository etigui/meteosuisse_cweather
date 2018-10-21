const puppeteer = require('puppeteer');

(async function main(){
    try{
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        page.setUserAgent('Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.67 Safari/537.36');
        
        await page.setCookie({
          "value": "%5B%7B%22id%22%3A121900%2C%22label%22%3A%22Le%20Lignon%22%7D%5D",
          "expires": 1510321201,
          "domain": "www.meteosuisse.admin.ch",
          "name": "met_last-locations"
        })
        
        await page.goto('https://www.meteosuisse.admin.ch/home/meteo/previsions.html');
        await page.waitForSelector('.section');
        
        const sections = await page.$$('.section');
        console.log(sections.length);
        
        for(const section of sections){       
            const button = await section.$('a.weather-widget__warning__tooltip');

            if(button != null){
                button.click();
            }      
        }
        
        
        /*const ass = await page.$$('#weather-widget > a');
        console.log(ass.length);
        
        for(const section of ass){
            const button = await section.$('a.weather-widget__warning__tooltip');
            button.click();
        }*/
        
        
    }catch(error){
        console.log('error: ', error)
        
}
})();