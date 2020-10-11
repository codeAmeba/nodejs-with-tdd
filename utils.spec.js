const should = require('should');
const utils = require('./utils');

describe("utils.js module's capitalize() is...", () => {
  it('capitalize first letter of string', () => {
    const result = utils.capitalize('hello');
    // assert.strictEqual(result, 'Hello');
    result.should.be.equal('Hello');
  });
});
