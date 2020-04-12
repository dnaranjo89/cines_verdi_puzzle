const sharp = require("sharp");

async function crop(originalImage) {
  const metaReader = await sharp(originalImage).metadata();
  const canvasSize = metaReader.width;
  const pieceSize = canvasSize / 3;
  const padding = 2;

  const width = pieceSize - padding;
  const height = width;

  sharp(originalImage)
    .extract({
      left: padding,
      top: padding,
      width,
      height,
    })
    .toFile("part1.png");

  sharp(originalImage)
    .extract({
      left: pieceSize + padding,
      top: padding,
      width,
      height,
    })
    .toFile("part2.png");

  sharp(originalImage)
    .extract({
      left: 2 * pieceSize + padding,
      top: padding,
      width,
      height,
    })
    .toFile("part3.png");

  sharp(originalImage)
    .extract({
      left: padding,
      top: pieceSize + padding,
      width,
      height,
    })
    .toFile("part4.png");

  sharp(originalImage)
    .extract({
      left: pieceSize + padding,
      top: pieceSize + padding,
      width,
      height,
    })
    .toFile("part5.png");

  sharp(originalImage)
    .extract({
      left: 2 * pieceSize + padding,
      top: pieceSize + padding,
      width,
      height,
    })
    .toFile("part6.png");

  sharp(originalImage)
    .extract({
      left: padding,
      top: 2 * pieceSize + padding,
      width,
      height,
    })
    .toFile("part7.png");

  sharp(originalImage)
    .extract({
      left: pieceSize + padding,
      top: 2 * pieceSize + padding,
      width,
      height,
    })
    .toFile("part8.png");

  sharp(originalImage)
    .extract({
      left: 2 * pieceSize + padding,
      top: 2 * pieceSize + padding,
      width,
      height,
    })
    .toFile("part9.png");
}

module.exports = crop;
