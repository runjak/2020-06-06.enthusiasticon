import zip from "lodash/zip";

import {
  Permutation,
  PerspectivePermutationName,
  shuffle,
  RotationPermutationName,
  rotationPermutations,
  combine,
  PermutationName,
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

export type ColorSelector = (cube: Array<Color>) => Array<Color>;

export const colorsOnFace = (face: Face): ColorSelector => (cube) => {
  const [start, end] = faceSlices[face];
  return cube.slice(start, end);
};

const crossFromFace = (f: Array<Color>): Array<Color> => [
  f[1],
  f[3],
  f[4],
  f[5],
  f[7],
];

export const colorsOnCross = (face: Face): ColorSelector => {
  const faceSelector = colorsOnFace(face);
  return (cube) => crossFromFace(faceSelector(cube));
};

export const applyPermutation = (
  cube: Array<Color>,
  permutation: Permutation
): Array<Color> => permutation.map((i) => cube[i]);

export type ColorPredicate = (colors: Array<Color>) => boolean;

export const faceMiddleHasColor = (
  face: Face,
  color: Color
): ColorPredicate => (cube) => colorsOnFace(face)(cube)[4] === color;

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
    ["Z"],
    ["Z'"],
    ["X", "X"],
    ["X'", "X'"],
    ["Y", "Y"],
    ["Y'", "Y'"],
    ["Z", "Z"],
    ["Z'", "Z'"],
  ];

  for (const path of otherSides) {
    if (predicate(applyPermutation(colors, shuffle(path)))) {
      return path;
    }
  }

  throw new Error("orientCube could not satisfy the given predicate.");
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

export const improvesColors = (
  desiredColors: Array<Color>,
  currentColors: Array<Color>,
  colorSelector: ColorSelector
): ColorPredicate => {
  const currentCount = countCorrectColors(desiredColors, currentColors);

  return (cube) =>
    countCorrectColors(desiredColors, colorSelector(cube)) > currentCount;
};

export const placeTopColors = (
  cube: Array<Color>,
  topColors: Array<Color>
): Array<PermutationName> => {
  if (topColors.length !== 9) {
    return [];
  }

  const middleSteps = orientCube(
    solvedColors,
    faceMiddleHasColor("U", topColors[4])
  );
  let currentCube = applyPermutation(cube, shuffle(middleSteps));

  const desiredCross = crossFromFace(topColors);
  const selectCross = colorsOnCross("U");
  let crossSteps: Array<PermutationName> = [];
  while (countCorrectColors(desiredCross, selectCross(currentCube)) < 5) {
    const crossRotations = rotationBfs(
      currentCube,
      improvesColors(desiredCross, selectCross(currentCube), selectCross),
      4
    );

    if (crossRotations.length === 0) {
      break;
    }

    crossSteps = [...crossSteps, ...crossRotations];
    currentCube = applyPermutation(currentCube, shuffle(crossRotations));
  }

  const selectFace = colorsOnFace("U");
  let faceSteps: Array<PermutationName> = [];
  while (countCorrectColors(topColors, selectFace(currentCube)) < 9) {
    const edgeRotations = rotationBfs(
      currentCube,
      improvesColors(topColors, selectFace(currentCube), selectFace),
      6
    );

    if (edgeRotations.length === 0) {
      break;
    }

    faceSteps = [...faceSteps, ...edgeRotations];
    currentCube = applyPermutation(currentCube, shuffle(edgeRotations));
  }

  return [...middleSteps, ...crossSteps, ...faceSteps];
};
