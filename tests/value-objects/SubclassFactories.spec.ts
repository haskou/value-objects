import { ShortId } from '../../src/value-objects/ids/ShortId';
import { UUID } from '../../src/value-objects/ids/UUID';
import { Duration } from '../../src/value-objects/time/Duration';
import { Timestamp } from '../../src/value-objects/time/Timestamp';

class MyUUID extends UUID {}
class MyShortId extends ShortId {}
class MyTimestamp extends Timestamp {}
class MyDuration extends Duration {}

describe('Static factories on subclasses', () => {
  it('should return the subclass from UUID.generate', () => {
    const id = MyUUID.generate();

    expect(id).toBeInstanceOf(MyUUID);
    expect(new MyUUID(id.valueOf()).isEqual(id)).toBe(true);
  });

  it('should return the subclass from ShortId.generate', () => {
    const id = MyShortId.generate();

    expect(id).toBeInstanceOf(MyShortId);
    expect(new MyShortId(id.valueOf()).isEqual(id)).toBe(true);
  });

  it('should return the subclass from Timestamp factories', () => {
    expect(MyTimestamp.now()).toBeInstanceOf(MyTimestamp);
    expect(MyTimestamp.new(0)).toBeInstanceOf(MyTimestamp);
    expect(MyTimestamp.fromSeconds(1)).toBeInstanceOf(MyTimestamp);
  });

  it('should return the subclass from Duration factories', () => {
    expect(MyDuration.fromDays(1)).toBeInstanceOf(MyDuration);
    expect(MyDuration.fromHours(1)).toBeInstanceOf(MyDuration);
    expect(MyDuration.fromMinutes(1)).toBeInstanceOf(MyDuration);
    expect(MyDuration.fromSeconds(1)).toBeInstanceOf(MyDuration);
    expect(MyDuration.fromMilliseconds(1)).toBeInstanceOf(MyDuration);
  });

  it('should keep returning the base class when called on it', () => {
    expect(UUID.generate().constructor).toBe(UUID);
    expect(Duration.fromDays(1).constructor).toBe(Duration);
  });
});
