import run from "aocrunner";
import _ from "lodash";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");

  const parts: number[] = [];
  lines.forEach((line, row) => {
    let matches = [...line.matchAll(/(\d+)/g)];
    matches.forEach((match) => {
      if (match.index !== undefined) {
        const col = match.index;
        const part = match[0];
        if (isAdjacentToSymbol(lines, row, col, part)) {
          parts.push(parseInt(part));
        }
      }
    });
  });

  return _.sum(parts);
};

// Look at column before first character.
// Look at column of each character.
// Look at column after last character.
function isAdjacentToSymbol(
  lines: string[],
  row: number,
  col: number,
  part: string,
): boolean {
  const startCol = Math.max(col - 1, 0);
  const endCol = Math.min(col + part.length, lines[row].length - 1);

  const startRow = Math.max(row - 1, 0);
  const endRow = Math.min(row + 1, lines.length - 1);

  for (let c = startCol; c <= endCol; c++) {
    for (let r = startRow; r <= endRow; r++) {
      if (/[^\d\.]/.test(lines[r][c])) {
        return true;
      }
    }
  }

  return false;
}

type MaybeGears = Record<number, Record<number, number[]>>;

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const lines = input.split("\n");
  const maybeGears = {} as MaybeGears;

  lines.forEach((line, row) => {
    let matches = [...line.matchAll(/(\d+)/g)];
    matches.forEach((match) => {
      if (match.index !== undefined) {
        const col = match.index;
        const part = match[0];
        recordMaybeGears(maybeGears, lines, row, col, part);
      }
    });
  });

  const gears = _.flatten(_.values(maybeGears).map(_.values)).filter(
    (gear) => gear.length === 2,
  );
  const gearRations = gears.map(([a, b]) => a * b);
  return _.sum(gearRations);
};

// Look at column before first character.
// Look at column of each character.
// Look at column after last character.
function recordMaybeGears(
  maybeGears: MaybeGears,
  lines: string[],
  row: number,
  col: number,
  part: string,
): boolean {
  const startCol = Math.max(col - 1, 0);
  const endCol = Math.min(col + part.length, lines[row].length - 1);
  const partNumber = parseInt(part);

  const startRow = Math.max(row - 1, 0);
  const endRow = Math.min(row + 1, lines.length - 1);

  for (let c = startCol; c <= endCol; c++) {
    for (let r = startRow; r <= endRow; r++) {
      if (lines[r][c] === "*") {
        if (!maybeGears[r]) maybeGears[r] = {};
        if (!maybeGears[r][c]) maybeGears[r][c] = [];
        maybeGears[r][c].push(partNumber);
      }
    }
  }

  return false;
}

run({
  part1: {
    tests: [
      {
        input: `
        467..114..
        ...*......
        ..35..633.
        ......#...
        617*......
        .....+.58.
        ..592.....
        ......755.
        ...$.*....
        .664.598..`,
        expected: 4361,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          467..114..
          ...*......
          ..35..633.
          ......#...
          617*......
          .....+.58.
          ..592.....
          ......755.
          ...$.*....
          .664.598..`,
        expected: 467835,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
