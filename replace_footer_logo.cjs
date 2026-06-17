const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetBlock = `<div class="font-bold text-primary mb-2 flex items-center gap-2">
                    <span class="material-symbols-outlined">memory</span>
                    BFIOT
                </div>`;

const newBlock = `<div class="mb-3 flex items-center">
                    <img src="logo.png" alt="Beginners Formula to IoT" class="h-8 w-auto object-contain">
                </div>`;

if (html.includes(targetBlock)) {
    html = html.replace(targetBlock, newBlock);
    fs.writeFileSync('index.html', html);
    console.log("Replaced footer logo");
} else {
    // Try with CRLF
    const crlfTarget = targetBlock.replace(/\n/g, '\r\n');
    if (html.includes(crlfTarget)) {
        html = html.replace(crlfTarget, newBlock.replace(/\n/g, '\r\n'));
        fs.writeFileSync('index.html', html);
        console.log("Replaced footer logo (CRLF)");
    } else {
        console.log("Could not find the target block in index.html");
    }
}
