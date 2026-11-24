// Bundles the Lucide icons (ISC license, https://lucide.dev) used by the videos into icons.js. Run: npm i lucide-static && node build-icons.js
const fs = require('fs'), map = { check: 'check', calendar: 'calendar-check', doc: 'file-text', gear: 'settings', bolt: 'zap', search: 'search', person: 'user', chat: 'mail' };
const out = {}; for (const [k, f] of Object.entries(map)) out[k] = fs.readFileSync(`node_modules/lucide-static/icons/${f}.svg`, 'utf8').replace(/\s+/g, ' ');
fs.writeFileSync('icons.js', 'window.ICONS=' + JSON.stringify(out) + ';\n'); console.log('icons.js', Object.keys(out).join(','));
