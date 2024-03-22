import { calculateSpeed, getAverageTimeoutMs } from "./utils"

describe('utils', () => {
  describe('calculateSpeed', () => {
    it('returns 2 wpm for 1 minute and 2 words that have together 11 characters', () => {
      expect(calculateSpeed(1000 * 60, 11)).toEqual(2);
    });
    it('returns 200 wpm for 1 minute and 1100 characters(200 words)', () => {
      expect(calculateSpeed(1000 * 60, 1100)).toEqual(200);
    });
    it('returns 400 wpm for 2 minute and 4400 characters(800 words)', () => {
      expect(calculateSpeed(2000 * 60, 4400)).toEqual(400);
    });
  });

  describe('getAverageTimeoutMs', () => {
    it('should return 545 for 100 length, 10 phrases and 200 wpm', () => {
      expect(getAverageTimeoutMs(100, 10, 200)).toEqual(545);
    })
  });
})