import run from "aocrunner";
import _ from "lodash";

type KeyOfType<T, V> = keyof {
  [P in keyof T as T[P] extends V ? P : never]: any;
};

const parseInput = (rawInput: string) => rawInput;

type CategoryMapRange = {
  destinationRangeStart: number;
  sourceRangeStart: number;
  rangeLength: number;
};

type Almanac = {
  seeds: number[];
  soil: CategoryMapRange[];
  fertilizer: CategoryMapRange[];
  water: CategoryMapRange[];
  light: CategoryMapRange[];
  temperature: CategoryMapRange[];
  humidity: CategoryMapRange[];
  location: CategoryMapRange[];
};

const CATEGORIES: KeyOfType<Almanac, CategoryMapRange[]>[] = [
  "soil",
  "fertilizer",
  "water",
  "light",
  "temperature",
  "humidity",
  "location",
];

function parseAlmanac(rawAlmanac: string): Almanac {
  const almanac: Almanac = {
    seeds: [],
    soil: [],
    fertilizer: [],
    water: [],
    light: [],
    temperature: [],
    humidity: [],
    location: [],
  };

  // Split input text into category blocks.
  const categoryBlocks = rawAlmanac.split("\n\n");

  almanac.seeds = categoryBlocks[0]
    .replace("seeds: ", "")
    .split(" ")
    .map(parseFloat);

  CATEGORIES.forEach((category, index) => {
    // Skip seed block.
    const categoryBlock = categoryBlocks[index + 1];
    almanac[category] = categoryBlock
      .split("\n")
      .slice(1) // Skip "category-to-category map:" line.
      .map((line) => {
        const [destinationRangeStart, sourceRangeStart, rangeLength] = line
          .split(" ")
          .map(parseFloat);
        const f = { destinationRangeStart, sourceRangeStart, rangeLength };
        return f;
      });
  });

  return almanac;
}

// Map a value from one category to another.
function mapCategory(categoryMap: CategoryMapRange[], source: number): number {
  for (const map of categoryMap) {
    // Example, source: 98 range: 2
    if (
      source >= map.sourceRangeStart &&
      source < map.sourceRangeStart + map.rangeLength
    ) {
      return map.destinationRangeStart + (source - map.sourceRangeStart);
    }
  }

  // If source is never in the map, then it maps to itself in the
  // destination category.
  return source;
}

function seedToLocation(almanac: Almanac, seed: number): number {
  let source = seed;
  for (const category of CATEGORIES) {
    source = mapCategory(almanac[category], source);
  }
  return source;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const almanac = parseAlmanac(input);
  const locations = almanac.seeds.map((seed) => seedToLocation(almanac, seed));
  return _.min(locations);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const almanac = parseAlmanac(input);

  // Seeds come in pairs, so chunk our seeds array into pairs.
  const seedRanges = _.chunk(almanac.seeds, 2);

  let minLocation = Infinity;
  seedRanges.forEach(([start, range]) => {
    for (let seed = start; seed < start + range; seed++) {
      minLocation = Math.min(minLocation, seedToLocation(almanac, seed));
    }
  });

  return minLocation;
};

run({
  part1: {
    tests: [
      {
        input: `
          seeds: 79 14 55 13

          seed-to-soil map:
          50 98 2
          52 50 48

          soil-to-fertilizer map:
          0 15 37
          37 52 2
          39 0 15

          fertilizer-to-water map:
          49 53 8
          0 11 42
          42 0 7
          57 7 4

          water-to-light map:
          88 18 7
          18 25 70

          light-to-temperature map:
          45 77 23
          81 45 19
          68 64 13

          temperature-to-humidity map:
          0 69 1
          1 0 69

          humidity-to-location map:
          60 56 37
          56 93 4`,
        expected: 35,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          seeds: 79 14 55 13

          seed-to-soil map:
          50 98 2
          52 50 48

          soil-to-fertilizer map:
          0 15 37
          37 52 2
          39 0 15

          fertilizer-to-water map:
          49 53 8
          0 11 42
          42 0 7
          57 7 4

          water-to-light map:
          88 18 7
          18 25 70

          light-to-temperature map:
          45 77 23
          81 45 19
          68 64 13

          temperature-to-humidity map:
          0 69 1
          1 0 69

          humidity-to-location map:
          60 56 37
          56 93 4`,
        expected: 46,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
