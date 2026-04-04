const fs = require('fs');
let content = fs.readFileSync('src/Details/CallUs/Callus.tsx', 'utf8');

// remove standard dark: classes
content = content.replace(/dark:[a-zA-Z0-9\-\/\[\]\#\.]+/g, '');

// clean up specific dark theme conditional checks
content = content.replace(/\(?document\.documentElement\.classList\.contains\('dark'\)\s*\?\s*['"]rgba\(255,\s*255,\s*255,\s*0\.1\)['"]\s*:\s*['"]#e5e7eb['"]\)?/g, "'#e5e7eb'");
content = content.replace(/\(?document\.documentElement\.classList\.contains\('dark'\)\s*\?\s*['"]white['"]\s*:\s*['"]#111827['"]\)?/g, "'#111827'");
content = content.replace(/\(?document\.documentElement\.classList\.contains\('dark'\)\s*\?\s*['"]#a1a1aa['"]\s*:\s*['"]#374151['"]\)?/g, "'#374151'");

// clean up multiple spaces left by regex
content = content.replace(/ \s+/g, ' ');

fs.writeFileSync('src/Details/CallUs/Callus.tsx', content, 'utf8');
