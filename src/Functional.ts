import { Lazy } from "./Lazy.ts";

export function range(
  start: number,
  end = Number.MAX_SAFE_INTEGER,
): Lazy<number> {
  return new Lazy(function* () {
    for (let index = start; index < end; ++index) {
      yield index;
    }
  }());
}
