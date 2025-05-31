// leech-novels.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
import * as sh from 'shelljs';
import get_list_chapter from './get_list_chapter';

interface NovelInfo {
  name: string;
  url: string;
  done: boolean;
}

@Injectable()
export class LeechNovelsService {
  private readonly logger = new Logger(LeechNovelsService.name);

  async run() {
    const currentNovels: NovelInfo[] = require('./list.json');

    for (const noval of currentNovels) {
      if (noval.done) continue;
      try {
        const browser = await puppeteer.launch({
          headless: false,
          product: 'chrome',
          args: ['--start-maximized'],
          defaultViewport: { width: 1700, height: 800 },
          devtools: true,
        });

        const page = await browser.newPage();
        this.logger.log(`START LEECH novel ${noval.name}`);

        const novelDir = path.join(__dirname, 'novals', noval.name);
        const sortInfoPath = path.join(novelDir, 'sortInfo.json');
        const sortInfo = require(sortInfoPath);

        await page.goto(noval.url);

        sh.cd(novelDir);
        sh.touch('log.txt');
        sh.echo(`LEECH novel ${noval.name}`).toEnd('log.txt');

        const novelInfo = {
          image: await page.$eval('div.book-img a img', e => e.getAttribute('src')),
          name: await page.$eval('div.book-info h1', e => e.textContent || ''),
          author: await page.$eval('div.book-info p.tag a.blue', e => e.textContent || ''),
          status: await page.$eval('div.book-info p.tag span', e => e.textContent || ''),
          categoryText: await page.$eval('div.book-info p.tag a.red', e => e.textContent || ''),
          category: (await page.$eval('div.book-info p.tag a.red', e => e.getAttribute('href')))?.split('/').pop(),
          intro: await page.$eval('div.book-info p.intro', e => e.textContent || ''),
        };

        await fs.writeFile(path.join(novelDir, 'fullInfo.json'), JSON.stringify(novelInfo));

        const bookIntroFull = await page.$eval('div.book-info-detail div.book-intro', e => e.innerHTML);
        await fs.writeFile(path.join(novelDir, 'bookIntroFull.md'), bookIntroFull);

        const chaptersDir = path.join(novelDir, 'chapters');
        sh.mkdir('-p', chaptersDir);

        let currentChapterData: any = {};
        const dataJsonPath = path.join(chaptersDir, 'data.json');

        try {
          currentChapterData = require(dataJsonPath);
        } catch {
          currentChapterData = { chapter: 0 };
          await fs.writeFile(dataJsonPath, JSON.stringify(currentChapterData));
        }

        const listChapters = await get_list_chapter(page, sh, chaptersDir);
        await browser.close();

        for (let c = currentChapterData.chapter || 0; c < listChapters.length; c++) {
          try {
            const chapterBrowser = await puppeteer.launch();
            const chapterPage = await chapterBrowser.newPage();
            await chapterPage.goto(listChapters[c].url || `${noval.url}/chuong-${c + 1}`);

            const title = await chapterPage.$eval('h5 a.more-chap', e => e.innerHTML);
            const content = await chapterPage.$eval('div.box-chap', e => e.innerHTML);

            await fs.writeFile(path.join(chaptersDir, `chapter-${c + 1}-title.md`), title);
            await fs.writeFile(path.join(chaptersDir, `chapter-${c + 1}.md`), content);

            currentChapterData = { chapter: c };
            await fs.writeFile(dataJsonPath, JSON.stringify(currentChapterData));
            await chapterBrowser.close();
          } catch (error) {
            this.logger.error(`IGNORE chapter ${c + 1} - ${error.message}`);
          }
        }

        noval.done = true;
        await fs.writeFile('./list.json', JSON.stringify(currentNovels));
      } catch (error) {
        this.logger.error(`Error processing novel ${noval.name}: ${error.message}`);
      }
    }
  }
}
