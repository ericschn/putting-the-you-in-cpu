const fs = require('fs/promises');
const chaptersDir = 'src/content/chapters/';
const imagesDir = 'public/images/';
const bookMeta = `---
title: Putting the "You" in CPU
creator:
- role: author
  text: Lexi Mattick
- role: author
  text: Hack Club
description: A technical explainer of how your computer runs programs, from start to finish.
cover-image: public/images/cpu-pleading-face.png
---`;

async function getChapterFilenames() {
  return (await fs.readdir(chaptersDir)).filter((x) => x.match('.+?.mdx$'));
}

async function readChapter(chapterFilename) {
  const chapter = (await fs.readFile(chaptersDir + chapterFilename)).toString();
  const title = chapter.match(/^title:\s(.+)$/m)[1];
  const slug = chapter.match(/^slug:\s(.+)$/m)[1];
  const chapterNumber = chapter.match(/^chapter:\s(\d+)$/m)[1];

  const cleanedChapter = chapter
    .replace(
      /^---.+?---/s,
      `<h1 id="${slug}">Chapter ${chapterNumber}: ${title}</h1>`
    )
    .replaceAll('/images/', imagesDir)
    .replaceAll('(/', '(#')
    .replace(/\s?(style|loading|height)='.+?'/g, '')
    .replace(/width='.+?'/g, "width='100%'")
    .replace(/^import\sCode.+$/gm, '')
    .replace(/^<\/?CodeBlock.+\n?$/gm, '')
    .replace(/\s*?<\/?(p|div)>/gm, '')
    .replace(/^<iframe.+$/gm, '')
    .replace(/^(\t|\s\s)<img/gm, '<img')
    .trim();

  return cleanedChapter;
}

async function go() {
  const chapters = [];
  const chapterFilenames = await getChapterFilenames();
  for (const chapterFilename of chapterFilenames) {
    chapters.push(readChapter(chapterFilename));
  }
  Promise.all(chapters).then((chapterArray) => {
    chapterArray.unshift(bookMeta);
    fs.writeFile('TEST-MD.md', chapterArray.join('\n\n')).then(() => {
      console.log('done');
    });
  });
}

go();
