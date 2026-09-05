import { Timestamp } from '../../../src';

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
});
