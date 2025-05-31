// get-list-chapter.ts
import * as fs from 'fs/promises';
import * as path from 'path';
import { Page } from 'puppeteer';

interface Chapter {
  url: string;
  title: string;
  no?: number;
}

export default async function getListChapter(
  page: Page,
  sh: typeof import('shelljs'),
  currentDir: string
): Promise<Chapter[]> {
  try {
    const chaptersTab = await page.$('#j-bookCatalogPage');
    try {
      await chaptersTab?.click();
    } catch (error) {
      console.error('click error', error);
    }

    await page.waitForTimeout(50);

    const listPath = path.join(currentDir, 'list-chapters.json');
    sh.touch(listPath);
    await fs.writeFile(listPath, JSON.stringify([]));

    let chapters: Chapter[] = [];
    let nextPageBtn: any = null;

    do {
      try {
        const chapterJSNodes: Chapter[] = await page.$$eval(
          '#max-volume ul li a[target=_blank]',
          elements => elements.map(element => ({
            url: element.getAttribute('href') || '',
            title: element.getAttribute('title') || '',
          }))
        );

        chapters = [...chapters, ...chapterJSNodes];

        try {
          nextPageBtn = await page.$('ul.pagination li a[aria-label=Next]');
          const activeBtnText = await page.$eval('ul.pagination li.active a', e => e.textContent || '');
          sh.echo(`get chapters from page ${activeBtnText}`);

          try {
            await nextPageBtn?.click();
          } catch (clickError) {
            await page.click('ul.pagination li a[aria-label=Next]');
          }

          await page.waitForTimeout(0);
        } catch (paginationError) {
          nextPageBtn = null;
        }
      } catch (err) {
        sh.echo('GET LIST CHAPTERS ERROR');
        nextPageBtn = null;
      }
    } while (nextPageBtn);

    chapters = chapters.map((c, index) => ({ ...c, no: index + 1 }));
    await fs.writeFile(listPath, JSON.stringify(chapters));

    return chapters;
  } catch (error) {
    sh.echo('CHECK file data error');
    return [];
  }
}
