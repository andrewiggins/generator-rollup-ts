'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-rollup-ts:app', () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({
        name: 'app',
        description: 'app description',
        authorName: 'author name',
        authorEmail: 'author@email',
        authorUrl: 'https://author.url',
        repository: 'https://repository.com',
        license: 'MIT',
        format: 'umd',
        bundleFile: 'dist/app.umd.js'
      });
  });

  it('creates files', () => {
    assert.file([
      'rollup.config.js',
      'tsconfig.json'
    ]);
  });
});
