import fs from 'node:fs';
const engine=fs.readFileSync('engine.mjs','utf8').replace(/export /g,'');
const html=fs.readFileSync('page.html','utf8');
fs.writeFileSync('worker/index.js',engine+'\nconst HTML='+JSON.stringify(html)+';\n'+fs.readFileSync('server.mjs','utf8'));
