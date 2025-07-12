import { Duration } from '../../../src';

describe('Duration', () => {
  describe('fromDays', () => {
    it('should create a Time instance from days', () => {
      const days = 2;
      const expectedMilliseconds = 2 * 24 * 60 * 60 * 1000;
      const time = Duration.fromDays(days);
      expect(time.valueOf()).toBe(expectedMilliseconds);
    });
  });

  describe('fromHours', () => {
    it('should create a Time instance from hours', () => {
      const hours = 2;
      const expectedMilliseconds = 2 * 60 * 60 * 1000;
      const time = Duration.fromHours(hours);
      expect(time.valueOf()).toBe(expectedMilliseconds);
    });
  });

  describe('fromMinutes', () => {
    it('should create a Time instance from minutes', () => {
      const minutes = 30;
      const expectedMilliseconds = 30 * 60 * 1000;
      const time = Duration.fromMinutes(minutes);
      expect(time.valueOf()).toBe(expectedMilliseconds);
    });
  });

  describe('fromSeconds', () => {
    it('should create a Time instance from seconds', () => {
      const seconds = 45;
      const expectedMilliseconds = 45 * 1000;
      const time = Duration.fromSeconds(seconds);
      expect(time.valueOf()).toBe(expectedMilliseconds);
    });
  });

  describe('fromMilliseconds', () => {
    it('should create a Time instance from milliseconds', () => {
      const milliseconds = 500;
      const time = Duration.fromMilliseconds(milliseconds);
      expect(time.valueOf()).toBe(milliseconds);
    });
  });

  describe('getTotalDays', () => {
    it('should return the total days', () => {
      const milliseconds = 2 * 24 * 60 * 60 * 1000;
      const time = Duration.fromMilliseconds(milliseconds);
      const totalDays = time.getTotalDays();
      expect(totalDays.valueOf()).toBe(2);
    });
    it('should keep the value after getting it', () => {
      const milliseconds = 2 * 24 * 60 * 60 * 1000;
      const time = Duration.fromMilliseconds(milliseconds);
      const firstTime = time.getTotalDays();
      const secondTime = time.getTotalDays();

      expect(firstTime.valueOf()).toBe(2);
      expect(secondTime.valueOf()).toBe(2);
    });
  });

  describe('getTotalHours', () => {
    it('should return the total hours', () => {
      const milliseconds = 2 * 60 * 60 * 1000;
      const time = Duration.fromMilliseconds(milliseconds);
      const totalHours = time.getTotalHours();
      expect(totalHours.valueOf()).toBe(2);
    });
    it('should keep the value after getting it', () => {
      const milliseconds = 2 * 60 * 60 * 1000;
      const time = Duration.fromMilliseconds(milliseconds);
      const firstTime = time.getTotalHours();
      const secondTime = time.getTotalHours();

      expect(firstTime.valueOf()).toBe(2);
      expect(secondTime.valueOf()).toBe(2);
    });
  });

  describe('getTotalMinutes', () => {
    it('should return the total minutes', () => {
      const milliseconds = 3000 * 60 * 1000;
      const time = Duration.fromMilliseconds(milliseconds);
      const totalMinutes = time.getTotalMinutes();
      expect(totalMinutes.valueOf()).toBe(3000);
    });
    it('should keep the value after getting it', () => {
      const milliseconds = 3000 * 60 * 1000;
      const time = Duration.fromMilliseconds(milliseconds);
      const firstTime = time.getTotalMinutes();
      const secondTime = time.getTotalMinutes();

      expect(firstTime.valueOf()).toBe(3000);
      expect(secondTime.valueOf()).toBe(3000);
    });
  });

  describe('getTotalSeconds', () => {
    it('should return the total seconds', () => {
      const milliseconds = 450 * 1000;
      const time = Duration.fromMilliseconds(milliseconds);
      const totalSeconds = time.getTotalSeconds();
      expect(totalSeconds.valueOf()).toBe(450);
    });
    it('should keep the value after getting it', () => {
      const milliseconds = 450 * 1000;
      const time = Duration.fromMilliseconds(milliseconds);
      const firstTime = time.getTotalSeconds();
      const secondTime = time.getTotalSeconds();

      expect(firstTime.valueOf()).toBe(450);
      expect(secondTime.valueOf()).toBe(450);
    });
  });

  describe('getTotalMilliseconds', () => {
    it('should return the total milliseconds', () => {
      const milliseconds = 5000000;
      const time = Duration.fromMilliseconds(milliseconds);
      const totalMilliseconds = time.getTotalMilliseconds();
      expect(totalMilliseconds.valueOf()).toBe(milliseconds);
    });
    it('should return the total milliseconds', () => {
      const milliseconds = 500;
      const time = Duration.fromMilliseconds(milliseconds);
      const totalMilliseconds = time.getTotalMilliseconds();
      expect(totalMilliseconds.valueOf()).toBe(milliseconds);
    });
    it('should keep the value after getting it', () => {
      const milliseconds = 3000 * 60 * 1000;
      const time = Duration.fromMilliseconds(milliseconds);
      const firstTime = time.getTotalMilliseconds();
      const secondTime = time.getTotalMilliseconds();

      expect(firstTime.valueOf()).toBe(milliseconds);
      expect(secondTime.valueOf()).toBe(milliseconds);
    });
  });

  describe('getDays', () => {
    it('should return the days', () => {
      const milliseconds = 2 * 24 * 60 * 60 * 1000;
      const time = Duration.fromMilliseconds(milliseconds);
      const days = time.getDays();
      expect(days.valueOf()).toBe(2);
    });
    it('should return the days when there are hours and milliseconds', () => {
      let milliseconds = 2 * 24 * 60 * 60 * 1000;
      milliseconds += 2 * 60 * 60 * 1000;
      const time = Duration.fromMilliseconds(milliseconds);
      const days = time.getDays();
      expect(days.valueOf()).toBe(2);
    });
    it('should return the days', () => {
      const milliseconds = 976940000;
      const time = Duration.fromMilliseconds(milliseconds);
      const days = time.getDays();
      expect(days.valueOf()).toBe(11);
    });
    it('should keep the value after getting it', () => {
      const milliseconds = 976940000;
      const time = Duration.fromMilliseconds(milliseconds);
      const firstTime = time.getDays();
      const secondTime = time.getDays();

      expect(firstTime.valueOf()).toBe(11);
      expect(secondTime.valueOf()).toBe(11);
    });
  });

  describe('getHours', () => {
    it('should return the hours', () => {
      const milliseconds = 2 * 60 * 60 * 1000;
      const time = Duration.fromMilliseconds(milliseconds);
      const hours = time.getHours();
      expect(hours.valueOf()).toBe(2);
    });
    it('should return the hours when there are minutes and milliseconds', () => {
      let milliseconds = 2 * 60 * 60 * 1000;
      milliseconds += 30 * 60 * 1000;
      const time = Duration.fromMilliseconds(milliseconds);
      const hours = time.getHours();
      expect(hours.valueOf()).toBe(2);
    });
    it('should return the hours', () => {
      const milliseconds = 35940000;
      const time = Duration.fromMilliseconds(milliseconds);
      const minutes = time.getHours();
      expect(minutes.valueOf()).toBe(9);
    });
    it('should keep the value after getting it', () => {
      const milliseconds = 35940000;
      const time = Duration.fromMilliseconds(milliseconds);
      const firstTime = time.getHours();
      const secondTime = time.getHours();

      expect(firstTime.valueOf()).toBe(9);
      expect(secondTime.valueOf()).toBe(9);
    });
  });

  describe('getMinutes', () => {
    it('should return the minutes', () => {
      const milliseconds = 30 * 60 * 1000;
      const time = Duration.fromMilliseconds(milliseconds);
      const minutes = time.getMinutes();
      expect(minutes.valueOf()).toBe(30);
    });
    it('should return the minutes', () => {
      const milliseconds = 35940000;
      const time = Duration.fromMilliseconds(milliseconds);
      const minutes = time.getMinutes();
      expect(minutes.valueOf()).toBe(59);
    });
    it('should keep the value after getting it', () => {
      const milliseconds = 35940000;
      const time = Duration.fromMilliseconds(milliseconds);
      const firstTime = time.getMinutes();
      const secondTime = time.getMinutes();

      expect(firstTime.valueOf()).toBe(59);
      expect(secondTime.valueOf()).toBe(59);
    });
  });

  describe('getSeconds', () => {
    it('should return the seconds', () => {
      const milliseconds = 45 * 1000;
      const time = Duration.fromMilliseconds(milliseconds);
      const seconds = time.getSeconds();
      expect(seconds.valueOf()).toBe(45);
    });
    it('should return the seconds', () => {
      const milliseconds = 70 * 1000;
      const time = Duration.fromMilliseconds(milliseconds);
      const minutes = time.getSeconds();
      expect(minutes.valueOf()).toBe(10);
    });
    it('should keep the value after getting it', () => {
      const milliseconds = 45 * 1000;
      const time = Duration.fromMilliseconds(milliseconds);
      const firstTime = time.getSeconds();
      const secondTime = time.getSeconds();

      expect(firstTime.valueOf()).toBe(45);
      expect(secondTime.valueOf()).toBe(45);
    });
  });

  describe('getMilliseconds', () => {
    it('should return the milliseconds', () => {
      const milliseconds = 1500;
      const time = Duration.fromMilliseconds(milliseconds);
      expect(time.getMilliseconds().valueOf()).toBe(500);
    });
    it('should keep the value after getting it', () => {
      const milliseconds = 1500;
      const time = Duration.fromMilliseconds(milliseconds);
      const firstTime = time.getMilliseconds();
      const secondTime = time.getMilliseconds();

      expect(firstTime.valueOf()).toBe(500);
      expect(secondTime.valueOf()).toBe(500);
    });
  });

  describe('valueOf', () => {
    it('should return the value in milliseconds', () => {
      const milliseconds = 500;
      const time = Duration.fromMilliseconds(milliseconds);
      expect(time.valueOf()).toBe(milliseconds);
    });
  });
});
