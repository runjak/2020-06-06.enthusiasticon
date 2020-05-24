import { tile } from "./image";

describe("image", () => {
  describe("tile", () => {
    it("should produce the expected tiles", () => {
      // prettier-ignore
      const quantified = {
        width: 8, height: 7,
        data: [
          1, 2, 3, 9, 8, 7, 0, 0,
          4, 5, 6, 6, 5, 4, 0, 0,
          7, 8, 9, 3, 2, 1, 0, 0,
          1, 4, 7, 9, 6, 3, 0, 0,
          2, 5, 8, 8, 5, 2, 0, 0,
          3, 6, 9, 7, 4, 1, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0,
        ],
      };
      // prettier-ignore
      const expected = [
        { x: 0, y: 0, colors: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
        { x: 1, y: 0, colors: [9, 8, 7, 6, 5, 4, 3, 2, 1] },
        { x: 0, y: 1, colors: [1, 4, 7, 2, 5, 8, 3, 6, 9] },
        { x: 1, y: 1, colors: [9, 6, 3, 8, 5, 2, 7, 4, 1] },
      ];
      const actual = tile(quantified);

      expect(actual).toEqual(expected);
    });
  });
});
