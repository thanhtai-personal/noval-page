// get-list-chapter.ts
import * as fs from 'fs/promises';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
import * as moment from 'moment';
import * as sh from 'shelljs';

interface Chapter {
  url: string;
  title: string;
  no?: number;
}

interface Novel {
  id: string;
  name: string;
  url: string;
  [key: string]: any;
}

export default async function scrapeNovels(ignoreContent = false) {
  const currentLogData = require('./leech-logs/log.json');
  let currentNovals: Novel[] = require('./list.json');

  const rememberData = currentLogData || { totalPage: 0, currentPage: 1 };
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const ttvSearchPath = 'https://truyen.tangthuvien.vn/tong-hop?rank=vw&page=';
  await page.goto(ttvSearchPath);

  const searchValue = await page.$$('ul.pagination li a');
  const lastPageUrl = await (await searchValue[searchValue.length - 2].getProperty('href')).jsonValue();
  const totalPage = rememberData.totalPage || parseInt(new URLSearchParams(new URL(lastPageUrl as any).search).get('page') || '1');

  sh.cd('novals');

  for (let p = rememberData.currentPage; p <= totalPage; p++) {
    sh.echo(`>>LOAD PAGE ${p} - ${moment().format()}`);
    sh.exec(`echo "LOAD PAGE ${ttvSearchPath}${p} - ${moment().format()}" >> ../leech-logs/last.txt`);
    await page.goto(`${ttvSearchPath}${p}`);

    try {
      const novalsInfo = await page.$$('div.book-img-text ul li');
      for (let index = 0; index < novalsInfo.length; index++) {
        try {
          const novalInfoJSNode = novalsInfo[index];
          const novalName = await novalInfoJSNode.$eval('.book-mid-info h4 a', e => e.textContent || 'no-name');
          const ttvUrl = await novalInfoJSNode.$eval('.book-img-box a', e => e.getAttribute('href'));
          const listText = ttvUrl?.split('/') || [];
          const id = listText[listText.length - 1];

          const fIndex = currentNovals.findIndex(item => item.id === id);

          if (fIndex < 0) {
            currentNovals.push({ id, url: ttvUrl!, name: novalName });
            await fs.writeFile('../list.json', JSON.stringify(currentNovals));

            if (!ignoreContent) {
              const novalInfo = {
                ttvUrl,
                imageAlt: await novalInfoJSNode.$eval('.book-img-box a img', e => e.getAttribute('alt')),
                name: novalName,
                author: {
                  image: await novalInfoJSNode.$eval('.book-mid-info .author img', e => e.getAttribute('src')),
                  name: await novalInfoJSNode.$eval('.book-mid-info .author img', e => e.textContent || ''),
                },
                status: await novalInfoJSNode.$eval('.book-mid-info span', e => e.textContent || ''),
                chapterAmount: await novalInfoJSNode.$eval('.book-mid-info span span', e => e.textContent || ''),
                description: await novalInfoJSNode.$eval('.book-mid-info .intro', e => e.textContent || ''),
                updated: moment(await novalInfoJSNode.$eval('.book-mid-info .update span', e => e.textContent || ''), 'YYYY-MM-DD HH:mm:ss').unix(),
              };

              sh.mkdir(novalName);
              sh.cd(novalName);
              await fs.writeFile('sortInfo.json', JSON.stringify(novalInfo));
              sh.cd('..');
            }
          } else {
            currentNovals[fIndex].name = novalName;
            await fs.writeFile('../list.json', JSON.stringify(currentNovals));
          }
        } catch (err) {
          sh.echo(`GET NOVAL SUMMARY INFO ERROR: ${err?.message}`);
        }
      }

      rememberData.currentPage = p;
      await fs.writeFile(`../leech-logs/log.json`, JSON.stringify(rememberData));
    } catch (error) {
      sh.echo(`GET PAGE DATA ERROR: ${error?.message}`);
    }
  }

  sh.echo(`LEECH DONE!!`);
  await browser.close();
}
