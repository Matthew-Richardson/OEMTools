const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
class Element{
 constructor(tag='div'){this.tag=tag;this.children=[];this.disabled=false;this.value='';this.classList={add(){},remove(){}}}
 append(...items){this.children.push(...items)} prepend(...items){this.children.unshift(...items)}
 replaceChildren(...items){this.children=items} setAttribute(){} click(){} remove(){}
 querySelectorAll(){return this.children.flatMap(e=>e instanceof Element?[...(['input','button'].includes(e.tag)?[e]:[]),...e.querySelectorAll()]:[])}
}
const elements=new Map();
const context=vm.createContext({console,TextDecoder,Uint8Array,Blob,URL,setTimeout,document:{querySelector(s){if(!elements.has(s))elements.set(s,new Element());return elements.get(s)},createElement:t=>new Element(t)}});
const html=fs.readFileSync('ctr-renamer.html','utf8');
const scripts=[...html.matchAll(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
scripts.forEach(s=>new vm.Script(s));
const duplicate=html.match(/<script id="duplicate-script">([\s\S]*?)<\/script>/)[1];
vm.runInContext(duplicate.replace(/^[\s]*\(function\(\)\{/, '').replace(/\}\)\(\);\s*$/, ''),context);
assert(html.includes('id="rename-tool"') && html.includes('id="duplicate-tool"'));
assert(fs.readFileSync('index.html','utf8').includes('Open CTR Tools'));
context.location={hash:''};context.addEventListener=()=>{};
const tabScript=html.match(/<script id="tool-tabs">([\s\S]*?)<\/script>/)[1];
vm.runInContext(tabScript,context);
assert.equal(elements.get('#rename-tool').hidden,false);
assert.equal(elements.get('#duplicate-tool').hidden,true);
elements.get('#tab-duplicates').onclick();
assert.equal(elements.get('#rename-tool').hidden,true);
assert.equal(elements.get('#duplicate-tool').hidden,false);
elements.get('#tab-rename').onclick();
assert.equal(elements.get('#rename-tool').hidden,false);
vm.runInContext(`
async function tests(){
 const base='Jane_Doe_CTR_2026-10-22.pdf';
 for(const n of ['jane doe_CTR_2026-10-22_2.pdf','Jane_Doe_CTR_2026-10-22 (1).pdf','Jane_Doe_CTR_2026-10-22_to_2026-10-22_3.pdf'])if(ctrIdentity(n).key!==ctrIdentity(base).key)throw Error('Normalization failed');
 for(const n of ['Jane_Doe_CTR_2026-02-30.pdf','Jane_Doe_CTR_2026-10-24_to_2026-10-22.pdf','unformatted.pdf'])if(ctrIdentity(n))throw Error('Invalid filename accepted');
 if(ctrIdentity('Jane_Doe_CTR_2026-10-23.pdf').key===ctrIdentity(base).key)throw Error('Different date grouped');
 const files=new Map();const deleted=[];
 function file(name,body){const handle={kind:'file',name,async getFile(){return {arrayBuffer:async()=>new TextEncoder().encode(body).buffer}}};files.set(name,handle);return handle}
 const copy='Jane_Doe_CTR_2026-10-22_2.pdf',different='Jane_Doe_CTR_2026-10-22_3.pdf';
 file(base,'%PDF-original');file(copy,'%PDF-original');file(different,'%PDF-revision');file('Other_CTR_2026-10-22.pdf','%PDF-other');file('unformatted.pdf','%PDF-other');
 duplicateFolder={name:'Test',async *values(){yield* files.values()},async getFileHandle(name){if(!files.has(name))throw Error('Missing');return files.get(name)},async removeEntry(name){deleted.push(name);files.delete(name)}};
 await scanDuplicateFolder();
 if(duplicateGroups.length!==1||duplicateSelection().length)throw Error('Wrong groups or preselected deletion');
 let g=duplicateGroups[0];if(g.keep.name!==base)throw Error('Wrong default keeper');
 if(!sameBytes(g.files[0].bytes,g.files[1].bytes)||sameBytes(g.files[0].bytes,g.files[2].bytes))throw Error('Content comparison failed');
 g.files.find(f=>f.name===copy).selected=true;globalThis.confirm=()=>false;
 await $('#remove-duplicates').onclick();if(deleted.length)throw Error('Deleted on cancel');
 globalThis.confirm=()=>true;file(base,'%PDF-edited-after-scan');
 await $('#remove-duplicates').onclick();if(deleted.length)throw Error('Deleted after keeper changed');
 await scanDuplicateFolder();g=duplicateGroups[0];g.files.find(f=>f.name===copy).selected=true;
 await $('#remove-duplicates').onclick();if(deleted.join()!==copy||!files.has(base)||!files.has(different))throw Error('Incorrect removal');
 await scanDuplicateFolder();g=duplicateGroups[0];g.files.find(f=>f.name===different).selected=true;files.delete(base);
 await $('#remove-duplicates').onclick();if(deleted.length!==1)throw Error('Deleted without keeper');
}
`,context);
context.TextEncoder=TextEncoder;
vm.runInContext('tests()',context).then(()=>console.log('PASS: matching, invalid dates, byte comparisons, review defaults, cancellation, changed/missing keeper, and confirmed deletion')).catch(e=>{console.error(e);process.exitCode=1});
