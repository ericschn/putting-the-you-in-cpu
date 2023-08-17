const fs = require('fs/promises');
const chaptersDir = 'src/content/chapters/';
const imagesDir = 'public/images/';

async function getChapterFilenames() {
  return (await fs.readdir(chaptersDir)).filter((x) => x.match('.+?.mdx$'));
}

async function readChapter(chapterFilename) {
  const chapter = (await fs.readFile(chaptersDir + chapterFilename)).toString();
  const title = chapter.match(/^title:\s(.+)$/m)[1];
  const slug = chapter.match(/^slug:\s(.+)$/m)[1];
  const chapterNumber = chapter.match(/^chapter:\s(\d+)$/m)[1];
  // get chapter number and name ✓
  // turn metadata into title ✓
  // remove imports and such
  // fix image links ✓
  // fix image styling
  // fix in-doc links, do I need all the slugs first?
  // fix code blocks, do we need line numbers?
  const cleanedChapter = chapter
    // .replace(/^---.+?---/s, `# Chapter ${chapterNumber}: ${title}`)
    .replace(
      /^---.+?---/s,
      `<h1 id="${slug}">Chapter ${chapterNumber}: ${title}</h1>`
    )
    .replaceAll('/images/', imagesDir)
    .replace(/(style|loading|height)='.+?'/g, '')
    .replace(/width='.+?'/g, "width='100%'");
  // .replaceAll(/width=/, imagesDir)
  return cleanedChapter;
}

async function go() {
  const chapters = [];
  const chapterFilenames = await getChapterFilenames();
  for (const chapterFilename of chapterFilenames) {
    chapters.push(readChapter(chapterFilename));
  }
  Promise.all(chapters).then((chapterArray) => {
    fs.writeFile('TEST-MD.md', chapterArray.join('\n\n')).then(() => {
      console.log('done');
    });
  });
}

go();
