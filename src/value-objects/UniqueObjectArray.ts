interface ComparableItem {
  isEqual(item: unknown): boolean;
}

export class UniqueObjectArray<
  T extends ComparableItem,
> implements Iterable<T> {
  private readonly items: readonly T[];
  private readonly buckets = new Map<string, T[]>();

  private static keyOf(item: ComparableItem): string {
    return `${item.constructor.name}:${String(item.valueOf())}`;
  }

  public static fromArray<T extends ComparableItem>(
    array: Iterable<T>,
  ): UniqueObjectArray<T> {
    return new UniqueObjectArray<T>(array);
  }

  constructor(items: Iterable<T> = []) {
    const unique: T[] = [];

    for (const item of items) {
      const key = UniqueObjectArray.keyOf(item);
      const bucket = this.buckets.get(key);

      if (bucket === undefined) {
        this.buckets.set(key, [item]);
        unique.push(item);
      } else if (!bucket.some((one) => one.isEqual(item))) {
        bucket.push(item);
        unique.push(item);
      }
    }

    this.items = unique;
  }

  public get length(): number {
    return this.items.length;
  }

  public includes(item: T): boolean {
    const bucket = this.buckets.get(UniqueObjectArray.keyOf(item));

    return bucket !== undefined && bucket.some((one) => one.isEqual(item));
  }

  public push(...items: T[]): UniqueObjectArray<T> {
    return new UniqueObjectArray<T>([...this.items, ...items]);
  }

  public remove(item: T): UniqueObjectArray<T> {
    return this.filter((one) => !one.isEqual(item));
  }

  public isEmpty(): boolean {
    return this.items.length === 0;
  }

  public at(index: number): T | undefined {
    return this.items.at(index);
  }

  public find(predicate: (item: T, index: number) => boolean): T | undefined {
    return this.items.find(predicate);
  }

  public filter(
    predicate: (item: T, index: number) => boolean,
  ): UniqueObjectArray<T> {
    return new UniqueObjectArray<T>(this.items.filter(predicate));
  }

  public map<U>(callback: (item: T, index: number) => U): U[] {
    return this.items.map(callback);
  }

  public some(predicate: (item: T, index: number) => boolean): boolean {
    return this.items.some(predicate);
  }

  public every(predicate: (item: T, index: number) => boolean): boolean {
    return this.items.every(predicate);
  }

  public forEach(callback: (item: T, index: number) => void): void {
    this.items.forEach(callback);
  }

  public reduce<U>(
    callback: (accumulator: U, item: T, index: number) => U,
    initialValue: U,
  ): U {
    return this.items.reduce(callback, initialValue);
  }

  public [Symbol.iterator](): Iterator<T> {
    return this.items[Symbol.iterator]();
  }

  public toArray(): T[] {
    return Array.from(this.items);
  }
}
