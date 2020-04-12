const puppeteer = require("puppeteer");
const Puzzle = require("./puzzle.js");

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Scraper {
  constructor(props) {
    const page = null;
    this.centerPoints = [];
  }

  async move(page, movement) {
    console.log(`Moving ${movement[0]} to ${movement[1]}`);
    const origin = this.centerPoints[movement[0]];
    const destination = this.centerPoints[movement[1]];
    await page.mouse.move(origin.x, origin.y);
    await page.mouse.down();
    await page.mouse.move(destination.x, destination.y, { steps: 1 });
    await page.mouse.up();
  }

  async process() {
    const puzzle = new Puzzle();
    const page = await this.saveShuffledPuzzle(puzzle.INITIAL_STATE_FILENAME);

    await puzzle.init();
    const movements = await puzzle.process();

    // Wait until the game starts
    await page.waitForSelector(".game_hint_link");

    while (movements.length) {
      const movement = movements.shift();
      await this.move(page, movement);
    }
  }

  calculateCenterPoints(left, top, canvasSize) {
    const piece = canvasSize / 3;
    const halfPiece = piece / 2;
    const piece0 = new Point(halfPiece + left, halfPiece + top);
    const piece1 = new Point(piece + halfPiece + left, halfPiece + top);
    const piece2 = new Point(2 * piece + halfPiece + left, halfPiece + top);
    const piece3 = new Point(halfPiece + left, piece + halfPiece + top);
    const piece4 = new Point(piece + halfPiece + left, piece + halfPiece + top);
    const piece5 = new Point(
      2 * piece + halfPiece + left,
      piece + halfPiece + top
    );
    const piece6 = new Point(halfPiece + left, 2 * piece + halfPiece + top);
    const piece7 = new Point(
      piece + halfPiece + left,
      2 * piece + halfPiece + top
    );
    const piece8 = new Point(
      2 * piece + halfPiece + left,
      2 * piece + halfPiece + top
    );
    this.centerPoints = [
      piece0,
      piece1,
      piece2,
      piece3,
      piece4,
      piece5,
      piece6,
      piece7,
      piece8,
    ];
  }

  async screenshotDOMElement(page, opts = {}) {
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

    this.calculateCenterPoints(rect.left, rect.top, rect.width);

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

  async saveShuffledPuzzle(fileName) {
    const browser = await puppeteer.launch({
      defaultViewport: { width: 302, height: 500 },
      headless: false,
    });

    const page = await browser.newPage();
    await page.goto("https://a.cstmapp.com/quiz/886334");

    let bannerToRemoveSelector = ".game_landing";
    await page.waitForSelector(bannerToRemoveSelector);
    await page.evaluate((sel) => {
      var elements = document.querySelectorAll(sel);
      for (var i = 0; i < elements.length; i++) {
        elements[i].parentNode.removeChild(elements[i]);
      }
    }, bannerToRemoveSelector);

    await this.screenshotDOMElement(page, {
      path: fileName,
      selector: "canvas",
      padding: 0,
    });
    return page;
  }
}

module.exports = Scraper;
