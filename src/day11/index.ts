import run from "aocrunner";
import exp from "constants";
import _, { get } from "lodash";

type Data = "." | "#";

function parseInput(rawInput: string): Data[][] {
  return rawInput.split("\n").map((line) => {
    return line.split("") as Data[];
  });
}

// function getExpansions(data: Data[][]): {rows: number[], cols: number[]} {
//   const expansions = {rows: [], cols: []} as ReturnType<typeof getExpansions>;
//   for (let row = 0; row < data.length; row++) {
//     if (_.every(data[row], (d) => d === ".")) {
//       expansions.rows.push(row);
//     }
//   }

//   for (let col = 0; col < data[0].length; col++) {

//   return expansions;
// }

function getExpanded(data: Data[][]): Data[][] {
  let expanded = _.cloneDeep(data);
  for (let row = data.length - 1; row >= 0; row--) {
    if (_.every(data[row], (d) => d === ".")) {
      expanded.splice(row, 0, _.clone(data[row]));
    }
  }

  for (let col = data[0].length - 1; col >= 0; col--) {
    if (_.every(data, (d) => d[col] === ".")) {
      expanded.forEach((row) => row.splice(col, 0, "."));
    }
  }
  return expanded;
}

function getExpansions(data: Data[][]): { rows: number[]; cols: number[] } {
  let expansions = { rows: [], cols: [] } as ReturnType<typeof getExpansions>;
  for (let row = 0; row < data.length; row++) {
    if (_.every(data[row], (d) => d === ".")) {
      expansions.rows.push(row);
    }
  }

  for (let col = 0; col < data[0].length; col++) {
    if (_.every(data, (d) => d[col] === ".")) {
      expansions.cols.push(col);
    }
  }

  return expansions;
}

function findGalaxies(data: Data[][]): [number, number][] {
  let galaxies: [number, number][] = [];
  for (let row = 0; row < data.length; row++) {
    for (let col = 0; col < data[row].length; col++) {
      if (data[row][col] === "#") {
        galaxies.push([row, col]);
      }
    }
  }
  return galaxies;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const data = getExpanded(input);
  const galaxies = findGalaxies(data);

  let shortestPaths = [] as number[];
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      const a = galaxies[i];
      const b = galaxies[j];
      shortestPaths.push(Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]));
    }
  }

  return _.sum(shortestPaths);
};

const part2 = (rawInput: string) => {
  const expansionRate = 1_000_000;
  const input = parseInput(rawInput);
  const expansions = getExpansions(input);
  const galaxies = findGalaxies(input);

  let shortestPaths = [] as number[];
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      const a = galaxies[i];
      const b = galaxies[j];
      const top = Math.min(a[0], b[0]);
      const bottom = Math.max(a[0], b[0]);
      const left = Math.min(a[1], b[1]);
      const right = Math.max(a[1], b[1]);
      // Find out how many rows and columns are expanded.
      const rowExpansions = expansions.rows.filter(
        (row) => row > top && row < bottom,
      ).length;
      const colExpansions = expansions.cols.filter(
        (col) => col > left && col < right,
      ).length;
      const shortestPath =
        Math.abs(a[0] - b[0]) +
        Math.abs(a[1] - b[1]) -
        (rowExpansions + colExpansions) +
        expansionRate * (rowExpansions + colExpansions);
      shortestPaths.push(shortestPath);
    }
  }

  return _.sum(shortestPaths);
};

run({
  part1: {
    tests: [
      {
        input: `
          ...#......
          .......#..
          #.........
          ..........
          ......#...
          .#........
          .........#
          ..........
          .......#..
          #...#.....`,
        expected: 374,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          ...#......
          .......#..
          #.........
          ..........
          ......#...
          .#........
          .........#
          ..........
          .......#..
          #...#.....`,
        // expected: 1030, // expansionRate = 10;
        expected: 82000210, // expansionRate = 1_000_000;
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
