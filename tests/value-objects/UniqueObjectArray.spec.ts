import { DayOfWeek, EDaysOfWeek } from '../../src/value-objects/time/DayOfWeek';
import { UniqueObjectArray } from '../../src/value-objects/UniqueObjectArray';

describe('UniqueObjectArray', () => {
  const monday = new DayOfWeek(EDaysOfWeek.MONDAY);
  const tuesday = new DayOfWeek(EDaysOfWeek.TUESDAY);
  const thursday = new DayOfWeek(EDaysOfWeek.THURSDAY);

  class Tag {
    constructor(private readonly name: string) {}

    public isEqual(other: unknown): boolean {
      return other instanceof Tag && other.name === this.name;
    }
  }

  describe('push', () => {
    it('should return a new instance without mutating the original', () => {
      const empty = new UniqueObjectArray<DayOfWeek>();

      const result = empty.push(monday);

      expect(result).not.toBe(empty);
      expect(empty.length).toBe(0);
      expect([...result]).toEqual([monday]);
    });

    it('should accept several items keeping insertion order', () => {
      const result = new UniqueObjectArray<DayOfWeek>().push(
        monday,
        tuesday,
        thursday,
      );

      expect([...result]).toEqual([monday, tuesday, thursday]);
    });

    it('should ignore items equal to an existing one', () => {
      const result = UniqueObjectArray.fromArray([monday]).push(
        new DayOfWeek(EDaysOfWeek.MONDAY),
      );

      expect(result.length).toBe(1);
    });
  });

  describe('remove', () => {
    it('should return a new instance without the equal item', () => {
      const days = UniqueObjectArray.fromArray([monday, tuesday, thursday]);

      const result = days.remove(new DayOfWeek(EDaysOfWeek.TUESDAY));

      expect([...result]).toEqual([monday, thursday]);
      expect(days.length).toBe(3);
    });

    it('should keep the collection when the item is missing', () => {
      const days = UniqueObjectArray.fromArray([monday]);

      expect([...days.remove(tuesday)]).toEqual([monday]);
    });
  });

  describe('fromArray', () => {
    it('should remove duplicates keeping first occurrences', () => {
      const days = UniqueObjectArray.fromArray([
        monday,
        tuesday,
        thursday,
        monday,
        tuesday,
        thursday,
      ]);

      expect([...days]).toEqual([monday, tuesday, thursday]);
    });

    it('should honor isEqual for items sharing the same lookup key', () => {
      const tags = UniqueObjectArray.fromArray([
        new Tag('a'),
        new Tag('b'),
        new Tag('a'),
      ]);

      expect(tags.length).toBe(2);
      expect(tags.includes(new Tag('b'))).toBeTrue();
    });
  });

  describe('includes', () => {
    it('should find equal items by value and not by identity', () => {
      const days = UniqueObjectArray.fromArray([monday]);

      expect(days.includes(new DayOfWeek(EDaysOfWeek.MONDAY))).toBeTrue();
      expect(days.includes(thursday)).toBeFalse();
    });
  });

  describe('length', () => {
    it('should be a getter with the number of stored items', () => {
      expect(new UniqueObjectArray<DayOfWeek>().length).toBe(0);
      expect(UniqueObjectArray.fromArray([monday, tuesday]).length).toBe(2);
    });
  });

  describe('array methods', () => {
    const days = UniqueObjectArray.fromArray([monday, tuesday, thursday]);

    it('should map into a plain array', () => {
      expect(days.map((day) => day.toString())).toEqual([
        monday.toString(),
        tuesday.toString(),
        thursday.toString(),
      ]);
    });

    it('should filter into a new unique collection', () => {
      const result = days.filter((day) => day.isNotEqual(tuesday));

      expect(result).toBeInstanceOf(UniqueObjectArray);
      expect(result.toArray()).toEqual([monday, thursday]);
    });

    it('should find an item or return undefined', () => {
      expect(days.find((day) => day.isEqual(tuesday))).toBe(tuesday);
      expect(days.find(() => false)).toBeUndefined();
    });

    it('should evaluate some and every', () => {
      expect(days.some((day) => day.isEqual(monday))).toBeTrue();
      expect(days.some(() => false)).toBeFalse();
      expect(days.every((day) => day.isNotEqual(new Tag('x')))).toBeTrue();
      expect(days.every((day) => day.isEqual(monday))).toBeFalse();
    });

    it('should iterate with forEach in order with index', () => {
      const seen: [string, number][] = [];

      days.forEach((day, index) => seen.push([day.toString(), index]));

      expect(seen).toEqual([
        [monday.toString(), 0],
        [tuesday.toString(), 1],
        [thursday.toString(), 2],
      ]);
    });

    it('should reduce with an initial value', () => {
      expect(days.reduce((count) => count + 1, 0)).toBe(3);
    });

    it('should access items by position, including negative indexes', () => {
      expect(days.at(0)).toBe(monday);
      expect(days.at(-1)).toBe(thursday);
      expect(days.at(10)).toBeUndefined();
    });

    it('should report emptiness', () => {
      expect(days.isEmpty()).toBeFalse();
      expect(new UniqueObjectArray<DayOfWeek>().isEmpty()).toBeTrue();
    });

    it('should return a copy from toArray', () => {
      const copy = days.toArray();

      copy.pop();

      expect(days.length).toBe(3);
      expect(new UniqueObjectArray<DayOfWeek>().toArray()).toEqual([]);
    });
  });
});
