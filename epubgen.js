const fs = require('fs/promises');
const chaptersDir = 'src/content/chapters/';
const imagesDir = 'public/images';

// grab the chapters .mdx files and concatenate while removing extra meta info
async function getChapterFilenames() {
  return (await fs.readdir(chaptersDir)).filter((x) => x.match('.+?.mdx$'));
}

async function readChapter(chapterFilename) {
  const chapter = (await fs.readFile(chaptersDir + chapterFilename)).toString();
  const title = chapter.match(/^title:\s(.+)$/m)[1];
  const chapterNumber = chapter.match(/^chapter:\s(\d+)$/m)[1];
  const cleanedChapter = chapter
    .replace(/^---.+?---/s, `# Chapter ${chapterNumber}: ${title}`)
    .replace('/images/', imagesDir);
  return cleanedChapter;
}

function readChapters(chapterFilenames) {
  const result = [];
  for (const chapterFilename of chapterFilenames) {
    result.push(fs.readFile(chaptersDir + chapterFilename));
  }
  return result;
}

function cleanUpChapters(chapters) {
  const cleanedChapters = [];
  for (const [i, chapter] of chapters.entries()) {
    // get chapter number and name ✓
    // turn metadata into title ✓
    // remove imports and such
    // fix image links ✓
    // fix image styling
    // fix in-doc links, do I need all the slugs first?
    // fix code blocks, do we need line numbers?
    const title = chapter.match(/^title:\s(.+)$/m);
    cleanedChapters.push(
      chapter
        .replace(/^---.+?---/s, `# Chapter ${i}: ${title}`)
        .replace('/images/', imagesDir)
    );
  }
  // console.log(cleanedChapters[0]);
}

function cleanUpChapters(chapters) {
  const cleanedChapters = [];
  for (const [i, chapter] of chapters.entries()) {
    // get chapter number and name ✓
    // turn metadata into title ✓
    // remove imports and such
    // fix image links ✓
    // fix image styling
    // fix in-doc links, do I need all the slugs first?
    // fix code blocks, do we need line numbers?
    const title = chapter.match(/^title:\s(.+)$/m);
    cleanedChapters.push(
      chapter
        .replace(/^---.+?---/s, `# Chapter ${i}: ${title}`)
        .replace('/images/', imagesDir)
    );
  }
  // console.log(cleanedChapters[0]);
}

// getChapterFilenames()
//   .then((chapters) => {
//     return readChapters(chapters);
//   })
//   .then((chapterContentsPromises) => {
//     return Promise.all(chapterContentsPromises);
//   })
//   .then((chapterContentsBuffer) => {
//     const chapterContents = chapterContentsBuffer.map((x) => x.toString());
//     cleanUpChapters(chapterContents);
//   });

// create main book metadata

// new way
async function go() {
  const chapters = [];
  const chapterFilenames = await getChapterFilenames();
  for (const chapterFilename of chapterFilenames) {
    chapters.push(readChapter(chapterFilename));
  }
  Promise.all(chapters).then((x) => console.log(x[0]));
}

go();
