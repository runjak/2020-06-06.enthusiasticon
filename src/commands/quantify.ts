import { quantify } from "../image";

// ignoring node and name of file in argv:
const [, , sourceImage] = process.argv;

if (!sourceImage) {
  console.log("Please pass a source .png as parameter.");
  process.exit(1);
}

quantify(sourceImage);
