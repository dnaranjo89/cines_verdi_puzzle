const puppeteer = require("puppeteer");
const process = require("./image-matcher.js");
const generatePieces = require("./image-cropper.js");
const analyse = require("./image-analyser.js");
const Puzzle = require("./puzzle.js");
const Scraper = require("./scraper");

/**
 * Takes a screenshot of a DOM element on the page, with optional padding.
 *
 * @param {!{path:string, selector:string, padding:(number|undefined)}=} opts
 * @return {!Promise<!Buffer>}
 */
async function screenshotDOMElement(page, opts = {}) {
  const padding = "padding" in opts ? opts.padding : 5;
  const path = "path" in opts ? opts.path : null;
  const selector = opts.selector;

  if (!selector) throw Error("Please provide a selector.");

  const rect = await page.evaluate((selector) => {
    const element = document.querySelector(selector);
    if (!element) return null;
    const { x, y, width, height } = element.getBoundingClientRect();
    return { left: x, top: y, width, height, id: element.id };
  }, selector);

  if (!rect)
    throw Error(`Could not find element that matches selector: ${selector}.`);

  const topLeft = new Point(rect.left, rect.top);
  // const topRight = Point(rect.left + rect.width, rect.top);
  // const bottomLeft = Point(rect.left, rect.top + rect.height);
  // const bottomRight = Point(rect.left + rect.width, rect.top + rect.height);

  const pieceSize = rect.width / 3;

  await page.screenshot({
    path: "part1.png",
    clip: {
      x: topLeft.x + padding,
      y: topLeft.y + padding,
      width: pieceSize - padding,
      height: pieceSize - padding,
    },
  });

  await page.screenshot({
    path: "part2.png",
    clip: {
      x: topLeft.x + pieceSize + padding,
      y: topLeft.y + padding,
      width: pieceSize - padding,
      height: pieceSize - padding,
    },
  });

  await page.screenshot({
    path: "part3.png",
    clip: {
      x: topLeft.x + 2 * pieceSize + padding,
      y: topLeft.y + padding,
      width: pieceSize - padding,
      height: pieceSize - padding,
    },
  });

  await page.screenshot({
    path: "part4.png",
    clip: {
      x: topLeft.x + padding,
      y: topLeft.y + pieceSize + padding,
      width: pieceSize - padding,
      height: pieceSize - padding,
    },
  });

  await page.screenshot({
    path: "part5.png",
    clip: {
      x: topLeft.x + pieceSize + padding,
      y: topLeft.y + pieceSize + padding,
      width: pieceSize - padding,
      height: pieceSize - padding,
    },
  });

  await page.screenshot({
    path: "part6.png",
    clip: {
      x: topLeft.x + 2 * pieceSize + padding,
      y: topLeft.y + pieceSize + padding,
      width: pieceSize - padding,
      height: pieceSize - padding,
    },
  });

  await page.screenshot({
    path: "part5.png",
    clip: {
      x: topLeft.x + padding,
      y: topLeft.y + 2 * pieceSize + padding,
      width: pieceSize - padding,
      height: pieceSize - padding,
    },
  });

  await page.screenshot({
    path: "part7.png",
    clip: {
      x: topLeft.x + pieceSize + padding,
      y: topLeft.y + 2 * pieceSize + padding,
      width: pieceSize - padding,
      height: pieceSize - padding,
    },
  });

  await page.screenshot({
    path: "part9.png",
    clip: {
      x: topLeft.x + 2 * pieceSize + padding,
      y: topLeft.y + 2 * pieceSize + padding,
      width: pieceSize - padding,
      height: pieceSize - padding,
    },
  });

  return await page.screenshot({
    path,
    clip: {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    },
  });
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

async function calculatePositions() {
  const canvas = await page.$("canvas");
  const canvasBox = await canvas.boundingBox();
  console.log();

  const topLeft = Point(canvasBox.x, canvasBox.y);
  const topRight = Point(canvasBox.x + canvasBox.width, canvasBox.y);
  const bottomLeft = canvasBox.y;
  const bottomRight = Point(
    canvasBox.x + canvasBox.with,
    canvasBox.y + canvasBox.height
  );
}

async function move() {
  await page.mouse.move(190, 160);
  await page.mouse.down();
  await page.waitFor(100);
  // await page.mouse.move(436, 192, { steps: 2 });
  // await page.waitFor(100);

  await page.mouse.move(360, 260, { steps: 20 });
  await page.mouse.up();
}

async function doTheThing() {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: { width: 302, height: 500 },
    headless: false,
  });

  const page = await browser.newPage();
  await page.goto("https://a.cstmapp.com/quiz/886334");

  await page.waitFor(4000);
  await screenshotDOMElement(page, {
    path: "element.png",
    selector: "canvas",
    padding: 0,
  });
  // const canvas = await page.$("canvas");
  // console.log(await canvas.boundingBox());

  // await page.mouse.move(190, 160);
  // await page.mouse.down();
  // await page.waitFor(100);

  // await page.mouse.move(360, 300, { steps: 50 });
  // await page.mouse.up();
}

function generateInitialAssets() {
  const shuffledPuzzleFileName = "puzzle_resolved/final_shuffledPuzzle.png";
  Scraper.saveShuffledPuzzle(shuffledPuzzleFileName);
  generatePieces(shuffledPuzzleFileName);

  // I need to manually order them after this step
}

function processPuzzle() {
  const shuffledPuzzleFileName = "initialState.png";
  // Scraper.saveShuffledPuzzle(shuffledPuzzleFileName);
  analyse(shuffledPuzzleFileName);
}

// processPuzzle();

async function run() {
  const puzzle = new Puzzle();
  await puzzle.init();
  puzzle.analyse();
}

run();
// process();
