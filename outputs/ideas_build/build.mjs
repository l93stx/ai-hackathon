import fs from 'node:fs/promises';
import {Workbook, SpreadsheetFile} from '@oai/artifact-tool';
const files=JSON.parse(await fs.readFile('outputs/ideas_build/source.json','utf8')).sort((a,b)=>a.name<b.name?-1:a.name>b.name?1:0);
const rows=[];
for(const f of files){
 const author=(f.content.match(/^Автор:\s*(.+)$/m)?.[1]||'').trim();
 const blocks=f.content.split(/^##\s+/m).slice(1);
 for(const block of blocks){
  const clean=block.replace(/\*\*/g,'');
  const get=(label)=>clean.match(new RegExp('^'+label+':\\s*([^\\n]+)','m'))?.[1].trim()||'';
  rows.push(['I'+String(rows.length+1).padStart(2,'0'),author.startsWith('[')?'':author,get('Для кого'),get('Проблема'),get('Предложение'),f.name]);
 }
 console.log(f.name,blocks.length);
}
if(rows.length!==7 || rows.some(r=>!r[2]||!r[3]||!r[4])) throw Error('Source reconciliation failed');
const book=Workbook.create(); const sheet=book.worksheets.add('Идеи');
sheet.getRange('A1:F8').values=[['ID идеи','Автор','Для кого','Проблема','Предложение','Источник'],...rows];
sheet.tables.add('A1:F8',true,'IdeasTable').showFilterButton=true;
sheet.freezePanes.freezeRows(1); sheet.showGridLines=false;
for(const [c,w] of Object.entries({A:12,B:23,C:36,D:55,E:75,F:32})) sheet.getRange(c+':'+c).format.columnWidth=w;
sheet.getRange('A1:F8').format.wrapText=true; sheet.getRange('A1:F8').format.verticalAlignment='top';
sheet.getRange('A1:F1').format.rowHeight=30;
for(let i=0;i<rows.length;i++){const n=Math.max(...[2,3,4].map(j=>Math.ceil(rows[i][j].length/({2:32,3:50,4:65}[j]))));sheet.getRange(`A${i+2}:F${i+2}`).format.rowHeight=Math.min(350,Math.max(45,n*16+15));}
book.recalculate();
console.log((await book.inspect({kind:'table',range:'Идеи!A1:F8',include:'values',tableMaxRows:8,tableMaxCols:6})).ndjson);
const preview=await book.render({sheetName:'Идеи',range:'A1:F4',scale:1}); await fs.writeFile('outputs/ideas_build/preview.png',new Uint8Array(await preview.arrayBuffer()));
const xlsx=await SpreadsheetFile.exportXlsx(book); await xlsx.save('outputs/ideas_build/ideas-daiyana-matveeva-updated.xlsx');
