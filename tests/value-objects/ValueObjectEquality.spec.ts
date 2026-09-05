import { ValueObject } from '../../src';

class UserId extends ValueObject<string> {}
class CommunityId extends ValueObject<string> {}

describe('ValueObject equality', () => {
  it('requires the same concrete type and value for isEqual', () => {
    const userId = new UserId('123');

    expect(userId.isEqual(new UserId('123'))).toBe(true);
    expect(userId.isEqual(new UserId('456'))).toBe(false);
    expect(userId.isEqual(new CommunityId('123'))).toBe(false);
    expect(userId.isEqual('123')).toBe(false);
  });

  it('exposes value-only comparison through hasValue', () => {
    const userId = new UserId('123');

    expect('hasValue' in userId).toBe(true);

    const hasValue = Reflect.get(userId, 'hasValue');
    expect(typeof hasValue).toBe('function');
    expect(hasValue.call(userId, new CommunityId('123'))).toBe(true);
    expect(hasValue.call(userId, '123')).toBe(true);
    expect(hasValue.call(userId, '456')).toBe(false);
  });
});
