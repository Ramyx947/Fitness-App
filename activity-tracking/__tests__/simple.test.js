// __tests__/simple.test.js

describe('Simple Test Suite', () => {
    it('should have global.__MONGO_URI__ defined', () => {
      console.log('Simple Test: global.__MONGO_URI__:', global.__MONGO_URI__);
      expect(global.__MONGO_URI__).toBeDefined();
      expect(typeof global.__MONGO_URI__).toBe('string');
    });
  });
  