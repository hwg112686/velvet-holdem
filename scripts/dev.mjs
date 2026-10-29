import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {localDB} from './db.mjs';
const DB=localDB(path.join(os.tmpdir(),'velvet-holdem-local.sqlite'));
http.createServer(async(req,res)=>{try{let chunks=[];for await(let chunk of req)chunks.push(chunk);let origin='http://'+req.headers.host;let request=new Request(origin+req.url,{method:req.method,headers:req.headers,...(['GET','HEAD'].includes(req.method)?{}:{body:Buffer.concat(chunks)})});let code=fs.readFileSync('worker/index.js','utf8');let w=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));let r=await w.default.fetch(request,{DB});res.writeHead(r.status,Object.fromEntries(r.headers));res.end(Buffer.from(await r.arrayBuffer()))}catch(e){res.writeHead(500);res.end(e.message)}}).listen(Number(process.env.PORT||(process.argv.includes('--port')?process.argv[process.argv.indexOf('--port')+1]:3000)||3000),'0.0.0.0',()=>console.log('Velvet preview ready'));
