import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { trackExercise } from '../../src/api';

describe('API Tests', () => {
    let mock;

    beforeAll(() => {
        mock = new MockAdapter(axios);
    });

    afterEach(() => {
        mock.reset();
        jest.clearAllTimers();
        jest.restoreAllMocks();
    });

    afterAll(() => {
        mock.restore();
    });

    it('should return an error when the API call fails', async () => {
        jest.setTimeout(10000);
        const payload = { username: 'testUser', exerciseType: 'Swimming' };

        const baseURL = 'http://localhost:5300';
        mock.onPost(`${baseURL}/exercises/add`).networkError();

        await expect(trackExercise(payload)).rejects.toThrow();
    });
});
