import run from "aocrunner";
import _ from "lodash";

type Parsed = {
  sequence: ("L" | "R")[];
  routes: Record<string, { L: string; R: string }>;
};

function parseInput(rawInput: string): Parsed {
  const [rawSequence, rawRoutes] = rawInput.split("\n\n");
  const sequence = rawSequence.split("").map((char) => char as "L" | "R");
  const routes = {} as Parsed["routes"];
  rawRoutes.split("\n").forEach((line) => {
    const key = line.slice(0, 3);
    const L = line.slice(7, 10);
    const R = line.slice(12, 15);
    routes[key] = { L, R };
  });

  return { sequence, routes };
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let current = "AAA";
  let sequenceIndex = 0;
  let steps = 0;
  while (current !== "ZZZ") {
    const direction = input.sequence[sequenceIndex];
    current = input.routes[current][direction];
    sequenceIndex = (sequenceIndex + 1) % input.sequence.length;
    steps++;
  }

  return steps;
};

// Computes the LCM of a list of numbers.
function leastCommonMultiple(numbers: number[]) {
  const max = Math.max(...numbers);
  let multiple = max;
  while (true) {
    if (numbers.every((number) => multiple % number === 0)) {
      return multiple;
    }
    multiple += max;
  }
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let starts = Object.keys(input.routes).filter((route) => route.endsWith("A"));
  const stepsToZ = starts.map((current) => {
    let sequenceIndex = 0;
    let steps = 0;
    while (!current.endsWith("Z")) {
      const direction = input.sequence[sequenceIndex];
      current = input.routes[current][direction];
      sequenceIndex = (sequenceIndex + 1) % input.sequence.length;
      steps++;
    }
    return steps;
  });

  return leastCommonMultiple(stepsToZ);
};

run({
  part1: {
    tests: [
      {
        input: `
        RL

        AAA = (BBB, CCC)
        BBB = (DDD, EEE)
        CCC = (ZZZ, GGG)
        DDD = (DDD, DDD)
        EEE = (EEE, EEE)
        GGG = (GGG, GGG)
        ZZZ = (ZZZ, ZZZ)`,
        expected: 2,
      },
      {
        input: `
        LLR

        AAA = (BBB, BBB)
        BBB = (AAA, ZZZ)
        ZZZ = (ZZZ, ZZZ)`,
        expected: 6,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          LR

          11A = (11B, XXX)
          11B = (XXX, 11Z)
          11Z = (11B, XXX)
          22A = (22B, XXX)
          22B = (22C, 22C)
          22C = (22Z, 22Z)
          22Z = (22B, 22B)
          XXX = (XXX, XXX)`,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
