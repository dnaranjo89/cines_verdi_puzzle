const PNG = require("pngjs").PNG;
const fs = require("fs");
const sharp = require("sharp");
const pixelmatch = require("pixelmatch");

const Scraper = require("./scraper");

const INITIAL_STATE_FILENAME = "initialState.png";
const NUMBER_OF_PIECES = 9;

class Puzzle {
  constructor() {
    this.finalPositions = {};
    this.currentOrder = [];
  }

  async init() {
    await Scraper.saveShuffledPuzzle(INITIAL_STATE_FILENAME);

    const metaReader = await sharp(INITIAL_STATE_FILENAME).metadata();
    const canvasSize = metaReader.width;
    this.pieceSize = canvasSize / 3;
  }

  async process() {
    this.loadFinalPositions();
    await this.analyse(INITIAL_STATE_FILENAME);
  }

  loadFinalPositions() {
    for (let i = 0; i < NUMBER_OF_PIECES; i++) {
      const image = PNG.sync.read(
        fs.readFileSync(`puzzle_resolved/final_part${i}.png`)
      );
      this.finalPositions[i] = image;
    }
  }

  async processSlot(position) {
    const { pieceSize } = this;
    const padding = 2;
    const width = pieceSize - padding;
    const height = width;
    let left;
    let top;

    switch (position) {
      case 0:
        left = padding;
        top = padding;
        break;
      case 1:
        left = pieceSize + padding;
        top = padding;
        break;
      case 2:
        left = 2 * pieceSize + padding;
        top = padding;
        break;
      case 3:
        left = padding;
        top = pieceSize + padding;
        break;
      case 4:
        left = pieceSize + padding;
        top = pieceSize + padding;
        break;
      case 5:
        left = 2 * pieceSize + padding;
        top = pieceSize + padding;
        break;
      case 6:
        left = +padding;
        top = 2 * pieceSize + padding;
        break;
      case 7:
        left = pieceSize + padding;
        top = 2 * pieceSize + padding;
        break;
      case 8:
        left = 2 * pieceSize + padding;
        top = 2 * pieceSize + padding;
        break;
      default:
        throw "Unexpected position";
    }

    try {
      const data = await sharp(INITIAL_STATE_FILENAME)
        .extract({
          left,
          top,
          width,
          height,
        })
        .raw()
        .toBuffer();
      return this.findMatchingSlot(data);
    } catch (e) {
      console.log(e);
    }
  }

  findMatchingSlot(data) {
    for (let i = 0; i < NUMBER_OF_PIECES; i++) {
      const currentImage = this.finalPositions[i];
      if (!currentImage) {
        continue;
      }
      const { width, height } = currentImage;
      const numDiffPixels = pixelmatch(
        currentImage.data,
        data,
        null,
        width,
        height,
        {
          threshold: 0.2,
        }
      );
      if (numDiffPixels === 0) {
        this.finalPositions[i] = null;
        return i;
      }
    }
  }

  async analyse() {
    const slotPromises = [];

    for (let i = 0; i < NUMBER_OF_PIECES; i++) {
      slotPromises.push(this.processSlot(i));
    }

    const currentOrder = await Promise.all(slotPromises);
    console.log("initialOrder", currentOrder);

    // Order items
    let slot = 0;
    while (slot < NUMBER_OF_PIECES) {
      const currentPiece = currentOrder[slot];
      if (currentPiece === slot) {
        slot++;
      } else {
        console.log(`Move ${slot} to ${currentPiece}`);
        const temp = currentOrder[slot];
        currentOrder[slot] = currentOrder[currentPiece];
        currentOrder[currentPiece] = temp;
      }
    }
  }
}

module.exports = Puzzle;
