const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetBlock = `<a class="font-body-md text-[13px] font-semibold text-on-surface-variant hover:text-primary transition-colors" href="#">Shipping Info</a>`;
const newBlock = `<a class="font-body-md text-[13px] font-semibold text-on-surface-variant hover:text-primary transition-colors" href="https://trackbfiot.vercel.app/">Shipping Info</a>`;

if (html.includes(targetBlock)) {
    html = html.replace(targetBlock, newBlock);
    fs.writeFileSync('index.html', html);
    console.log("Updated Shipping Info link");
} else {
    // Try with CRLF just in case (though it's a single line so it might not matter)
    const crlfTarget = targetBlock.replace(/\n/g, '\r\n');
    if (html.includes(crlfTarget)) {
        html = html.replace(crlfTarget, newBlock.replace(/\n/g, '\r\n'));
        fs.writeFileSync('index.html', html);
        console.log("Updated Shipping Info link (CRLF)");
    } else {
        console.log("Could not find the target string in index.html");
    }
}
