import fs from 'node:fs';
const path = 'data/logs';
const allData = [];
const allCoords = [];

const TARGET = "UpcastRumble"

fs.readdirSync(path).forEach(file => {
    if (file.endsWith('.json')) { // only read json files
        const filePath = `${path}/${file}`;
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (Array.isArray(data)) {
            allData.push(...data); // add all the data to the coord array
        } else {
            console.error(`Data in ${file} is not an array`);
        }
    }
}
);
console.log(`Loaded ${allData.length} data values from ${fs.readdirSync(path).filter(file => file.endsWith('.json')).length} files.`);

allData.forEach(entry => {
    if(entry.coord && entry.user == TARGET) allCoords.push(entry.coord); 
});

console.log(`Extracted ${allCoords.length} coordinates from the data.`);

let csvFormat =  "x, z\n"

allCoords.forEach(coord => {
    if (coord && coord.length === 2) csvFormat += `${coord[0]}, ${coord[1]}\n`; // format as x, z
    
    // else {
    //     console.error(`Invalid coordinate found: ${coord}`);
    // }
}
);

// Save the CSV format to a file
console.log(`Saving coordinates to data/${TARGET}coords.csv...`);
fs.writeFileSync(`data/${TARGET}coords.csv`, csvFormat, 'utf8');

