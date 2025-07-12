import { Latitude, Longitude, Coordinates, PrimitiveOf } from '../../../src';

describe('Coordinates', () => {
  let latitude: Latitude;
  let longitude: Longitude;
  let coordinates: Coordinates;
  let stringCoordinates: string;

  beforeEach(() => {
    latitude = new Latitude(40.7128);
    longitude = new Longitude(-74.006);
    coordinates = new Coordinates(latitude, longitude);
    stringCoordinates = '40.7128,-74.006';
  });
  describe('fromPrimitives', () => {
    it('should create a Coordinates instance from primitives', () => {
      const coordinates = Coordinates.fromString(stringCoordinates);

      expect(coordinates).toMatchObject({
        latitude,
        longitude,
      });
    });
  });

  describe('constructor', () => {
    it('should create a Coordinates instance with number inputs', () => {
      const coordinates = new Coordinates(
        latitude.valueOf(),
        longitude.valueOf(),
      );

      expect(coordinates).toMatchObject({
        latitude,
        longitude,
      });
    });

    it('should create a Coordinates instance with Latitude and Longitude inputs', () => {
      const coordinates = new Coordinates(latitude, longitude);

      expect(coordinates).toMatchObject({
        latitude,
        longitude,
      });
    });
  });

  describe('isEquals', () => {
    it('should return true for equal Coordinates', () => {
      const coordinates2 = new Coordinates(latitude, longitude);

      expect(coordinates.isEqual(coordinates2)).toBe(true);
    });

    it('should return false for different Coordinates', () => {
      const latitude2 = new Latitude(34.0522);
      const longitude2 = new Longitude(-118.2437);
      const coordinates2 = new Coordinates(latitude2, longitude2);

      expect(coordinates.isEqual(coordinates2)).toBe(false);
    });
  });

  describe('valueOf', () => {
    it('should return valueOf Coordinates', () => {
      expect(coordinates.valueOf()).toEqual(stringCoordinates);
    });
  });
  describe('getLatitude', () => {
    it('should return the latitude instance', () => {
      expect(coordinates.getLatitude()).toEqual(latitude);
    });

    it('should return correct latitude when constructed with numbers', () => {
      const coords = new Coordinates(51.5074, -0.1278);
      expect(coords.getLatitude().valueOf()).toBe(51.5074);
    });
  });
  describe('getLongitude', () => {
    it('should return the longitude instance', () => {
      expect(coordinates.getLongitude()).toEqual(longitude);
    });

    it('should return correct longitude when constructed with numbers', () => {
      const coords = new Coordinates(51.5074, -0.1278);
      expect(coords.getLongitude().valueOf()).toBe(-0.1278);
    });
  });
});
