const fs = require('fs');

const path = './data/districtsData.js';
let content = fs.readFileSync(path, 'utf8');

const lines = content.split('\n');
let modified = [];
let inDistrict = null;

for (let line of lines) {
  const match = line.match(/^\s*"([\w\s']+)":\s*\{/);
  if (match) {
    inDistrict = match[1];
    modified.push(line);
    continue;
  }
  
  if (inDistrict && line.match(/^\s*\}/)) {
    let quality = 'A';
    let fertility = '80%';
    let water = 'Medium';
    let exportPot = '85%';
    let growth = '+8.5%';
    let tier = 'Tier 2';

    if (['Rajshahi', 'Chapai Nawabganj', 'Naogaon', 'Natore', 'Dinajpur'].includes(inDistrict)) {
      quality = 'A+'; fertility = '88%'; water = 'Low (Barind)'; exportPot = '95%'; growth = '+14.2%'; tier = 'Tier 1';
    } else if (['Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj'].includes(inDistrict)) {
      quality = 'A'; fertility = '82%'; water = 'High (Haor)'; exportPot = '90%'; growth = '+10.1%'; tier = 'Tier 1';
    } else if (['Chittagong', "Cox's Bazar", 'Noakhali', 'Feni', 'Lakshmipur'].includes(inDistrict)) {
      quality = 'B+'; fertility = '75%'; water = 'Saline Intrusion'; exportPot = '88%'; growth = '+7.4%'; tier = 'Tier 2';
    } else if (['Khulna', 'Satkhira', 'Bagerhat', 'Jessore'].includes(inDistrict)) {
      quality = 'A-'; fertility = '78%'; water = 'Saline/Mixed'; exportPot = '94%'; growth = '+12.8%'; tier = 'Tier 1';
    } else if (['Dhaka', 'Gazipur', 'Narayanganj', 'Munshiganj', 'Tangail'].includes(inDistrict)) {
      quality = 'A+'; fertility = '92%'; water = 'Optimal'; exportPot = '91%'; growth = '+11.5%'; tier = 'Tier 1';
    } else if (['Barisal', 'Bhola', 'Patuakhali', 'Pirojpur', 'Barguna', 'Jhalokati'].includes(inDistrict)) {
      quality = 'A'; fertility = '85%'; water = 'High (Riverine)'; exportPot = '82%'; growth = '+9.3%'; tier = 'Tier 2';
    } else if (['Mymensingh', 'Netrokona', 'Sherpur', 'Jamalpur'].includes(inDistrict)) {
      quality = 'A'; fertility = '86%'; water = 'Optimal'; exportPot = '87%'; growth = '+10.4%'; tier = 'Tier 2';
    }

    let inject = `    qualityScore: '${quality}', fertility: '${fertility}', waterTable: '${water}', exportPotential: '${exportPot}', growthForecast: '${growth}', exportTier: '${tier}'`;
    
    let lastLine = modified.pop();
    if (!lastLine.trim().endsWith(',')) {
      lastLine += ',';
    }
    modified.push(lastLine);
    modified.push(inject);
    
    inDistrict = null;
  }
  
  modified.push(line);
}

fs.writeFileSync(path, modified.join('\n'));
console.log('Done augmenting districtsData.js!');
