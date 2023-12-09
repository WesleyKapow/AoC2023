import run from "aocrunner";
import _ from "lodash";

const parseInput = (rawInput: string) => rawInput;

const CARD_STRENGTHS = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  T: 10,
  "9": 9,
  "8": 8,
  "7": 7,
  "6": 6,
  "5": 5,
  "4": 4,
  "3": 3,
  "2": 2,
};

type Hand = {
  hand: string;
  // 1 - 7: high card, one pair, two pair, three of a kind, full house, four of a kind, five of a kind.
  strength: number;
  bid: number;
};

function handStrength(hand: string): number {
  const cardCounts = hand.split("").reduce((acc, card) => {
    acc[card] = acc[card] ? acc[card] + 1 : 1;
    return acc;
  }, {} as Record<string, number>);

  const keys = Object.keys(cardCounts);
  const values = Object.values(cardCounts);

  switch (keys.length) {
    default:
    case 5: // high card
      return 1;
    case 4: // 1 pair
      return 2;
    case 3: // 2 pair or 3 of a kind
      return values.includes(2) ? 3 : 4;
    case 2: // full house or 4 of a kind
      return values.includes(3) ? 5 : 6;
    case 1: // 5 of a kind
      return 7;
  }
}

function parseInputToHands(rawInput: string): Hand[] {
  const lines = rawInput.split("\n");
  return lines.map((line) => {
    const [hand, bid] = line.split(" ");

    return { hand, strength: handStrength(hand), bid: Number(bid) };
  });
}

function strCompareHand(hand: string, withJokers: boolean = false) {
  return hand
    .replace(/A/g, "E")
    .replace(/K/g, "D")
    .replace(/Q/g, "C")
    .replace(/J/g, withJokers ? "1" : "B") // Jokers rank lower than 2's
    .replace(/T/g, "A");
}

const part1 = (rawInput: string) => {
  const hands = parseInputToHands(rawInput);
  const winnings = _.sortBy(hands, (hand) => [
    hand.strength,
    strCompareHand(hand.hand),
  ]).map((hand, index) => hand.bid * (index + 1));

  return _.sum(winnings);
};

function handStrength2(hand: string): number {
  const cardCounts = hand.split("").reduce((acc, card) => {
    acc[card] = acc[card] ? acc[card] + 1 : 1;
    return acc;
  }, {} as Record<string, number>);

  // Add number of jokers to whichever card there's the most of.
  const jokerCount = cardCounts["J"] || 0;
  if (jokerCount > 0 && jokerCount < 5) {
    delete cardCounts["J"];
    // Find card with highest count.
    const high = _.orderBy(
      Object.entries(cardCounts).map(([card, count]) => {
        return { card, count };
      }),
      "count",
      "desc",
    );
    // Add jokers to it.
    cardCounts[high[0].card] += jokerCount;
  }

  const keys = Object.keys(cardCounts);
  const values = Object.values(cardCounts);

  switch (keys.length) {
    default:
    case 5: // high card
      return 1;
    case 4: // 1 pair
      return 2;
    case 3: // 2 pair or 3 of a kind
      return values.includes(2) ? 3 : 4;
    case 2: // full house or 4 of a kind
      return values.includes(3) ? 5 : 6;
    case 1: // 5 of a kind
      return 7;
  }
}

function parseInputToHands2(rawInput: string): Hand[] {
  const lines = rawInput.split("\n");
  return lines.map((line) => {
    const [hand, bid] = line.split(" ");

    return { hand, strength: handStrength2(hand), bid: Number(bid) };
  });
}

const part2 = (rawInput: string) => {
  const hands = parseInputToHands2(rawInput);
  const sorted = _.sortBy(hands, (hand) => [
    hand.strength,
    strCompareHand(hand.hand, true),
  ]);
  const winnings = sorted.map((hand, index) => hand.bid * (index + 1));

  return _.sum(winnings);
};

run({
  part1: {
    tests: [
      {
        input: `
          32T3K 765
          T55J5 684
          KK677 28
          KTJJT 220
          QQQJA 483`,
        expected: 6440,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          32T3K 765
          T55J5 684
          KK677 28
          KTJJT 220
          QQQJA 483`,
        expected: 5905,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
