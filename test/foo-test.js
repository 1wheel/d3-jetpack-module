var tape = require('tape'),
    jetpack = require('../');

tape('foo() returns 42', function(test) {
  test.equal(jetpack.foo(), 42);
  test.end();
});


tape('wordwrap', function(test) {
  test.equal(jetpack.wordwrap('two words', 4)[0], 'two');
  test.end();
});
