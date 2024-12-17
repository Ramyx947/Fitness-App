const { TextEncoder, TextDecoder } = require('util');

jest.setTimeout(30000);

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Set timezone to UTC for consistent date handling in all tests
process.env.TZ = 'UTC';