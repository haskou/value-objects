import { Latitude, InvalidLatitudeError } from '../../../src';

describe('Latitude', () => {
  describe('constructor', () => {
    it('should create a valid Latitude object', () => {
      expect(new Latitude(45)).toMatchObject({ value: 45 });
      expect(new Latitude(0)).toMatchObject({ value: 0 });
      expect(new Latitude(41.3983779)).toMatchObject({ value: 41.3983779 });
      expect(new Latitude(-41.3983779)).toMatchObject({ value: -41.3983779 });
    });

    it('should throw an InvalidLatitudeError for a value less than -90', () => {
      expect(() => new Latitude(-91)).toThrow(InvalidLatitudeError);
    });

    it('should throw an InvalidLatitudeError for a value greater than 90', () => {
      expect(() => new Latitude(91)).toThrow(InvalidLatitudeError);
    });

    it('should throw an InvalidLatitudeError if receives infinity', () => {
      expect(() => new Latitude(Infinity)).toThrow(InvalidLatitudeError);
    });
  });
});
