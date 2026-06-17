const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldH1Class = 'class="text-5xl md:text-display-lg font-display-lg-mobile text-on-surface leading-[1.05] max-w-4xl"';
const newH1Class = 'class="text-5xl font-extrabold md:text-display-lg font-display-lg-mobile text-on-surface leading-[1.05] max-w-4xl"';

const oldSpanClass = 'class="text-5xl md:text-display-lg font-display-lg-mobile text-on-surface leading-tight"';
const newSpanClass = 'class="text-5xl font-extrabold md:text-display-lg font-display-lg-mobile text-on-surface leading-tight"';

if (html.includes(oldH1Class)) {
    html = html.replace(oldH1Class, newH1Class);
    console.log("Replaced H1 class.");
}

if (html.includes(oldSpanClass)) {
    html = html.replace(oldSpanClass, newSpanClass);
    console.log("Replaced span class.");
}

fs.writeFileSync('index.html', html);
