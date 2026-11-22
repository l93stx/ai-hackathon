import { chromium } from '/Users/dayaana/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { pathToFileURL } from 'node:url';
const browser = await chromium.launch({headless:true, executablePath:'/Applications/Opera.app/Contents/MacOS/Opera'});
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
await page.goto(pathToFileURL(process.cwd()+'/team-daiyana-matveeva.html').href,{waitUntil:'load'});
await page.screenshot({path:process.cwd()+'/outputs/team-daiyana-matveeva.png',fullPage:true});
await browser.close();
