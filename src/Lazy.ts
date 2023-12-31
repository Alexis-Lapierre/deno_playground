export type LazyGenerator<T> = Generator<T, void, void>;

export class Lazy<A> {
  constructor(private readonly lazy: LazyGenerator<A>) {}

  concat(...values: Lazy<A>[]): Lazy<A> {
    return new Lazy(function* () {
      for (const value of values) {
        yield* value.lazy;
      }
    }());
  }

  entries(): Lazy<[number, A]> {
    const _lazy = this.lazy;
    return new Lazy(function* () {
      let index = -1;
      while (true) {
        const next = _lazy.next();

        if (next.done) {
          return;
        }

        yield [++index, next.value];
      }
    }());
  }

  every(lambda: (a: A) => boolean): boolean {
    for (const elem of this.lazy) {
      if (lambda(elem) === false) {
        return false;
      }
    }
    return true;
  }

  fill<B>(defaultValue: B): Lazy<B> {
    return this.map(() => defaultValue);
  }

  filter(lambda: (a: A) => boolean): Lazy<A> {
    const _lazy = this.lazy;
    return new Lazy(function* () {
      for (const elem of _lazy) {
        if (lambda(elem)) {
          yield elem;
        }
      }
    }());
  }

  find(lambda: (a: A) => boolean): A | undefined {
    for (const elem of this.lazy) {
      if (lambda(elem)) {
        return elem;
      }
    }
    return undefined;
  }

  map<B>(lambda: (a: A) => B): Lazy<B> {
    const _lazy = this.lazy;
    return new Lazy(function* () {
      for (const elem of _lazy) {
        yield lambda(elem);
      }
    }());
  }

  take(n: number): Lazy<A> {
    const _lazy = this.lazy;
    return new Lazy(function* () {
      let next = _lazy.next();
      while (n !== 0 && next.done === false) {
        yield next.value;
        next = _lazy.next();
        --n;
      }
    }());
  }

  push(...aList: A[]): Lazy<A> {
    const _lazy = this.lazy;
    return new Lazy(function* () {
      yield* _lazy;
      for (const a of aList) {
        yield a;
      }
    }());
  }

  reduce<Result>(
    lambda: (acc: Result, elem: A) => Result,
    startingValue: Result,
  ): Result {
    let result = startingValue;
    for (const elem of this.lazy) {
      result = lambda(result, elem);
    }
    return result;
  }

  reduce1(lambda: (acc: A, elem: A) => A): A {
    const first = this.lazy.next();
    if (first.done === true) {
      throw new TypeError("Reduce of empty lazy list with no initial value");
    }
    let result = first.value;
    for (const elem of this.lazy) {
      result = lambda(result, elem);
    }
    return result;
  }

  shift(): A {
    return this.lazy.next().value as A;
  }

  some(lambda: (a: A) => boolean): boolean {
    for (const elem of this.lazy) {
      if (lambda(elem) === true) {
        return true;
      }
    }
    return false;
  }

  collect(): A[] {
    return this.reduce((acc, elem) => acc.concat(elem), <A[]> []);
  }

  toString(): string {
    try {
      return this.map(String).reduce1((str, elem) => `${str},${String(elem)}`);
    } catch {
      return "";
    }
  }

  static from<A>(input: ArrayLike<A> | Iterable<A>): Lazy<A> {
    return lazy(input);
  }
}

function lazy<A>(input: ArrayLike<A> | Iterable<A>): Lazy<A> {
  if (isArrayLike(input)) {
    return new Lazy(lazyArray(input));
  } else {
    return new Lazy(lazyIterator(input));
  }
}

function isArrayLike(arrayLike: unknown): arrayLike is ArrayLike<unknown> {
  return (arrayLike as ArrayLike<unknown>).length !== undefined;
}

function* lazyArray<T>(arrayLike: ArrayLike<T>): LazyGenerator<T> {
  for (let index = 0; index < arrayLike.length; ++index) {
    yield arrayLike[index];
  }
}

function* lazyIterator<A>(iter: Iterable<A>): LazyGenerator<A> {
  for (const elem of iter) {
    yield elem;
  }
}
