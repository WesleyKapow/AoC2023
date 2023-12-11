import run from "aocrunner";
import { on } from "events";
import _, { last } from "lodash";

type Tile = "|" | "-" | "L" | "J" | "7" | "F" | "." | "S";

// Enum for directions
enum Dir {
  Up,
  Down,
  Left,
  Right,
}

const directions = {
  [Dir.Up]: [-1, 0],
  [Dir.Down]: [1, 0],
  [Dir.Left]: [0, -1],
  [Dir.Right]: [0, 1],
} as Record<Dir, [number, number]>;

function tileToDirection(tile: Tile, dir: Dir): Dir | undefined {
  switch (tile) {
    case "|":
      if ([Dir.Left, Dir.Right].includes(dir)) return undefined;
      return dir; // Keep going up or down.
    case "-":
      if ([Dir.Up, Dir.Down].includes(dir)) return undefined;
      return dir; // Keep going left or right.
    case "L":
      if ([Dir.Up, Dir.Right].includes(dir)) return undefined;
      return dir === Dir.Left ? Dir.Up : Dir.Right;
    case "J":
      if ([Dir.Up, Dir.Left].includes(dir)) return undefined;
      return dir === Dir.Right ? Dir.Up : Dir.Left;
    case "7":
      if ([Dir.Down, Dir.Left].includes(dir)) return undefined;
      return dir === Dir.Right ? Dir.Down : Dir.Left;
    case "F":
      if ([Dir.Down, Dir.Right].includes(dir)) return undefined;
      return dir === Dir.Left ? Dir.Down : Dir.Right;
    default:
      return undefined;
  }
}

function parseInput(rawInput: string): Tile[][] {
  return rawInput.split("\n").map((line) => {
    return line.split("") as Tile[];
  });
}

function findStart(input: Tile[][]): [number, number] {
  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[row].length; col++) {
      if (input[row][col] === "S") {
        return [row, col];
      }
    }
  }
  console.error("No start found");
  return [-1, -1];
}

function walk(current: [number, number], dir: Dir): [number, number] {
  const jump = directions[dir];
  return [current[0] + jump[0], current[1] + jump[1]];
}

function walkThePipes(input: Tile[][], start: [number, number], dir: Dir) {
  let position = start;
  let currentDir = dir;
  let steps = 0;
  while (true) {
    position = walk(position, currentDir);
    // Check if we fell off our map.
    if (
      position[0] < 0 ||
      position[0] >= input.length ||
      position[1] < 0 ||
      position[1] >= input[position[0]].length
    ) {
      return undefined;
    }

    const tile = input[position[0]][position[1]];
    // console.log("current tile", tile, position, currentDir);

    // Are we done?
    if (tile === "S") {
      return steps;
    }

    const nextDir = tileToDirection(tile, currentDir);
    if (nextDir === undefined) {
      return undefined;
    }
    currentDir = nextDir;

    steps++;
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  for (const dir of [Dir.Up, Dir.Down, Dir.Left, Dir.Right]) {
    const steps = walkThePipes(input, findStart(input), dir);
    if (steps) return Math.ceil(steps / 2);
  }

  return undefined;
};

function getStartTile(dir1: Dir, dir2: Dir): Tile | undefined {
  switch (dir1) {
    case Dir.Up:
      switch (dir2) {
        case Dir.Up:
          return "|";
        case Dir.Left:
          return "L";
        case Dir.Right:
          return "J";
      }

    case Dir.Down:
      switch (dir2) {
        case Dir.Down:
          return "|";
        case Dir.Left:
          return "F";
        case Dir.Right:
          return "7";
      }

    case Dir.Right:
      switch (dir2) {
        case Dir.Right:
          return "-";
        case Dir.Down:
          return "L";
        case Dir.Up:
          return "F";
      }

    case Dir.Left:
      switch (dir2) {
        case Dir.Left:
          return "-";
        case Dir.Down:
          return "J";
        case Dir.Up:
          return "7";
      }
  }

  return undefined;
}

function walkThePipes2(input: Tile[][], start: [number, number], dir: Dir) {
  let position = start;
  let currentDir = dir;
  let onPathMap = input.map((row) => row.map(() => false));
  while (true) {
    onPathMap[position[0]][position[1]] = true;
    position = walk(position, currentDir);
    // Check if we fell off our map.
    if (
      position[0] < 0 ||
      position[0] >= input.length ||
      position[1] < 0 ||
      position[1] >= input[position[0]].length
    ) {
      return undefined;
    }

    const tile = input[position[0]][position[1]];

    // Are we done?
    if (tile === "S") {
      // Modify input to replace S with it's real tile.
      const startTile = getStartTile(dir, currentDir);
      if (startTile === undefined) return undefined;
      input[start[0]][start[1]] = startTile;
      return onPathMap;
    }

    const nextDir = tileToDirection(tile, currentDir);
    if (nextDir === undefined) {
      return undefined;
    }
    currentDir = nextDir;
  }
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let onPathMap: boolean[][] | undefined;
  for (const dir of [Dir.Up, Dir.Down, Dir.Left, Dir.Right]) {
    onPathMap = walkThePipes2(input, findStart(input), dir);
    if (onPathMap === undefined) continue;
    else break;
  }
  if (onPathMap === undefined) return undefined;
  let insideCount = 0;

  // .|II||II|.
  // .L--JL--J.
  // L--JxL7...LJS7F-7L7x
  for (let row = 0; row < input.length; row++) {
    let inside = false;
    let lastCorner: Tile | undefined;
    for (let col = 0; col < input[row].length; col++) {
      const tile = input[row][col];
      const onPath = onPathMap[row][col];
      //.|L-7F-J|.

      if (onPath && tile === "|") {
        // Simple flip.
        inside = !inside;
      } else if (onPath && tile === "-") {
        continue; // No flip.
      } else if (onPath && !lastCorner) {
        lastCorner = tile; // No flip, but record our corner.
      } else if (onPath) {
        switch (lastCorner) {
          case "L":
            // LJ doesn't change it, but L-7 does.
            // .┕┘. vs .└┐.
            inside = tile === "7" ? !inside : inside;
            lastCorner = undefined;
            break;
          case "F":
            // F7 doesn't change it, but FJ does.
            // .┎┐. vs .┍┙.
            inside = tile === "J" ? !inside : inside;
            lastCorner = undefined;
            break;
        }
      } else if (inside) {
        insideCount++;
      }
    }
    // console.log("row", row, "insideCount", insideCount);
  }

  return insideCount;
};

run({
  part1: {
    tests: [
      {
        input: `
        ..F7.
        .FJ|.
        SJ.L7
        |F--J
        LJ...`,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          ..........
          .S------7.
          .|F----7|.
          .||OOOO||.
          .||OOOO||.
          .|L-7F-J|.
          .|II||II|.
          .L--JL--J.
          ..........`,
        expected: 4,
      },
      {
        input: `
          .F----7F7F7F7F-7....
          .|F--7||||||||FJ....
          .||.FJ||||||||L7....
          FJL7L7LJLJ||LJ.L-7..
          L--J.L7...LJS7F-7L7.
          ....F-J..F7FJ|L7L7L7
          ....L7.F7||L7|.L7L7|
          .....|FJLJ|FJ|F7|.LJ
          ....FJL-7.||.||||...
          ....L---J.LJ.LJLJ...`,
        expected: 8,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
