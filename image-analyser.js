const sharp = require("sharp");
const ImageMatcher = require("./image-matcher");

async function readPosition(initialStateImage, position) {
  const data = await sharp(initialStateImage, 1)
    .extract({
      left: padding,
      top: padding,
      width,
      height,
    })
    .raw()
    .toBuffer();

  ImageMatcher.processImage(data);
}

async function analyse(initialStateImage) {
  const metaReader = await sharp(initialStateImage).metadata();
  const canvasSize = metaReader.width;
  const pieceSize = canvasSize / 3;
  const padding = 2;

  const width = pieceSize - padding;
  const height = width;

  const data = await sharp(initialStateImage, 1)
    .extract({
      left: padding,
      top: padding,
      width,
      height,
    })
    .raw()
    .toBuffer();

  ImageMatcher.processImage(data);

  // sharp(initialStateImage)
  //   .extract({
  //     left: pieceSize + padding,
  //     top: padding,
  //     width,
  //     height,
  //   })
  //   .toFile("part2.png");

  // sharp(initialStateImage)
  //   .extract({
  //     left: 2 * pieceSize + padding,
  //     top: padding,
  //     width,
  //     height,
  //   })
  //   .toFile("part3.png");

  // sharp(initialStateImage)
  //   .extract({
  //     left: padding,
  //     top: pieceSize + padding,
  //     width,
  //     height,
  //   })
  //   .toFile("part4.png");

  // sharp(initialStateImage)
  //   .extract({
  //     left: pieceSize + padding,
  //     top: pieceSize + padding,
  //     width,
  //     height,
  //   })
  //   .toFile("part5.png");

  // sharp(initialStateImage)
  //   .extract({
  //     left: 2 * pieceSize + padding,
  //     top: pieceSize + padding,
  //     width,
  //     height,
  //   })
  //   .toFile("part6.png");

  // sharp(initialStateImage)
  //   .extract({
  //     left: padding,
  //     top: 2 * pieceSize + padding,
  //     width,
  //     height,
  //   })
  //   .toFile("part7.png");

  // sharp(initialStateImage)
  //   .extract({
  //     left: pieceSize + padding,
  //     top: 2 * pieceSize + padding,
  //     width,
  //     height,
  //   })
  //   .toFile("part8.png");

  // sharp(initialStateImage)
  //   .extract({
  //     left: 2 * pieceSize + padding,
  //     top: 2 * pieceSize + padding,
  //     width,
  //     height,
  //   })
  //   .toFile("part9.png");
}

module.exports = analyse;
