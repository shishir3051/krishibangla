const fs = require('fs');

const path = './data/districtsData.js';
let content = fs.readFileSync(path, 'utf8');

const lines = content.split('\n');
let modified = [];
let inDistrict = null;
let currentCrops = '';
let hasCalendar = false;

for (let line of lines) {
  const match = line.match(/^\s*"([\w\s']+)":\s*\{/);
  if (match) {
    inDistrict = match[1];
    currentCrops = '';
    hasCalendar = false;
    modified.push(line);
    continue;
  }
  
  if (inDistrict) {
    if (line.includes('crops:')) currentCrops = line;
    if (line.includes('calendar:')) hasCalendar = true;
    
    if (line.match(/^\s*\}/)) {
      if (!hasCalendar) {
        let cropsLower = currentCrops.toLowerCase();
        let calendarStr = 'Planting: Dec-Jan; Harvest: Apr-May';

        if (cropsLower.includes('mango') || cropsLower.includes('litchi') || cropsLower.includes('jackfruit')) {
          calendarStr = 'Flowering: Feb-Mar; Harvest: Jun-Jul';
        } else if (cropsLower.includes('tea')) {
          calendarStr = 'Pruning: Dec-Feb; Plucking: Mar-Nov';
        } else if (cropsLower.includes('potato') || cropsLower.includes('vegetables') || cropsLower.includes('tomato')) {
          calendarStr = 'Planting: Oct-Nov; Harvest: Feb-Mar';
        } else if (cropsLower.includes('boro') || cropsLower.includes('rice')) {
          calendarStr = 'Planting: Dec-Feb; Harvest: Apr-May';
        } else if (cropsLower.includes('jute')) {
          calendarStr = 'Planting: Mar-Apr; Harvest: Jul-Aug';
        } else if (cropsLower.includes('wheat') || cropsLower.includes('maize') || cropsLower.includes('corn')) {
          calendarStr = 'Planting: Nov-Dec; Harvest: Mar-Apr';
        } else if (cropsLower.includes('shrimp') || cropsLower.includes('fish')) {
          calendarStr = 'Stocking: Mar-Apr; Harvest: Nov-Dec';
        }

        let inject = `    calendar: '${calendarStr}'`;
        let lastLine = modified.pop();
        if (!lastLine.trim().endsWith(',')) lastLine += ',';
        modified.push(lastLine);
        modified.push(inject);
      }
      inDistrict = null;
    }
  }
  
  modified.push(line);
}

fs.writeFileSync(path, modified.join('\n'));
console.log('Calendar data injected successfully');
