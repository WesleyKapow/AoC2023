import run from "aocrunner";
import _ from "lodash";

const parseInput = (rawInput: string) => rawInput;

function parse(input: string) {
  const [time, distance] = input.split("\n");
  return {
    times: time.match(/\d+/g)?.map(Number) ?? [],
    distances: distance.match(/\d+/g)?.map(Number) ?? [],
  };
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const { times, distances } = parse(input);

  const wins: number[] = [];
  for (let i = 0; i < times.length; i++) {
    const time = times[i];
    const distance = distances[i];
    let winners = 0;
    for (let t = 0; t < time; t++) {
      if (t * (time - t) > distance) {
        winners++;
      }
    }
    wins.push(winners);
  }

  return wins.reduce((a, b) => a * b, 1);
};

function quadratic(a: number, b: number, c: number) {
  const d = b * b - 4 * a * c;
  if (d < 0) {
    return [];
  }
  const sqrtD = Math.sqrt(d);
  return [(-b + sqrtD) / (2 * a), (-b - sqrtD) / (2 * a)];
}

// The math way!
const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const { times, distances } = parse(input.replace(/ /g, ""));

  // There's really only one.
  const time = times[0];
  const distance = distances[0];

  // What we want is to find t where:
  // t * (time - t) > distance
  // We can do this by setting it equal and solving for t.
  // t * (time - t) = distance
  // t^2 - time * t + distance = 0
  const solutions = quadratic(1, -time, distance);

  // All numbers between these two numbers will satisfy the
  // above "> distance" equation.
  // So we round the low end up and the high end down.
  const [t1, t2] = _.sortBy(solutions);
  const start = Math.ceil(t1);
  const end = Math.floor(t2);

  // We want the number of t's that satisfy the equation.
  // e.g. [20,30] (inclusive!) would give 11.
  return end - start + 1;
};

// Just like part1.
const part2_brute_force = (rawInput: string) => {
  const input = parseInput(rawInput);
  const { times, distances } = parse(input.replace(/ /g, ""));

  const wins: number[] = [];
  for (let i = 0; i < times.length; i++) {
    const time = times[i];
    const distance = distances[i];
    let winners = 0;
    for (let t = 0; t < time; t++) {
      if (t * (time - t) > distance) {
        winners++;
      }
    }
    wins.push(winners);
  }

  return wins.reduce((a, b) => a * b, 1);
};

run({
  part1: {
    tests: [
      {
        input: `
          Time:      7  15   30
          Distance:  9  40  200`,
        expected: 288,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          Time:      71530
          Distance:  940200`,
        expected: 71503,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
