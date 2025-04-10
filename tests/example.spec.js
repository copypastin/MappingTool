// @ts-check
import { test, expect } from '@playwright/test';
import { TIMEOUT } from 'dns';
import fs from 'fs';

const BASE_COORDS = {
    X1: 12296,
    Z1: -2244,
    X2: 12497,
    Z2: -2576,
};

test('basic test', async ({ page }) => {
    try {
        await page.goto('http://76.164.199.217:31820/', { waitUntil: 'domcontentloaded' });
        await page.click('div[title="Player-List"]');
    
        const users = await page.$$eval('div.label', elements => 
            elements.filter(el => el instanceof HTMLElement).map(el => el.innerText)
        );
        const coords = await page.$$eval('div.stats', elements => 
            elements.filter(el => el instanceof HTMLElement).map(el => el.innerText)
        );
    
        const data = [];
        const foundInArea = [];
    
        users.forEach((user, i) => {
            const coord = coords[i];
            const prettyName = coord.replace(/[()]/g, '').replace(/ \| /g, ', ');
            const [x, , z] = prettyName.split(', ').map(Number);
            data.push({ user, coord: [x, z] });
            if (x > BASE_COORDS.X1 && x < BASE_COORDS.X2 && z < BASE_COORDS.Z1 && z > BASE_COORDS.Z2) {
                foundInArea.push({ user, prettyName });
            }
        });
    
        if (foundInArea.length > 0) {
            const message = foundInArea
                .map(({ user, prettyName }) => `Found ${user} in the Taiwan! (${prettyName})`)
                .join('\n');
            console.log(message);
        }
    
        console.log(data)
        fs.writeFileSync('data/players.json', JSON.stringify(data, null, 2), 'utf-8');
    
        // add new row to data with timestamp
        const timestamp = new Date().toISOString();
        data.push({ timestamp });
    
    
        let fileIndex = 1;
        
        let newFileName = `data/logs/players_${fileIndex}.json`;
        while (fs.existsSync(newFileName)) {
            fileIndex++;
            newFileName = `data/logs/players_${fileIndex}.json`;
        }
        fs.writeFileSync(newFileName, JSON.stringify(data, null, 2), 'utf-8');
    
    
        await page.close();
    } catch (error) {
        setTimeout(() => {
            console.error('Error during test execution:', error);
            page.close();
        }, 5000);
        
    }
   
});
