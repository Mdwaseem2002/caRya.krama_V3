const fs = require('fs');
const pdf = require('pdf-parse');
const dataBuffer = fs.readFileSync('./Tata Sierra EV Premium-Inspection-Report.pdf');
pdf(dataBuffer).then(data => {
  console.log('Pages:', data.numpages);
  console.log('---TEXT START---');
  console.log(data.text);
  console.log('---TEXT END---');
}).catch(err => console.error(err));
