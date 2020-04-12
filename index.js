const puppeteer = require("puppeteer");
const process = require("./image-matcher.js");
const generatePieces = require("./image-cropper.js");
const analyse = require("./image-analyser.js");
const Scraper = require("./scraper");

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
  const scraper = new Scraper();
  scraper.saveShuffledPuzzle(shuffledPuzzleFileName);
  generatePieces(shuffledPuzzleFileName);

  // I need to manually order them after this step
}

async function run() {
  const scraper = new Scraper();
  await scraper.process();
}

run();
