const fs = require('fs');
let file = 'src/data/mockJobs.ts';
let code = fs.readFileSync(file, 'utf8');

// Replace actionText: 'Click Here' with actionText: 'Registration / Login' for apply links
code = code.replace(/actionText: 'Click Here', type: 'apply'/g, "actionText: 'Registration / Login', type: 'apply'");
fs.writeFileSync(file, code, 'utf8');
console.log('Successfully updated actionText for apply links');
