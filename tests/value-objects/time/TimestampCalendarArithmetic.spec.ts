import { InvalidIntegerError, Timestamp } from '../../../src';

describe('Timestamp calendar arithmetic', () => {
  it('clamps addMonths to the last valid day of the target month', () => {
    const timestamp = Timestamp.new('2026-01-31T12:34:56.789Z');

    expect(timestamp.addMonths(1).toDate().toISOString()).toBe(
      '2026-02-28T12:34:56.789Z',
    );
  });

  it('clamps negative month arithmetic at the target month boundary', () => {
    const timestamp = Timestamp.new('2026-03-31T12:34:56.789Z');

    expect(timestamp.addMonths(-1).toDate().toISOString()).toBe(
      '2026-02-28T12:34:56.789Z',
    );
  });

  it('adds years as calendar years instead of fixed 365-day durations', () => {
    const timestamp = Timestamp.new('2023-03-01T12:34:56.789Z');

    expect(timestamp.addYears(1).toDate().toISOString()).toBe(
      '2024-03-01T12:34:56.789Z',
    );
  });

  it('clamps leap day when the target year is not a leap year', () => {
    const timestamp = Timestamp.new('2024-02-29T12:34:56.789Z');

    expect(timestamp.addYears(1).toDate().toISOString()).toBe(
      '2025-02-28T12:34:56.789Z',
    );
  });

  it('moves inward from the minimum ECMAScript timestamp without invalid intermediates', () => {
    const timestamp = new Timestamp(-8640000000000000);
    const result = timestamp.addMonths(1).toDate();

    expect(result.getUTCFullYear()).toBe(-271821);
    expect(result.getUTCMonth()).toBe(4);
    expect(result.getUTCDate()).toBe(20);
  });

  it('can target the maximum ECMAScript timestamp month', () => {
    const source = new Date(0);
    source.setUTCFullYear(275760, 7, 13);
    source.setUTCHours(0, 0, 0, 0);

    expect(new Timestamp(source).addMonths(1).valueOf()).toBe(
      8640000000000000,
    );
  });

  it.each([
    ['months', 0.1, (timestamp: Timestamp) => timestamp.addMonths(0.1)],
    ['months', -0.1, (timestamp: Timestamp) => timestamp.addMonths(-0.1)],
    ['years', 0.1, (timestamp: Timestamp) => timestamp.addYears(0.1)],
    ['years', -0.1, (timestamp: Timestamp) => timestamp.addYears(-0.1)],
  ])('rejects fractional %s delta %s', (_unit, _delta, operation) => {
    expect(() => operation(Timestamp.new('2026-05-15T00:00:00.000Z'))).toThrow(
      InvalidIntegerError,
    );
  });

  it('preserves sub-millisecond precision across calendar arithmetic', () => {
    const timestamp = Timestamp.fromSeconds(0.0015);

    expect(timestamp.addMonths(1).toMilliseconds()).toBe(2678400001.5);
    expect(timestamp.addYears(1).toMilliseconds()).toBe(31536000001.5);
  });

  it('keeps negative fractional milliseconds on the correct calendar day', () => {
    const timestamp = new Timestamp(-86400000.5);

    expect(timestamp.addMonths(2).toMilliseconds()).toBe(5097599999.5);
  });
});
