// https://github.com/1wheel/d3-jetpack-module Version 0.0.1. Copyright 2016 Adam Pearce.
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-selection'), require('d3-transition')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3-selection', 'd3-transition'], factory) :
  (factory((global.d3 = global.d3 || {}),global.d3,global.d3));
}(this, function (exports,d3Selection,d3Transition) { 'use strict';

  function translateSelection(xy) {
    return this.attr('transform', function(d,i) {
      return 'translate('+[typeof xy == 'function' ? xy.call(this, d,i) : xy]+')';
    });
  };

  function foo() {
    return 42;
  };

  function wordwrap(line, maxCharactersPerLine) {
    var w = line.split(' '),
      lines = [],
      words = [],
      maxChars = maxCharactersPerLine || 40,
      l = 0;

    w.forEach(function(d) {
      if (l+d.length > maxChars) {
        lines.push(words.join(' '));
        words.length = 0;
        l = 0;
      }
      l += d.length;
      words.push(d);
    });
    if (words.length) {
      lines.push(words.join(' '));
    }
    return lines;
  };

  d3Selection.selection.prototype.translate = translateSelection

  exports.foo = foo;
  exports.wordwrap = wordwrap;

  Object.defineProperty(exports, '__esModule', { value: true });

}));