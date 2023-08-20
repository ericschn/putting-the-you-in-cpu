// This generates a new markdown file 'cpu-epub.md'
// After generation, run:
// pandoc cpu-epub.md -o putting-the-you-in-cpu.epub --toc-depth=1

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
cover-image: public/images/epub-cover.jpg
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
    .replaceAll('/images/', imagesDir)
    .replaceAll('(/', '(#')
    .replace(/\s?(style|loading|height)='.+?'/g, '')
    .replace(/width='.+?'/g, "width='100%'")
    .replace(/^import\sCode.+\n$/gm, '')
    .replace(/^<\/?CodeBlock.+\n?$/gm, '')
    .replace(/\s*?<\/?(p|div)>/gm, '')
    .replace(/^<iframe.+$/gm, '')
    .replace(/^(\t|\s\s)<img/gm, '<img')
    .replace(
      /^---.+?---\n/s,
      `# Chapter ${chapterNumber}: ${title}\n\n<div id="${slug}"></div>`
    )
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
    fs.writeFile('cpu-epub.md', chapterArray.join('\n\n')).then(() => {
      console.log('done');
    });
  });
}

go();
