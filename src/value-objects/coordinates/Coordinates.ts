import { StringValueObject } from '../StringValueObject';
import { Latitude } from './Latitude';
import { Longitude } from './Longitude';

export class Coordinates extends StringValueObject {
  private latitude: Latitude;
  private longitude: Longitude;

  public static fromString(value: string): Coordinates {
    const latitude = parseFloat(value.split(',')[0]);
    const longitude = parseFloat(value.split(',')[1]);

    return new Coordinates(latitude, longitude);
  }

  constructor(latitude: number | Latitude, longitude: number | Longitude) {
    super(latitude?.valueOf() + ',' + longitude?.valueOf());

    this.latitude = new Latitude(latitude.valueOf());
    this.longitude = new Longitude(longitude.valueOf());
  }

  public getLatitude(): Latitude {
    return this.latitude;
  }

  public getLongitude(): Longitude {
    return this.longitude;
  }
}
