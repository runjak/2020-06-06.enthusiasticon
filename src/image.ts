import { promises as fsPromises } from "fs";
const { readFile, writeFile } = fsPromises;
import { PNG } from "pngjs";
import { applyPaletteSync, utils, ImageQuantization } from "image-q";
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

const isPoint = (
  point: utils.Point,
  r: number,
  g: number,
  b: number
): boolean => point.r === r && point.g === g && point.b === b;

const toColors = (
  data: Uint8Array,
  width: number,
  height: number // FIXME I think we can simplify arguments here
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

const quantizations: Array<ImageQuantization> = [
  "nearest",
  "riemersma",
  "floyd-steinberg",
  "false-floyd-steinberg",
  "stucki",
  "atkinson",
  "jarvis",
  "burkes",
  "sierra",
  "two-sierra",
  "sierra-lite",
];

export const quantify = async (sourceFile: string): Promise<void> => {
  const matches = sourceFile.match(/^(.+)\.png$/);

  if (!matches) {
    throw new Error(
      `Unexpected sourceFile name does not end with '.png': '${sourceFile}'`
    );
  }
  const filePrefix = matches[1];

  const rawPng = await readFile(sourceFile);
  const { data, width, height } = PNG.sync.read(rawPng);

  await Promise.all(
    quantizations.map(async (imageQuantization) => {
      const inPointContainer = PointContainer.fromUint8Array(
        data,
        width,
        height
      );
      const outPointContainer = applyPaletteSync(
        inPointContainer,
        cubePalette,
        { imageQuantization }
      );

      const targetFile = `${filePrefix}.${imageQuantization}.png`;
      const png = new PNG({ width, height });
      // @ts-ignore following image-q tutorial below
      png.data = outPointContainer.toUint8Array();
      console.log("writing file:", targetFile);
      await writeFile(targetFile, PNG.sync.write(png));
    })
  );
};

export type Tile = { x: number; y: number; colors: Array<Color> };

export const tile = (
  data: Array<Color>,
  width: number,
  height: number
): Array<Tile> => {
  let tiles: Array<Tile> = [];

  for (let y = 0; y + 3 <= height; y += 3) {
    for (let x = 0; x + 3 <= width; x += 3) {
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

export const tilePng = (rawPng: Buffer): Array<Tile> => {
  const { data, width, height } = PNG.sync.read(rawPng);
  return tile(toColors(new Uint8Array(data), width, height), width, height);
};

export type ImageCube = {
  x: number;
  y: number;
  permutations: Array<PermutationName>;
};
export type Animation = {
  keyDelta: number;
  cubes: Array<ImageCube>;
};

export const imageToAnimation = (
  rawPng: Buffer,
  keyDelta: number,
  startColors: (x: number, y: number) => Array<Color>
): Animation => {
  const tiles = tilePng(rawPng);
  const cubes = tiles.map(({ x, y, colors }) => ({
    x,
    y,
    permutations: placeTopColors(startColors(x, y), colors),
  }));

  return { keyDelta, cubes };
};

export const animateSingleImage = async (
  source: string,
  target: string,
  keyDelta: number
) => {
  const rawPng = await readFile(source);
  const animation = imageToAnimation(rawPng, keyDelta, (x, y) => {
    console.log(`startCube for (${x}, ${y})`);
    return solvedColors;
  });
  await writeFile(target, JSON.stringify(animation));
};
