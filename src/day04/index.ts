import run from "aocrunner";
import _ from "lodash";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const cards = cleanInput(input);
  const matchCounts = cards.map((card) => {
    return _.intersection(card.winners, card.ours).length;
  });
  const points = matchCounts.map((count) => (count ? 2 ** (count - 1) : 0));

  return _.sum(points);
};

function cleanInput(input: string): { winners: number[]; ours: number[] }[] {
  // Remove the "Card X: " part.
  input = input.replace(/Card \d: /g, "");
  // Split into rows.
  const rows = input.split("\n");
  // Split into winning numbers and our numbers.
  return rows.map((row) => {
    const [winners, ours] = row.split(" | ");
    return {
      winners: winners.split(/\s+/).map(Number),
      ours: ours.split(/\s+/).map(Number),
    };
  });
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const cards = cleanInput(input);
  const matchCounts = cards.map((card) => {
    return _.intersection(card.winners, card.ours).length;
  });

  const copyCounts = new Array(cards.length).fill(1);

  matchCounts.forEach((matches, index) => {
    const numCopies = copyCounts[index];
    for (let i = 1; i <= matches; i++) {
      copyCounts[index + i] += numCopies;
    }
  });
  return _.sum(copyCounts);
};

run({
  part1: {
    tests: [
      {
        input: `
        Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
        Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
        Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
        Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
        Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
        Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
        Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
        Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
        Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
        Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
        Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: 30,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
