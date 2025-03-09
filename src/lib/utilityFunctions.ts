import { Jimp, ResizeStrategy } from 'jimp';

const squareSize = 120;

export async function processImageServerSide(
  inputPath: string,
  outputPath: string,
  outputFileName: string,
): Promise<void> {
  try {
    const image = await Jimp.read(inputPath);
    const originalWidth = image.bitmap.width;
    const originalHeight = image.bitmap.height;
    const aspectRatio = originalWidth / originalHeight;

    let newWidth: number;
    let newHeight: number;
    if (originalWidth > originalHeight) {
      newWidth = squareSize;
      newHeight = squareSize / aspectRatio;
    } else {
      newHeight = squareSize;
      newWidth = squareSize * aspectRatio;
    }

    image.resize({w: newWidth, h: newHeight, mode: ResizeStrategy.BILINEAR});

    const canvas = new Jimp({
      width: squareSize,
      height: squareSize,
    });
    const xOffset = (squareSize - newWidth) / 2;
    const yOffset = (squareSize - newHeight) / 2;

    canvas.composite(image, xOffset, yOffset);

    canvas.greyscale();
    canvas.threshold({ max: 128 });

    await canvas.write(`${outputPath}/${outputFileName}.bmp`);
    console.log(`Image processed and saved to ${outputPath}`);
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
}