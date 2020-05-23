import zip from "lodash/zip";

import { shuffle } from "./permutations";
import {
  Color,
  solvedColors,
  Face,
  colorsOnFace,
  applyPermutation,
  faceMiddleHasColor,
  orientCube,
  rotationBfs,
} from "./colors";

describe("colors", () => {
  describe("solvedColors", () => {
    it("should have the correct number of colors", () => {
      expect(solvedColors.length).toBe(6 * 9);
    });
  });

  describe("colorsOnFace", () => {
    it("should yield the correct color to face combination for solvedColors", () => {
      const combinations = [
        ["U", Color.white],
        ["F", Color.green],
        ["R", Color.red],
        ["B", Color.blue],
        ["L", Color.orange],
        ["D", Color.yellow],
      ];

      combinations.forEach(([face, color]) => {
        const colors = colorsOnFace(solvedColors, face);

        expect(colors.length).toBe(9);
        expect(colors.every((c) => c === color)).toBe(true);
      });
    });
  });

  describe("applyPermutation", () => {
    it("should apply the permutation for R as expected", () => {
      const actual = applyPermutation(solvedColors, shuffle(["R"]));
      // prettier-ignore
      const expected = [
        Color.white, Color.white, Color.green, Color.white, Color.white, Color.green, Color.white, Color.white, Color.green,
        Color.green, Color.green, Color.yellow, Color.green, Color.green, Color.yellow, Color.green, Color.green, Color.yellow,
        Color.red, Color.red, Color.red, Color.red, Color.red, Color.red, Color.red, Color.red, Color.red,
        Color.white, Color.blue, Color.blue, Color.white, Color.blue, Color.blue, Color.white, Color.blue, Color.blue,
        Color.orange, Color.orange, Color.orange, Color.orange, Color.orange, Color.orange, Color.orange, Color.orange, Color.orange,
        Color.yellow, Color.yellow, Color.blue, Color.yellow, Color.yellow, Color.blue, Color.yellow, Color.yellow, Color.blue,
      ];

      expect(actual).toEqual(expected);
    });
  });

  describe("faceMiddleHasColor", () => {
    it("should check that the solved case has white on top", () => {
      const actual = faceMiddleHasColor("U", Color.white)(solvedColors);
      expect(actual).toBe(true);
    });

    it("should spot the difference", () => {
      const manipulatedColors = [...solvedColors];
      manipulatedColors[4] = Color.red;

      const actual = faceMiddleHasColor("U", Color.white)(manipulatedColors);
      expect(actual).toBe(false);
    });
  });

  describe("orientCube", () => {
    it("should find a path to orient green to top", () => {
      const predicate = faceMiddleHasColor("U", Color.green);

      const expected = ["X"];
      const actual = orientCube(solvedColors, predicate);

      expect(actual).toEqual(expected);
    });
  });

  describe("rotationBfs", () => {
    const shufflePath = ["F'", "L'"];
    const shuffledCube = applyPermutation(solvedColors, shuffle(shufflePath));

    const predicate = (cube) =>
      zip(cube, solvedColors).every(([x, y]) => x === y);

    it("should be tested with a sane predicate", () => {
      expect(predicate(solvedColors)).toBe(true);
      expect(predicate(shuffledCube)).toBe(false);
    });

    it("should not find the solution with depth = 1", () => {
      const actual = rotationBfs(shuffledCube, predicate, 1);

      expect(actual).toEqual([]);
    });

    it("should find the solution with depth = 2", () => {
      const actual = rotationBfs(shuffledCube, predicate, 2);
      const expectedPath = ["L", "F"];

      expect(actual).toEqual(expectedPath);
    });
  });
});
