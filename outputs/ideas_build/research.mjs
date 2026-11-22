import fs from 'node:fs/promises';
import {FileBlob,SpreadsheetFile,Workbook} from '@oai/artifact-tool';
const source=await SpreadsheetFile.importXlsx(await FileBlob.load('outputs/ideas_build/ideas-daiyana-matveeva-updated.xlsx'));
const original=source.worksheets.getItem('Идеи').getRange('A2:F8').values;
const research=[
 ['Style DNA','https://apps.apple.com/us/app/style-dna-ai-stylist-closet/id1358319821','Перенять персональную палитру и образы из имеющейся одежды; проверить точность цветотипа и полезность рекомендаций для разных фигур.'],
 ['University of Auckland Campus Maps','https://www.auckland.ac.nz/en/on-campus/our-campuses/campus-maps/maps.html','Перенять поиск кабинетов и маршруты внутри корпусов; проверить полноту и актуальность данных конкретного учебного заведения.'],
 ['OpenFlow для студентов','https://openflow.team/en/for/students/','Перенять профили и подбор участников для проекта; проверить, готовы ли школьники и студенты создавать проекты и общаться на платформе. Аналог покрывает командообразование, но не все функции идеи.'],
 ['Khanmigo','https://www.khanacademy.org/khanmigo','Перенять диалог наставника и уточняющие вопросы; проверить, помогают ли они сформулировать цель и следующий шаг. Аналог ориентирован на обучение, а не исключительно на развитие идей.'],
 ['HungryAI','https://hungryai.com/','Перенять практические задания и обратную связь по работе с ИИ; проверить качество оценки промптов и заданий для разных уровней подготовки.'],
 ['GetWardrobe','https://apps.apple.com/us/app/getwardrobe-outfit-planner/id656212466','Перенять подбор образа с учётом повода и ссылок на вещи; проверить, достаточно ли пользователю имеющегося гардероба или нужен поиск товаров в магазинах.'],
 ['CiltMate','https://ciltmate.com/en','Перенять объяснение совместимости состава с профилем кожи; проверить точность данных о составе и понятность ограничений рекомендаций.']
];
if(original.length!==7 || original.some((r,i)=>r[0]!==`I0${i+1}`)) throw Error('IDs mismatch');
const rows=original.map((r,i)=>[...r.slice(0,5),...research[i]]);
const book=Workbook.create();const s=book.worksheets.add('Исследование');
s.getRange('A1:H8').values=[['ID','Автор','Для кого','Проблема','Предложение','Аналог','Ссылка','Вывод'],...rows];
s.tables.add('A1:H8',true,'ResearchTable').showFilterButton=true;s.freezePanes.freezeRows(1);s.showGridLines=false;
for(const [c,w] of Object.entries({A:10,B:23,C:30,D:48,E:70,F:28,G:43,H:48}))s.getRange(c+':'+c).format.columnWidth=w;
s.getRange('A1:H8').format.wrapText=true;s.getRange('A1:H8').format.verticalAlignment='top';s.getRange('A1:H1').format.rowHeight=30;
for(let i=0;i<7;i++){const n=Math.max(...[2,3,4,7].map(j=>Math.ceil((rows[i][j]||'').length/({2:28,3:44,4:62,7:44}[j]))));s.getRange(`A${i+2}:H${i+2}`).format.rowHeight=Math.min(350,Math.max(65,n*16+15));}
const choice=book.worksheets.add('Мой выбор');choice.getRange('A1:B3').values=[['Поле','Ответ'],['Идея',''],['Причина','']];choice.getRange('A:A').format.columnWidth=20;choice.getRange('B:B').format.columnWidth=90;choice.getRange('A1:B1').format.fill='#195979';choice.getRange('A1:B1').format.font.color='#FFFFFF';choice.getRange('A1:B1').format.font.bold=true;choice.getRange('A1:B3').format.wrapText=true;choice.getRange('A2:B3').format.rowHeight=55;
book.recalculate();
console.log((await book.inspect({kind:'table',range:'Исследование!A1:H8',include:'values',tableMaxRows:8,tableMaxCols:8})).ndjson);
const img=await book.render({sheetName:'Исследование',range:'A1:H3',scale:1});await fs.writeFile('outputs/ideas_build/research-preview.png',new Uint8Array(await img.arrayBuffer()));
const out=await SpreadsheetFile.exportXlsx(book);await out.save('outputs/ideas_build/personal-research-daiyana-matveeva.xlsx');
