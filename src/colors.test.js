import { solvedColors } from "./colors";

describe("colors", () => {
  describe("solvedColors", () => {
    it("should have the correct number of colors", () => {
      expect(solvedColors.length).toBe(6 * 9);
    });
  });
});
