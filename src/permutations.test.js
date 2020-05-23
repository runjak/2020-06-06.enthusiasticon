import { id, combine, combines, equals, invert, perspectivePermutations, rotationPermutations } from './permutations';

describe('permutations', () => {
  describe('group laws', () => {
    const reverse = [...id].reverse();

    it('it should have id as a left-combining identity element', () => {
      const actual = combine(id, reverse);

      expect(actual).toEqual(reverse);
    });

    it('it should have id as a right-combining identity element', () => {
      const actual = combine(reverse, id);

      expect(actual).toEqual(reverse);
    });

    it('should respect associativity', () => {
      const xs = [0, 2, 1, 3];
      const ys = [0, 1, 3, 2];
      const zs = [1, 0, 2, 3];

      const p1 = combine(combine(xs, ys), zs);
      const p2 = combine(xs, combine(ys, zs));

      expect(p1).toEqual(p2);
    });

    it('should have inverse elements like the reverse permutation', () => {
      const expected = id;
      const actual = combine(combine(reverse, reverse), id);

      expect(actual).toEqual(expected);
    });

    it('should apply permutations as expected', () => {
      const sample = [2, 3, 5, 7];
      const permutation = [0, 1, 3, 2];

      const expected = [2, 3, 7, 5];
      const actual = combine(permutation, sample);

      expect(actual).toEqual(expected);
    });
  });

  describe('combines()', () => {
    it('should behave like identity given only one argument', () => {
      const expected = [];
      const actual = combines(expected);

      expect(actual).toBe(expected);
    });

    it('should combine the given arguments', () => {
      const xs = [0, 2, 1, 3];
      const ys = [0, 1, 3, 2];
      const zs = [1, 0, 2, 3];

      const expected = combine(combine(xs, ys), zs);
      const actual = combines(xs, ys, zs);

      expect(actual).toEqual(expected);
    });
  });

  describe("equals()", () => {
    it('should return false for permutations of different length', () => {
      const actual = equals([2, 3, 5, 7], [11, 13, 17, 19, 23]);

      expect(actual).toBe(false);
    });

    it('should return false for different permutations', () => {
      const actual = equals([2, 3, 5, 7], [11, 13, 17, 19]);

      expect(actual).toBe(false);
    });

    it('should return true for the same permutation', () => {
      const actual = equals(id, id);

      expect(actual).toBe(true);
    });

    it('should return true for equal permutations', () => {
      const actual = equals([1, 2, 3], [1, 2, 3]);

      expect(actual).toBe(true);
    });
  });

  describe("invert()", () => {
    it('should return id given id', () => {
      const actual = invert(id);

      expect(actual).toEqual(id);
    });

    it('should find the inverse to a given permutation', () => {
      const [x, y, z, ...xs] = id;
      const p = [y, z, x, ...xs];

      const expected = [z, x, y, ...xs];
      const actual = invert(p);

      expect(actual).toEqual(expected);
    });
  });

  describe('perspectivePermutations', () => {
    it("should have X permutation with cycle length 4", () => {
      const { X: permutation } = perspectivePermutations;

      const actual = combines(permutation, permutation, permutation, permutation);

      expect(actual).toEqual(id);
    });

    it("should have X' permutation with cycle length 4", () => {
      const { "X'": permutation } = perspectivePermutations;

      const actual = combines(permutation, permutation, permutation, permutation);

      expect(actual).toEqual(id);
    });

    it("should have Y permutation with cycle length 4", () => {
      const { Y: permutation } = perspectivePermutations;

      const actual = combines(permutation, permutation, permutation, permutation);

      expect(actual).toEqual(id);
    });

    it("should have Y' permutation with cycle length 4", () => {
      const { "Y'": permutation } = perspectivePermutations;

      const actual = combines(permutation, permutation, permutation, permutation);

      expect(actual).toEqual(id);
    });

    it("should have Z permutation with cycle length 4", () => {
      const { Z: permutation } = perspectivePermutations;

      const actual = combines(permutation, permutation, permutation, permutation);

      expect(actual).toEqual(id);
    });

    it("should have Z' permutation with cycle length 4", () => {
      const { "Z'": permutation } = perspectivePermutations;

      const actual = combines(permutation, permutation, permutation, permutation);

      expect(actual).toEqual(id);
    });

    it("should have X and X' as inverse permutations", () => {
      const { X: p1, "X'": p2 } = perspectivePermutations;

      const actual = combine(p1, p2);

      expect(actual).toEqual(id);
    });

    it("should have Y and Y' as inverse permutations", () => {
      const { Y: p1, "Y'": p2 } = perspectivePermutations;

      const actual = combine(p1, p2);

      expect(actual).toEqual(id);
    });

    it("should have Z and Z' as inverse permutations", () => {
      const { Z: p1, "Z'": p2 } = perspectivePermutations;

      const actual = combine(p1, p2);

      expect(actual).toEqual(id);
    });
  });

  describe('rotationPermutations', () => {
    it('should know 12 permutations', () => {
      const actual = Object.values(rotationPermutations).length;

      expect(actual).toBe(12);
    });

    it('should have an inverse permutation for each permutation', () => {
      const xs = Object.values(rotationPermutations);

      xs.forEach((x) => {
        const xInverted = invert(x);
        const hasInverted = xs.some((y) => equals(y, xInverted));
        expect(hasInverted).toBe(true);
      });
    });
  });
});
