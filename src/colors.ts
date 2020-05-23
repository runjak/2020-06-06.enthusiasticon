import shuffleCollection from "lodash/shuffle";
import zip from "lodash/zip";

import {
  Permutation,
  PerspectivePermutationName,
  shuffle,
  RotationPermutationName,
  rotationPermutations,
  combine,
} from "./permutations";

export enum Color {
  white = "white",
  green = "green",
  red = "red",
  blue = "blue",
  orange = "orange",
  yellow = "yellow",
}

export const solvedColors = [
  Color.white,
  Color.green,
  Color.red,
  Color.blue,
  Color.orange,
  Color.yellow,
].flatMap((c: Color): Array<Color> => Array(9).fill(c));

export type Face = "U" | "L" | "F" | "R" | "B" | "D";

const faceSlices: { [face in Face]: [number, number] } = {
  U: [0, 9],
  F: [9, 18],
  R: [18, 27],
  B: [27, 36],
  L: [36, 45],
  D: [45, 54],
};

export const colorsOnFace = (cube: Array<Color>, face: Face): Array<Color> => {
  const [start, end] = faceSlices[face];
  return cube.slice(start, end);
};

export const applyPermutation = (
  cube: Array<Color>,
  permutation: Permutation
): Array<Color> => permutation.map((i) => cube[i]);

export type ColorPredicate = (colors: Array<Color>) => boolean;

export const faceMiddleHasColor = (
  face: Face,
  color: Color
): ColorPredicate => (cube) => colorsOnFace(cube, face)[4] === color;

const chooseFlip = (): Array<PerspectivePermutationName> => {
  const paths: Array<Array<PerspectivePermutationName>> = [
    ["X", "X"],
    ["X'", "X'"],
    ["Y", "Y"],
    ["Y'", "Y'"],
  ];

  return shuffleCollection(paths)[0];
};

export const orientCube = (
  colors: Array<Color>,
  predicate: ColorPredicate
): Array<PerspectivePermutationName> => {
  if (predicate(colors)) {
    return [];
  }

  const otherSides: Array<Array<PerspectivePermutationName>> = [
    ["X"],
    ["X'"],
    ["Y"],
    ["Y'"],
    chooseFlip(),
  ];

  for (const path of otherSides) {
    if (predicate(applyPermutation(colors, shuffle(path)))) {
      return path;
    }
  }

  return [];
};

export const rotationBfs = (
  cube: Array<Color>,
  predicate: ColorPredicate,
  depth: number
): Array<RotationPermutationName> => {
  type RotationPath = Array<RotationPermutationName>;
  type States = Array<[RotationPath, Permutation]>;

  let states: States = Object.entries(
    rotationPermutations
  ).map(([name, permutation]) => [
    [name as RotationPermutationName],
    permutation,
  ]);

  for (let i = 0; i < depth; i++) {
    // Test current states:
    for (const [path, permutation] of states) {
      if (predicate(applyPermutation(cube, permutation))) {
        return path;
      }
    }

    // Generate next states:
    states = states.flatMap(([path, permutation]) =>
      Object.entries(rotationPermutations).map(([nextStep, nextPermutation]): [
        RotationPath,
        Permutation
      ] => [
        [...path, nextStep as RotationPermutationName],
        combine(permutation, nextPermutation),
      ])
    );
  }

  return [];
};

export const countCorrectColors = (
  desiredColors: Array<Color>,
  actualColors: Array<Color>
): number =>
  zip(desiredColors, actualColors).filter(
    ([desired, actual]) => desired === actual
  ).length;

export const improvesFaceColors = (
  face: Face,
  desiredFace: Array<Color>,
  currentFace: Array<Color>
): ColorPredicate => {
  const currentCount = countCorrectColors(desiredFace, currentFace);

  return (cube) =>
    countCorrectColors(desiredFace, colorsOnFace(cube, face)) > currentCount;
};
