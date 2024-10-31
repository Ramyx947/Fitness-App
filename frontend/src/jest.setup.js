// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { default as axios } from 'axios';

beforeEach(() => {
    jest.spyOn(axios, 'request').mockImplementation(() => {
        throw new Error('Network request attempted in a unit test');
    });
});
