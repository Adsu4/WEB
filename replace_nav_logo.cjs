const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetBlock = `<div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-sm shadow-primary/20">
                <span class="material-symbols-outlined text-xl">memory</span>
            </div>
            <div class="hidden sm:block">
                <div class="font-bold text-[13px] text-primary tracking-wide leading-tight">BFIOT</div>
                <div class="text-[11px] text-on-surface-variant leading-tight">Beginners Formula to IoT</div>
            </div>
        </div>`;

const newBlock = `<div class="flex items-center">
            <img src="logo.png" alt="Beginners Formula to IoT" class="h-10 w-auto object-contain">
        </div>`;

if (html.includes(targetBlock)) {
    html = html.replace(targetBlock, newBlock);
    fs.writeFileSync('index.html', html);
    console.log("Replaced nav logo");
} else {
    // Try with CRLF
    const crlfTarget = targetBlock.replace(/\n/g, '\r\n');
    if (html.includes(crlfTarget)) {
        html = html.replace(crlfTarget, newBlock.replace(/\n/g, '\r\n'));
        fs.writeFileSync('index.html', html);
        console.log("Replaced nav logo (CRLF)");
    } else {
        console.log("Could not find the target block in index.html");
    }
}
