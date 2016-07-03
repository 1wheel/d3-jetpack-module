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

  function parseAttributes(name) {
    if (typeof name === "string") {
      var attr = {},
        parts = name.split(/([\.#])/g), p;
        name = parts.shift();
      while ((p = parts.shift())) {
        if (p == '.') attr['class'] = attr['class'] ? attr['class'] + ' ' + parts.shift() : parts.shift();
        else if (p == '#') attr.id = parts.shift();
      }
      return {tag: name, attr: attr};
    }
    return name;
  }

  function append(name) {
    var n = parseAttributes(name), s;
    name = d3Selection.creator(n.tag);
    s = this.select(function() {
      return this.appendChild(name.apply(this, arguments));
    });

    //attrs not provided by default in v4
    for (var key in n.attr) { s.attr(key, n.attr[key]) }
    return s;
  };

  function tspans(lines, lh) {
    return this.selectAll('tspan')
        .data(lines).enter()
      .append('tspan')
        .text(function(d) { return d; })
        .attr('x', 0)
        .attr('dy', function(d, i) { return i ? lh || 15 : 0; });
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
    return lines.filter(function(d){ return d != '' });
  };

  function f(){
    var functions = arguments;
    
    //convert all string arguments into field accessors
    var i = 0, l = functions.length;
    while (i < l) {
      if (typeof(functions[i]) === 'string' || typeof(functions[i]) === 'number'){
        functions[i] = (function(str){ return function(d){ return d[str] }; })(functions[i])
      }
      i++;
    }

     //return composition of functions
    return function(d) {
      var i=0, l = functions.length;
      while (i++ < l) d = functions[i-1].call(this, d);
      return d;
    };
  };

  function ascendingKey(key) {
    return typeof key == 'function' ? function (a, b) {
      return key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : key(a) >= key(b) ? 0 : NaN;
    } : function (a, b) {
      return a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : a[key] >= b[key] ? 0 : NaN;
    };
  };

  function descendingKey(key) {
    return typeof key == 'function' ? function (a, b) {
      return key(b) < key(a) ? -1 : key(b) > key(a) ? 1 : key(b) >= key(a) ? 0 : NaN;
    } : function (a, b) {
      return b[key] < a[key] ? -1 : b[key] > a[key] ? 1 : b[key] >= a[key] ? 0 : NaN;
    };
  };

  d3Selection.selection.prototype.translate = translateSelection
  d3Selection.selection.prototype.append = append
  d3Selection.selection.prototype.tspans = tspans

  exports.wordwrap = wordwrap;
  exports.parseAttributes = parseAttributes;
  exports.f = f;
  exports.ascendingKey = ascendingKey;
  exports.descendingKey = descendingKey;

  Object.defineProperty(exports, '__esModule', { value: true });

}));