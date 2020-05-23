import range from 'lodash/range';

export type Permutation = Array<number>;

export const id: Permutation = range(3 * 3 * 6);

export function combine(xs: Permutation, ys: Permutation): Permutation {
  return xs.map(x => ys[x]);
}

export function combines(x: Permutation, ...xs: Array<Permutation>): Permutation {
  if (xs.length === 0) {
    return x;
  }

  return xs.reduce((y, z) => combine(y, z), x);
}

export function equals(x: Permutation, y: Permutation): boolean {
  if (x === y) {
    return true;
  }

  if (x.length !== y.length) {
    return false;
  }

  for (let i = 0; i < x.length; i++) {
    if (x[i] !== y[i]) {
      return false;
    }
  }

  return true;
}

export function invert(x: Permutation): Permutation {
  let y = x;

  while (true) {
    const z = combine(x, y);

    if (equals(z, id)) {
      return y;
    }

    y = z;
  }
}

export type PerspectivePermutationName = "X" | "X'" | "Y" | "Y'" | "Z" | "Z'";
export type PerspectivePermutations = { [name in PerspectivePermutationName]: Permutation };

const X = [9, 10, 11, 12, 13, 14, 15, 16, 17
  , 45, 46, 47, 48, 49, 50, 51, 52, 53
  , 24, 21, 18, 25, 22, 19, 26, 23, 20
  , 8, 7, 6, 5, 4, 3, 2, 1, 0
  , 38, 41, 44, 37, 40, 43, 36, 39, 42
  , 35, 34, 33, 32, 31, 30, 29, 28, 27];
const Xinverse = invert(X);

const Z = [20, 23, 26, 19, 22, 25, 18, 21, 24
  , 11, 14, 17, 10, 13, 16, 9, 12, 15
  , 47, 50, 53, 46, 49, 52, 45, 48, 51
  , 33, 30, 27, 34, 31, 28, 35, 32, 29
  , 2, 5, 8, 1, 4, 7, 0, 3, 6
  , 38, 41, 44, 37, 40, 43, 36, 39, 42];
const Zinverse = invert(Z);

const Y = combine(Z, combine(X, Zinverse));
const Yinverse = invert(Y);

export const perspectivePermutations: PerspectivePermutations = {
  X,
  Y,
  Z,
  "X'": Xinverse,
  "Y'": Yinverse,
  "Z'": Zinverse,
};

export type RotationPermutationName = "U" | "U'" | "L" | "L'" | "F" | "F'" | "R" | "R'" | "B" | "B'" | "D" | "D'";
export type RotationPermutations = { [name in RotationPermutationName]: Permutation };

const R: Permutation = [0, 1, 11, 3, 4, 14, 6, 7, 17
  , 9, 10, 47, 12, 13, 50, 15, 16, 53
  , 24, 21, 18, 25, 22, 19, 26, 23, 20
  , 8, 28, 29, 5, 31, 32, 2, 34, 35
  , 36, 37, 38, 39, 40, 41, 42, 43, 44
  , 45, 46, 33, 48, 49, 30, 51, 52, 27];
const Rinverse = invert(R);

const F = combines(Y, R, Yinverse);
const Finverse = invert(F);

const L = combines(Y, F, Yinverse);
const Linverse = invert(L);

const B = combines(Y, L, Yinverse);
const Binverse = invert(B);

const U = combines(Z, R, Zinverse);
const Uinverse = invert(U);

const D = combines(Zinverse, R, Z);
const Dinverse = invert(D);

export const rotationPermutations: RotationPermutations = {
  R,
  F,
  L,
  B,
  U,
  D,
  "R'": Rinverse,
  "F'": Finverse,
  "L'": Linverse,
  "B'": Binverse,
  "U'": Uinverse,
  "D'": Dinverse,
};
