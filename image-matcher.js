const fs = require("fs");
const PNG = require("pngjs").PNG;
const pixelmatch = require("pixelmatch");

function process() {
  const img1 = PNG.sync.read(fs.readFileSync("part1.png"));
  const img2 = PNG.sync.read(fs.readFileSync("part2.png"));
  const { width, height } = img1;
  const diff = new PNG({ width, height });

  const response = pixelmatch(img1.data, img2.data, diff.data, width, height, {
    threshold: 0.1,
  });
  console.log("response", response);
  fs.writeFileSync("diff.png", PNG.sync.write(diff));
}

function checkAgainstImage(data, targetImagePath) {
  const targetImage = PNG.sync.read(
    fs.readFileSync("puzzle_resolved/" + targetImagePath)
  );
  const { width, height } = targetImage;
  const diff = new PNG({ width, height });
  const response = pixelmatch(
    targetImage.data,
    data,
    diff.data,
    width,
    height,
    {
      threshold: 0.2,
    }
  );
  console.log("response", response);
  // fs.writeFileSync("diff.png", PNG.sync.write(diff));
}

function processImage(data) {
  checkAgainstImage(data, "final_part1.png");
  checkAgainstImage(data, "final_part2.png");
  checkAgainstImage(data, "final_part3.png");
  checkAgainstImage(data, "final_part4.png");
  checkAgainstImage(data, "final_part5.png");
  checkAgainstImage(data, "final_part6.png");
  checkAgainstImage(data, "final_part7.png");
  checkAgainstImage(data, "final_part8.png");
  checkAgainstImage(data, "final_part9.png");
}
module.exports = { process, processImage };
