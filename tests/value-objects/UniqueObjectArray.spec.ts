import { DayOfWeek, EDaysOfWeek } from '../../src/value-objects/time/DayOfWeek';
import { UniqueObjectArray } from '../../src/value-objects/UniqueObjectArray';

describe('UniqueObjectArray', () => {
  let uniqueDaysArray: UniqueObjectArray<DayOfWeek>;
  const monday = new DayOfWeek(EDaysOfWeek.MONDAY);
  const tuesday = new DayOfWeek(EDaysOfWeek.TUESDAY);
  const thursday = new DayOfWeek(EDaysOfWeek.THURSDAY);

  beforeEach(() => {
    uniqueDaysArray = new UniqueObjectArray<DayOfWeek>();
  });

  it('should add items to the array', () => {
    uniqueDaysArray.push(monday);
    uniqueDaysArray.push(tuesday);
    uniqueDaysArray.push(thursday);

    expect([...uniqueDaysArray]).toEqual([monday, tuesday, thursday]);
  });

  it('should not add duplicate items to the array', () => {
    uniqueDaysArray.push(monday);
    uniqueDaysArray.push(monday);

    expect([...uniqueDaysArray]).toEqual([new DayOfWeek(EDaysOfWeek.MONDAY)]);
  });

  it('should check if an element is in the array', () => {
    uniqueDaysArray.push(monday);

    expect(uniqueDaysArray.includes(monday)).toBeTruthy();
    expect(uniqueDaysArray.includes(thursday)).toBeFalsy();
  });

  it('should remove an item from the array', () => {
    uniqueDaysArray.push(monday);
    uniqueDaysArray.push(tuesday);
    uniqueDaysArray.push(thursday);

    uniqueDaysArray.remove(tuesday);

    expect([...uniqueDaysArray]).toEqual([monday, thursday]);
  });

  it('should not remove an item that is not in the array', () => {
    uniqueDaysArray.push(monday);
    uniqueDaysArray.remove(tuesday);

    expect([...uniqueDaysArray]).toEqual([monday]);
  });

  it('should create a unique object array from an existing array', () => {
    const daysArray = [monday, tuesday, thursday, monday, tuesday, thursday];

    const uniqueDaysArray = UniqueObjectArray.fromArray(daysArray);

    expect([...uniqueDaysArray]).toEqual([monday, tuesday, thursday]);
  });

  it('should return true when adding a new item', () => {
    expect(uniqueDaysArray.push(monday)).toBeTruthy();
  });

  it('should return false when adding existing item', () => {
    uniqueDaysArray.push(monday);
    expect(uniqueDaysArray.push(monday)).toBeFalsy();
  });

  it('should return true if removes existing item', () => {
    uniqueDaysArray.push(monday);
    expect(uniqueDaysArray.remove(monday)).toBeTruthy();
  });

  it('should return true if removes existing item with different instance', () => {
    uniqueDaysArray.push(monday);
    expect(
      uniqueDaysArray.remove(new DayOfWeek(EDaysOfWeek.MONDAY)),
    ).toBeTruthy();
  });

  it('should return false if removes non-existing item', () => {
    expect(uniqueDaysArray.remove(monday)).toBeFalsy();
  });

  it('should return the correct length of the array', () => {
    expect(uniqueDaysArray.length()).toBe(0);

    uniqueDaysArray.push(monday);
    expect(uniqueDaysArray.length()).toBe(1);

    uniqueDaysArray.push(tuesday);
    expect(uniqueDaysArray.length()).toBe(2);

    uniqueDaysArray.push(thursday);
    expect(uniqueDaysArray.length()).toBe(3);

    uniqueDaysArray.remove(tuesday);
    expect(uniqueDaysArray.length()).toBe(2);
  });

  it('should convert the unique object array to a regular array', () => {
    uniqueDaysArray.push(monday);
    uniqueDaysArray.push(tuesday);
    uniqueDaysArray.push(thursday);

    const array = uniqueDaysArray.toArray();

    expect(array).toEqual([monday, tuesday, thursday]);
  });

  it('should return an empty array if the unique object array is empty', () => {
    const array = uniqueDaysArray.toArray();

    expect(array).toEqual([]);
  });
});
