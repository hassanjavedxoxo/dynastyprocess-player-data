const puppeteer = require('puppeteer');

async function scrapePlayerData() {
    const browser = await puppeteer.launch({ headless: false }); // Set to true for headless mode
    const page = await browser.newPage();

    try {
        // Step 1: Navigate to the webpage
        await page.goto('https://calc.dynastyprocess.com/'); // Replace with the actual URL

        // Step 2: Wait for the tab link and click it
        await page.waitForSelector('a[data-tab="#tabs-Values"]'); // Replace with the actual selector
        await page.click('a[data-tab="#tabs-Values"]');

        // Step 3: Wait for the table rows to load
        await page.waitForSelector('tr'); // Adjust selector if necessary

        // Step 4: Extract the data
        const data = await page.evaluate(() => {
            // Select all rows in the table
            const rows = Array.from(document.querySelectorAll('tr'));

            // Extract relevant data from each row
            return rows.map(row => {
                const name = row.querySelector('.label-cell')?.textContent.trim();
                const age = row.querySelectorAll('.numeric-cell')[0]?.textContent.trim();
                const value = parseInt(row.querySelectorAll('.numeric-cell')[1]?.textContent.trim());

                return { name, age, value };
            }).filter(item =>  item !== null).filter(item => item.name !== "Player"); // Filter out empty rows and heading
            
        });

        // Step 5: Save data to a JSON file
        const fs = require('fs');
        fs.writeFileSync('dynastyProcessJSON.json', JSON.stringify(data, null, 2));
        console.log('Data saved to dynastyProcessJSON.json');

    } catch (error) {
        console.error('Error during scraping:', error.message);
    } finally {
        await browser.close();
    }
}

scrapePlayerData();
