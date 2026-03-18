interface ComparableItem {
  isEqual(item: unknown): boolean;
}
export class UniqueObjectArray<T extends ComparableItem>
  implements Iterable<T>
{
  private items: T[] = [];

  public static fromArray<T extends ComparableItem>(
    array: T[],
  ): UniqueObjectArray<T> {
    const uniqueArray = new UniqueObjectArray<T>();
    for (const item of array) {
      uniqueArray.push(item);
    }

    return uniqueArray;
  }

  public includes(item: T): boolean {
    return this.items.some((one) => one.isEqual(item));
  }

  public push(item: T): boolean {
    if (!this.includes(item)) {
      this.items.push(item);

      return true;
    }

    return false;
  }

  public remove(item: T): boolean {
    const index = this.items.findIndex((one) => one.isEqual(item));

    if (index !== -1) {
      this.items.splice(index, 1);

      return true;
    }

    return false;
  }

  public [Symbol.iterator](): Iterator<T> {
    return this.items[Symbol.iterator]();
  }

  public length(): number {
    return this.items.length;
  }

  public toArray(): T[] {
    return Array.from(this.items);
  }
}
