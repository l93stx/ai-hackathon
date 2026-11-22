import {FileBlob,SpreadsheetFile} from '@oai/artifact-tool';
const path='outputs/ideas_build/ideas-daiyana-matveeva-updated.xlsx';
const book=await SpreadsheetFile.importXlsx(await FileBlob.load(path));
book.worksheets.getItem('Идеи').getRange('B6').values=[['Кириллина Вилюя']];
book.recalculate();
console.log((await book.inspect({kind:'table',range:'Идеи!A6:F6',include:'values',tableMaxRows:1,tableMaxCols:6})).ndjson);
const result=await SpreadsheetFile.exportXlsx(book); await result.save(path);
