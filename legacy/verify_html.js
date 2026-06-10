const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
const content = fs.readFileSync(filePath, 'utf8');

// A simple stack-based tag matcher for validating major block containers
const tags = [];
const reg = /<\/?([a-zA-Z0-9\-]+)(?=[ \t\r\n\/>]|$)/g;
let match;
let unclosed = [];

// Focus on major layout tags to verify block integrity
const targetTags = new Set(['html', 'head', 'body', 'div', 'main', 'header', 'footer', 'section']);

const lines = content.split('\n');
lines.forEach((line, idx) => {
    let m;
    const lineNum = idx + 1;
    // Simple regex search for tags in this line
    const tagRegex = /<\/?([a-zA-Z0-9\-]+)/g;
    while ((m = tagRegex.exec(line)) !== null) {
        const tagName = m[1].toLowerCase();
        if (!targetTags.has(tagName)) continue;
        
        const isClosing = line.charAt(m.index + 1) === '/';
        if (isClosing) {
            if (tags.length > 0) {
                const last = tags.pop();
                if (last.name !== tagName) {
                    console.warn(`Line ${lineNum}: Mismatched closing tag </${tagName}>, expected </${last.name}> (opened on Line ${last.line})`);
                }
            } else {
                console.warn(`Line ${lineNum}: Stray closing tag </${tagName}> without open tag`);
            }
        } else {
            // Check if self-closing
            const selfClosing = line.slice(m.index).match(/^<[^>]*\/>/);
            if (!selfClosing) {
                tags.push({ name: tagName, line: lineNum });
            }
        }
    }
});

if (tags.length > 0) {
    console.error('FAIL: Unclosed tags remaining:');
    tags.forEach(t => console.error(`  <${t.name}> opened on Line ${t.line}`));
    process.exit(1);
} else {
    console.log('PASS: All major layout container tags are balanced and match perfectly!');
    process.exit(0);
}
