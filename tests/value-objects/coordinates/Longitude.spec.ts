import { Longitude, InvalidLongitudeError } from '../../../src';

describe('Longitude', () => {
  describe('constructor', () => {
    it('should create a valid Longitude object', () => {
      expect(new Longitude(45)).toMatchObject({ value: 45 });
      expect(new Longitude(0)).toMatchObject({ value: 0 });
      expect(new Longitude(41.3983779)).toMatchObject({ value: 41.3983779 });
      expect(new Longitude(-41.3983779)).toMatchObject({ value: -41.3983779 });
    });

    it('should throw an InvalidLongitudeError for a value less than -180', () => {
      expect(() => new Longitude(-181)).toThrow(InvalidLongitudeError);
    });

    it('should throw an InvalidLongitudeError for a value greater than 180', () => {
      expect(() => new Longitude(181)).toThrow(InvalidLongitudeError);
    });

    it('should throw an InvalidLongitudeError if receives infinity', () => {
      expect(() => new Longitude(Infinity)).toThrow(InvalidLongitudeError);
    });
  });
});
