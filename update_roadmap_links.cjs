const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(
    /<a class="text-on-surface-variant font-label-mono text-\[11px\] font-bold hover:text-primary transition-colors tracking-widest uppercase" href="#roadmap">Roadmap<\/a>/g,
    '<a class="text-on-surface-variant font-label-mono text-[11px] font-bold hover:text-primary transition-colors tracking-widest uppercase" href="https://learn.bfiot.app">Roadmap</a>'
);

html = html.replace(
    /<a class="bg-white border border-outline-variant\/60 hover:border-primary text-on-surface px-8 py-4 rounded-full font-body-md font-bold text-center transition-all duration-300 hover:bg-surface-container flex items-center justify-center gap-2 shadow-sm" href="#roadmap">/g,
    '<a class="bg-white border border-outline-variant/60 hover:border-primary text-on-surface px-8 py-4 rounded-full font-body-md font-bold text-center transition-all duration-300 hover:bg-surface-container flex items-center justify-center gap-2 shadow-sm" href="https://learn.bfiot.app">'
);

fs.writeFileSync('index.html', html);
console.log("Updated hrefs to https://learn.bfiot.app");
