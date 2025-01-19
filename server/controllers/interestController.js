const puppeteer = require('puppeteer');

const scrapeFixedDepositRates = async (req, res) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        
        await page.goto('https://www.stashaway.sg/r/singapore-fixed-deposit-rates', {
            waitUntil: 'networkidle2',
        });

        const rates = await page.evaluate(() => {
            const container = document.querySelector('.MuiTableContainer-root'); 
            if (!container) return []; 

            const rows = Array.from(container.querySelectorAll('tr.MuiTableRow-root')); 
            const data = [];
            let currentBank = null;

            rows.forEach(row => {
                const bankName = row.querySelector('td:nth-child(1)')?.innerText.trim();
                const tenure = row.querySelector('td:nth-child(2)')?.innerText.trim();
                const minAmount = row.querySelector('td:nth-child(4)')?.innerText.trim();
                const interestRate = row.querySelector('td:nth-child(3)')?.innerText.trim();

                if (bankName) {
                 
                    currentBank = {
                        bankName,
                        offers: [],
                    };
                    data.push(currentBank);
                }

               
                if (currentBank && tenure) {
                    currentBank.offers.push({ tenure, minAmount, interestRate });
                }
            });

            return data;
        });

        await browser.close();

        res.status(200).json({
            message: 'Successfully scraped fixed deposit rates',
            rates,
        });
    } catch (error) {
        console.error('Error scraping fixed deposit rates:', error.message);
        res.status(500).json({
            message: 'Failed to scrape fixed deposit rates',
            error: error.message,
        });
    }
};

module.exports = { scrapeFixedDepositRates };
