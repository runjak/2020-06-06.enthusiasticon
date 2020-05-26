import { animateSingleImage } from "./image";

// ignoring node and name of file in argv:
const [, , sourceImage] = process.argv;

if(!sourceImage) {
  console.log('Please pass a source .png as parameter.');
  process.exit(1);
}

const targetJson = sourceImage.replace(/\.png$/, '.json');

animateSingleImage(sourceImage, targetJson, 8);
