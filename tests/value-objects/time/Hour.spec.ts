import { Hour, InvalidHourError, InvalidMinutesError } from '../../../src';

describe('Hour', () => {
  describe('constructor', () => {
    describe('when value is a string', () => {
      it('should return a Hour instance', () => {
        const hour = new Hour('23:59');
        expect(hour).toBeInstanceOf(Hour);
      });

      it('should throw error if hour is invalid', () => {
        expect(() => new Hour('24:00')).toThrow('Invalid hour');
        expect(() => new Hour('24:00')).toThrow(InvalidHourError);
      });

      it('should throw error if minutes is invalid', () => {
        expect(() => new Hour('23:60')).toThrow('Invalid minutes');
        expect(() => new Hour('23:60')).toThrow(InvalidMinutesError);
      });

      it('should work with 0 hour', () => {
        expect(new Hour('00:00').toString()).toEqual('00:00');
      });
    });

    describe('when receives 2 numbers', () => {
      it('should return a Hour instance', () => {
        const hour = new Hour(23, 59);
        expect(hour).toBeInstanceOf(Hour);
      });

      it('should throw error if hour is invalid', () => {
        expect(() => new Hour(24, 0)).toThrow('Invalid hour');
        expect(() => new Hour(24, 0)).toThrow(InvalidHourError);
      });

      it('should throw error if minutes is invalid', () => {
        expect(() => new Hour(23, 60)).toThrow('Invalid minutes');
        expect(() => new Hour(23, 60)).toThrow(InvalidMinutesError);
      });

      it('should work with 0 hour', () => {
        const hour = new Hour(0, 0).toString();
        expect(hour).toEqual('00:00');
      });
    });
  });

  describe('addMinutes', () => {
    it('should add minutes to hour', () => {
      expect(new Hour('23:59').addMinutes(1).toString()).toEqual('00:00');
    });
  });

  describe('toString', () => {
    it('should return string value', () => {
      expect(new Hour('23:59').toString()).toEqual('23:59');
    });
  });

  describe('isEqual', () => {
    it('should return true if value is equal', () => {
      expect(new Hour('23:59').isEqual(new Hour('23:59'))).toBeTrue();
    });

    it('should return false if value is not equal', () => {
      expect(new Hour('23:59').isEqual(new Hour('00:00'))).toBeFalse();
    });
  });

  describe('with some values', () => {
    it('should not throw error', () => {
      expect(() => new Hour('23:59')).not.toThrow();
    });

    it('should add trail zero to hours', () => {
      expect(new Hour('1:59').toString()).toEqual('01:59');
    });

    it('should add trail zero to minutes', () => {
      expect(new Hour('23:9').toString()).toEqual('23:09');
    });

    it('should add minutes to hours', () => {
      expect(new Hour('23:59').addMinutes(1).toString()).toEqual('00:00');
    });

    it('should add hours to hours', () => {
      expect(new Hour('23:59').addMinutes(60).toString()).toEqual('00:59');
    });

    it('should subtract hours to hours', () => {
      expect(new Hour('23:59').addMinutes(-60).toString()).toEqual('22:59');
    });

    it('should subtract minutes to hours', () => {
      expect(new Hour('00:00').addMinutes(-1).toString()).toEqual('23:59');
    });

    it('should add more than 2 hours', () => {
      expect(new Hour('23:59').addMinutes(120).toString()).toEqual('01:59');
    });
  });

  describe('diffInMinutes', () => {
    it('should return diff in minutes when jump the hour day', () => {
      expect(new Hour('23:59').diffInMinutes(new Hour('00:00'))).toEqual(1);
    });

    it('should return diff in minutes in total', () => {
      expect(new Hour('00:00').diffInMinutes(new Hour('23:59'))).toEqual(1439);
    });

    it('should return 60 minutes when diff is 1 hour', () => {
      expect(new Hour('00:00').diffInMinutes(new Hour('01:00'))).toEqual(60);
    });

    it('should return 1380 minutes when diff is 23 hours', () => {
      expect(new Hour('01:00').diffInMinutes(new Hour('00:00'))).toEqual(1380);
    });

    it('should return 1439 minutes when diff is -1 minute from start', () => {
      expect(new Hour('01:05').diffInMinutes(new Hour('01:04'))).toEqual(1439);
    });
  });

  describe('getMinutes', () => {
    it('should return minutes', () => {
      expect(new Hour('23:59').getMinutes()).toEqual(59);
    });
  });

  describe('getHours', () => {
    it('should return hours', () => {
      expect(new Hour('23:59').getHours()).toEqual(23);
    });
  });

  describe('isGreaterThan', () => {
    it('should return true if the hour is greater', () => {
      const hour1 = new Hour('12:30');
      const hour2 = new Hour('10:45');
      expect(hour1.isGreaterThan(hour2)).toBeTrue();
    });

    it('should return false if the hour is equal', () => {
      const hour1 = new Hour('12:30');
      const hour2 = new Hour('12:30');
      expect(hour1.isGreaterThan(hour2)).toBeFalse();
    });

    it('should return false if the hour is less', () => {
      const hour1 = new Hour('12:30');
      const hour2 = new Hour('14:45');
      expect(hour1.isGreaterThan(hour2)).toBeFalse();
    });

    it('should return true if the hour is greater with minutes', () => {
      const hour1 = new Hour('12:30');
      const hour2 = new Hour('12:15');
      expect(hour1.isGreaterThan(hour2)).toBeTrue();
    });

    it('should return false if the hour is less with minutes', () => {
      const hour1 = new Hour('12:30');
      const hour2 = new Hour('12:45');
      expect(hour1.isGreaterThan(hour2)).toBeFalse();
    });
  });
  describe('isLessThan', () => {
    it('should return true if the hour is less', () => {
      const hour1 = new Hour('10:45');
      const hour2 = new Hour('12:30');
      expect(hour1.isLessThan(hour2)).toBeTrue();
    });
    it('should return false if the hour is equal', () => {
      const hour1 = new Hour('12:30');
      const hour2 = new Hour('12:30');
      expect(hour1.isLessThan(hour2)).toBeFalse();
    });
    it('should return false if the hour is greater', () => {
      const hour1 = new Hour('14:45');
      const hour2 = new Hour('12:30');
      expect(hour1.isLessThan(hour2)).toBeFalse();
    });
    it('should return true if the hour is less with minutes', () => {
      const hour1 = new Hour('12:15');
      const hour2 = new Hour('12:30');
      expect(hour1.isLessThan(hour2)).toBeTrue();
    });
    it('should return false if the hour is greater with minutes', () => {
      const hour1 = new Hour('12:45');
      const hour2 = new Hour('12:30');
      expect(hour1.isLessThan(hour2)).toBeFalse();
    });
  });
});
