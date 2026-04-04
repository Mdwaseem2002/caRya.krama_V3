const fs = require('fs');
let file = 'src/Details/CallUs/Callus.tsx';
let data = fs.readFileSync(file, 'utf8');

const darkClasses = [
  " dark:bg-[#0a0a0a]",
  " dark:shadow-none",
  " dark:border-white/10",
  " dark:text-white/70",
  " dark:text-white",
  " dark:bg-white/10",
  " dark:text-[#a1a1aa]",
  " dark:text-blue-400",
  " dark:bg-white/[0.03]",
  " dark:bg-blue-500/10",
  " dark:text-emerald-400",
  " dark:bg-white/[0.04]",
  " dark:bg-white/5"
];

darkClasses.forEach(cls => {
  data = data.split(cls).join('');
});

data = data.replace(/document\.documentElement\.classList\.contains\('dark'\) \? 'rgba\(255,255,255,0\.1\)' : '#e5e7eb'/g, "'#e5e7eb'");
data = data.replace(/document\.documentElement\.classList\.contains\('dark'\) \? 'white' : '#111827'/g, "'#111827'");
data = data.replace(/document\.documentElement\.classList\.contains\('dark'\) \? '#a1a1aa' : '#374151'/g, "'#374151'");

fs.writeFileSync(file, data);
