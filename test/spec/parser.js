import parser from '../../lib/parser';

describe('Parser', () => {
  describe('parseTime', () => {
    it('should return an instance of timejs', () => {
      const time = parser.parseTime('12:00');

      expect(time.hours).toBe(Function);
      expect(time.minutes).toBe(Function);
      expect(time.period).toBe(Function);
    });
  });

  describe('parseDay', () => {
    it('should be a function', () => {
      expect(parser.parseDay).toBeInstanceOf('function');
    });

    it('should parse "sunday" as [0]', () => {
      expect(parser.parseDay('sunday')).toEqual([0]);
    });
    it('should parse "monday" as [1]', () => {
      expect(parser.parseDay('monday')).toEqual([1]);
    });
    it('should parse "tuesday" as [2]', () => {
      expect(parser.parseDay('tuesday')).toEqual([2]);
    });
    it('should parse "wednesday" as [3]', () => {
      expect(parser.parseDay('wednesday')).toEqual([3]);
    });
    it('should parse "thursday" as [4]', () => {
      expect(parser.parseDay('thursday')).toEqual([4]);
    });
    it('should parse "friday" as [5]', () => {
      expect(parser.parseDay('friday')).toEqual([5]);
    });
    it('should parse "saturday" as [6]', () => {
      expect(parser.parseDay('saturday')).toEqual([6]);
    });

    it('should parse "weekend" as [0,6]', () => {
      expect(parser.parseDay('weekend')).toEqual([0, 6]);
    });
    it('should parse "weekdays" as [1,2,3,4,5]', () => {
      expect(parser.parseDay('weekdays')).toEqual([1, 2, 3, 4, 5]);
    });
    it('should parse "weekends" as [0,6]', () => {
      expect(parser.parseDay('weekends')).toEqual([0, 6]);
    });
    it('should parse "weekday" as [1,2,3,4,5]', () => {
      expect(parser.parseDay('weekday')).toEqual([1, 2, 3, 4, 5]);
    });
    it('should parse "everday" as [0,1,2,3,4,5,6]', () => {
      expect(parser.parseDay('everyday')).toEqual([0, 1, 2, 3, 4, 5, 6]);
    });

    it('should recognize mixed case strings as their lowercase equivalent', () => {
      expect(parser.parseDay('mOnDAy')).toEqual([1]);
    });

    it('should parse comma separated "monday,weekend" as [0,1,6]', () => {
      expect(parser.parseDay('monday,weekend')).toEqual([0, 1, 6]);
    });
  });
});
