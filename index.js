const generatePieces = require("./image-cropper.js");
const Scraper = require("./scraper");

/**
 * I only used this function to generate the initial assets and order them manually
 */
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
