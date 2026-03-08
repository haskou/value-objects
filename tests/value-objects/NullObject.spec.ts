import { NullObject, NullObjectError } from '../../src';

/* eslint-disable no-unused-expressions */
describe('NullObject', () => {
  class TestNullObject {
    constructor(private readonly uid: string) {}

    public getUid(): string {
      return 'uid';
    }

    public getName(): string {
      return 'name';
    }

    public valueOf(): string {
      return this.getUid();
    }
  }

  let test: TestNullObject;

  beforeEach(() => {
    test = NullObject.new(TestNullObject);
  });

  it('should replace all methods with fake methods throwing NullObjectError', () => {
    expect(() => test.getUid()).toThrow(NullObjectError);
    expect(() => test.getName()).toThrow(NullObjectError);
  });

  it('should replace valueOf with undefined ', () => {
    expect(test.valueOf()).toBeUndefined();
  });

  it('should return true when checking if it is a null object', () => {
    expect(NullObject.isNullObject(test)).toBeTrue();
  });

  it('should return false when checking if empty object it is a null object', () => {
    expect(NullObject.isNullObject({})).toBeFalse();
  });

  it('should return false when checking if null it is a null object', () => {
    expect(NullObject.isNullObject(null)).toBeFalse();
  });

  it('should return false when checking if undefined it is a null object', () => {
    expect(NullObject.isNullObject(undefined)).toBeFalse();
  });

  it('should return false when checking if NaN it is a null object', () => {
    expect(NullObject.isNullObject(NaN)).toBeFalse();
  });
});
