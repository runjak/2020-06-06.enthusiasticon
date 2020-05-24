import { readFile as readFileCb, writeFile as writeFileCb } from "fs";
import { PNG } from "pngjs";
import { applyPaletteSync, utils } from "image-q";
import { Color, placeTopColors, solvedColors } from "./colors";
import { PermutationName } from "./permutations";

const { Point, Palette, PointContainer } = utils;

const white = Point.createByRGBA(0xff, 0xff, 0xff, 0xff);
const green = Point.createByRGBA(0x08, 0xcc, 0x05, 0xff);
const red = Point.createByRGBA(0xcc, 0x00, 0x01, 0xff);
const blue = Point.createByRGBA(0x17, 0x2f, 0xcc, 0xff);
const orange = Point.createByRGBA(0xcc, 0x4f, 0x05, 0xff);
const yellow = Point.createByRGBA(0xcc, 0xb8, 0x00, 0xff);

const cubePalette = new Palette();
cubePalette.add(white);
cubePalette.add(green);
cubePalette.add(red);
cubePalette.add(blue);
cubePalette.add(orange);
cubePalette.add(yellow);

export const readFile = (file: string): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    readFileCb(file, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

export const writeFile = (file: string, data: object): Promise<void> =>
  new Promise((resolve, reject) => {
    writeFileCb(file, JSON.stringify(data), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

const isPoint = (
  point: utils.Point,
  r: number,
  g: number,
  b: number
): boolean => point.r === r && point.g === g && point.b === b;

const toColors = (
  data: Uint8Array,
  width: number,
  height: number
): Array<Color> => {
  let colors: Array<Color> = [];

  const maxIndex = Math.min(width * height * 4, data.length);
  for (let i = 0; i < maxIndex; i += 4) {
    const [r, g, b] = data.slice(i, i + 3);

    if (isPoint(white, r, g, b)) {
      colors.push(Color.white);
    } else if (isPoint(green, r, g, b)) {
      colors.push(Color.green);
    } else if (isPoint(red, r, g, b)) {
      colors.push(Color.red);
    } else if (isPoint(blue, r, g, b)) {
      colors.push(Color.blue);
    } else if (isPoint(orange, r, g, b)) {
      colors.push(Color.orange);
    } else if (isPoint(yellow, r, g, b)) {
      colors.push(Color.yellow);
    } else {
      colors.push(Color.white);
    }
  }

  return colors;
};

export type Quantified = { data: Array<Color>; width: number; height: number };

export const quantify = (rawPng: Buffer): Quantified => {
  const { data, width, height } = PNG.sync.read(rawPng);
  const inPointContainer = PointContainer.fromUint8Array(data, width, height);
  const outPointContainer = applyPaletteSync(inPointContainer, cubePalette);

  return {
    width,
    height,
    data: toColors(outPointContainer.toUint8Array(), width, height),
  };
};

export type Tile = { x: number; y: number; colors: Array<Color> };

export const tile = ({ data, width, height }: Quantified): Array<Tile> => {
  let tiles: Array<Tile> = [];

  for (let y = 0; y + 3 < height; y += 3) {
    for (let x = 0; x + 3 < width; x += 3) {
      const offset = y * width + x;
      const colors = [
        ...data.slice(offset, offset + 3),
        ...data.slice(offset + width, offset + width + 3),
        ...data.slice(offset + 2 * width, offset + 2 * width + 3),
      ];

      tiles.push({ x: Math.floor(x / 3), y: Math.floor(y / 3), colors });
    }
  }

  return tiles;
};

export type ImageCube = { x: number; y: number; cube: Array<PermutationName> };
export type Animation = {
  keyframeDelta: number;
  cubes: Array<ImageCube>;
};

export const imageToAnimation = (
  rawPng: Buffer,
  keyframeDelta: number,
  startColors: (x: number, y: number) => Array<Color>
): Animation => {
  const tiles = tile(quantify(rawPng)).slice(0, 3); // FIXME no slice
  const cubes = tiles.map(({ x, y, colors }) => ({
    x,
    y,
    cube: placeTopColors(startColors(x, y), colors),
  }));

  return { keyframeDelta, cubes };
};

export const animateSingleImage = async (
  source: string,
  target: string,
  keyframeDelta: number
) => {
  const rawPng = await readFile(source);
  const animation = imageToAnimation(rawPng, 8, () => solvedColors);
  await writeFile(target, animation);
};
