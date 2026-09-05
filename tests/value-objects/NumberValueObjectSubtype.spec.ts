import { NumberValueObject } from '../../src';

class Percentage extends NumberValueObject {
  public asPercentage(): string {
    return `${this.valueOf()}%`;
  }
}

describe('NumberValueObject arithmetic subtype', () => {
  it('preserves the concrete subtype in arithmetic return types', () => {
    const value = new Percentage(20);

    const added: Percentage = value.add(5);
    const subtracted: Percentage = value.subtract(5);
    const multiplied: Percentage = value.multiply(2);
    const divided: Percentage = value.divide(2);

    expect(added).toBeInstanceOf(Percentage);
    expect(subtracted).toBeInstanceOf(Percentage);
    expect(multiplied).toBeInstanceOf(Percentage);
    expect(divided).toBeInstanceOf(Percentage);
    expect(added.asPercentage()).toBe('25%');
  });
});
