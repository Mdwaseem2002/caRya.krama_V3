const fs = require('fs');
const path = require('path');
function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
        }
    });
    return results;
}
const files = walk(path.join(process.cwd(), 'src'));
console.log('Found ' + files.length + ' files');
let changed = 0;
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content.replace(/#fe2c55/gi, '#0059A3');
    newContent = newContent.replace(/dark:[a-zA-Z0-9_\/\-\[\]#]+/g, '');
    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        changed++;
    }
});
console.log('Changed ' + changed + ' files');
