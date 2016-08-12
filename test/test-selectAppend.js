var tape = require('tape'),
    jetpack = require('../'),
    jsdom = require('jsdom'),
    d3 = require('d3-selection');


tape('selectAppend selects when element exists', function(test) {
  var document = jsdom.jsdom('<div><span></span></div>');

  var span = document.querySelector('span')

  var d3Span = d3.select(document.querySelector('div'))
    .selectAppend('span').node();

  test.equal(span, d3Span);
  test.end();
});

tape('selectAppend appends when element doesn\'t exist', function(test) {
  var document = jsdom.jsdom('<div></div>');

  var d3Span = d3.select(document.querySelector('div'))
    .selectAppend('span').node();

  var span = document.querySelector('span')

  test.equal(span, d3Span);
  test.end();
});
