import run from "aocrunner";
import _ from "lodash";

type Parsed = {
  history: number[];
};

function parseInput(rawInput: string): Parsed[] {
  return rawInput.split("\n").map((line) => {
    return { history: line.split(" ").map((num) => parseInt(num)) };
  });
}

function computePrediction(input: Parsed): number {
  const lasts = [] as number[];
  let diffs = input.history;
  while (!_.every(diffs, (diff) => diff === 0)) {
    lasts.push(_.last(diffs) as number);
    const newDiffs = [] as number[];
    for (let i = 0; i < diffs.length - 1; i++) {
      newDiffs.push(diffs[i + 1] - diffs[i]);
    }
    diffs = newDiffs;
  }
  // console.log("lasts", lasts);

  return _.sum(lasts);
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const predictions = input.map(computePrediction);

  return _.sum(predictions);
};

function computePrediction2(input: Parsed): number {
  const firsts = [] as number[];
  let diffs = input.history;
  while (!_.every(diffs, (diff) => diff === 0)) {
    firsts.push(_.first(diffs) as number);
    const newDiffs = [] as number[];
    for (let i = 0; i < diffs.length - 1; i++) {
      newDiffs.push(diffs[i + 1] - diffs[i]);
    }
    diffs = newDiffs;
  }
  diffs.push(0);

  return firsts.reverse().reduce((a, b) => b - a);
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const predictions = input.map(computePrediction2);

  return _.sum(predictions);
};

run({
  part1: {
    tests: [
      {
        input: `
          0 3 6 9 12 15
          1 3 6 10 15 21
          10 13 16 21 30 45`,
        expected: 114,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          0 3 6 9 12 15
          1 3 6 10 15 21
          10 13 16 21 30 45`,
        expected: 2,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
