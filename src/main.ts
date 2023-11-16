import { range } from "./Functional.ts";

function add(a: number, b: number): number {
  return a + b;
}

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  console.log("Add 2 + 3 =", add(2, 3));
  console.log("range(1).take(5).reduce1(add)");
  const sum = range(1).take(5).reduce1(add);
  console.log(sum);
}
