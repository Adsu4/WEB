const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf8');

// The tricky part on Windows is \r\n vs \n
// Let's replace the Cause rendering more safely by looking for "Cause:"
const lines = content.split('\n');
let modified = false;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('>Cause:<')) {
        // Find the start of the <p tag
        let startIdx = i;
        while (startIdx > 0 && !lines[startIdx].includes('<p')) {
            startIdx--;
        }
        
        // Find the end of the </p> tag
        let endIdx = i;
        while (endIdx < lines.length && !lines[endIdx].includes('</p>')) {
            endIdx++;
        }
        
        // We found the Cause <p> block
        if (!lines[startIdx - 1].includes('{f.cause && (')) {
            lines.splice(endIdx + 1, 0, '                                )}');
            lines.splice(startIdx, 0, '                                {f.cause && (');
            modified = true;
            break;
        }
    }
}

if (modified) {
    fs.writeFileSync('src/App.jsx', lines.join('\n'));
    console.log("Empty causes fixed properly.");
} else {
    console.log("Empty causes already fixed or not found.");
}
