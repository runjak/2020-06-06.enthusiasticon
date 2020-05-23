import zip from "lodash/zip";

import {
  shuffle,
  rotationPermutations,
  perspectivePermutations,
  id,
} from "./permutations";
import {
  Color,
  solvedColors,
  Face,
  colorsOnFace,
  colorsOnCross,
  applyPermutation,
  faceMiddleHasColor,
  orientCube,
  rotationBfs,
  countCorrectColors,
  improvesColors,
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
        const colors = colorsOnFace(face)(solvedColors);

        expect(colors.length).toBe(9);
        expect(colors.every((c) => c === color)).toBe(true);
      });
    });
  });

  describe("colorsOnCross", () => {
    it("should select the expected entries", () => {
      const actual = colorsOnCross("U")(id);
      const expected = [1, 3, 4, 5, 7];

      expect(actual).toEqual(expected);
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

  describe("countCorrectColors", () => {
    it("should count the correctly placed colors", () => {
      const desiredColors = [Color.red, Color.green, Color.blue];
      const actualColors = [Color.orange, Color.green, Color.white];

      expect(countCorrectColors(desiredColors, actualColors)).toBe(1);
    });
  });

  describe("improvesColors", () => {
    const manipulatedCube = [...solvedColors];
    manipulatedCube[9] = Color.red;

    const selector = colorsOnFace("F");
    const predicate = improvesColors(
      selector(solvedColors),
      selector(manipulatedCube),
      selector
    );

    it("should reject a Y rotation", () => {
      const testCube = applyPermutation(
        solvedColors,
        perspectivePermutations.Y
      );

      expect(predicate(testCube)).toBe(false);
    });

    it("should accept solvedColors", () => {
      expect(predicate(solvedColors)).toBe(true);
    });
  });
});
