import days from '../../lib/model/days';

describe('Days', () => {
  it('should define sunday with value 0', () => {
    expect(days.sunday).toBe(0);
  });
  it('should define monday with value 1', () => {
    expect(days.monday).toBe(1);
  });
  it('should define tuesday with value 2', () => {
    expect(days.tuesday).toBe(2);
  });
  it('should define wednesday with value 3', () => {
    expect(days.wednesday).toBe(3);
  });
  it('should define thursday with value 4', () => {
    expect(days.thursday).toBe(4);
  });
  it('should define fridays with value 5', () => {
    expect(days.friday).toBe(5);
  });
  it('should define saturday with value 6', () => {
    expect(days.saturday).toBe(6);
  });

  it('should define everyday with all days', () => {
    expect(days.everyday).toEqual([
      days.sunday,
      days.monday,
      days.tuesday,
      days.wednesday,
      days.thursday,
      days.friday,
      days.saturday
    ]);
  });
  it('should define weekdays with monday, tuesday, wednesday, thursday and friday', () => {
    expect(days.weekdays).toEqual([days.monday, days.tuesday, days.wednesday, days.thursday, days.friday]);
  });
  it('should define weekend with saturday and sunday', () => {
    expect(days.weekend).toEqual([days.sunday, days.saturday]);
  });

  it('should alias weekend with weekends', () => {
    expect(days.weekends).toEqual(days.weekend);
  });
  it('should alias weekdays with weekday', () => {
    expect(days.weekday).toEqual(days.weekdays);
  });
});
