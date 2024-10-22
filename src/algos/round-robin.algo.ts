import type { Algo } from "./algo.interface.js";

export class RoundRobinAlgo implements Algo {
  static name = 'round-robin';
  private nextIndex = 0;

  constructor (private readonly array: unknown[]) {
    if (array.length === 0) {
      throw new Error('RoundRobinAlgo: invalid array: empty');
    }
  }

  next<T>(): T {
    const entry = this.array[this.nextIndex];

    const nextIndex = this.nextIndex + 1;
    this.nextIndex = nextIndex < this.array.length ? nextIndex : 0;

    return entry as T;
  }
}