const puppeteer = require("puppeteer");
const process = require("./image-matcher.js");
const generatePieces = require("./image-cropper.js");
const analyse = require("./image-analyser.js");

async function screenshotDOMElement(page, opts = {}) {
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

async function saveShuffledPuzzle(fileName) {
  const browser = await puppeteer.launch({
    defaultViewport: { width: 302, height: 500 },
    headless: false,
  });

  const page = await browser.newPage();
  await page.goto("https://a.cstmapp.com/quiz/886334");

  await page.waitFor(4000);
  await screenshotDOMElement(page, {
    path: fileName,
    selector: "canvas",
    padding: 0,
  });
}

module.exports = {
  saveShuffledPuzzle,
};
