import type { LazyGenerator } from "./Lazy.ts";

export function* generateRandomDifferentNumber(
  low: number,
  high: number,
): LazyGenerator<number> {
  const generated: number[] = [];
  const generate = () => Math.floor(low + (Math.random() * (high - low)));

  while (true) {
    const newNumber = generate();
    if (generated.indexOf(newNumber) === -1) {
      generated.push(newNumber);
      yield newNumber;
    }
  }
}
