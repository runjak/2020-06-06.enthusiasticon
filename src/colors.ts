import { Permutation } from "./permutations";

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

export const colorsOnFace = (
  colors: Array<Color>,
  face: Face
): Array<Color> => {
  const [start, end] = faceSlices[face];
  return colors.slice(start, end);
};

export const applyPermutation = (
  colors: Array<Color>,
  permutation: Permutation
): Array<Color> => permutation.map((i) => colors[i]);
