// https://github.com/1wheel/d3-jetpack-module Version 0.0.17. Copyright 2017 Adam Pearce.
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-selection'), require('d3-transition'), require('d3-axis'), require('d3-scale'), require('d3-collection'), require('d3-queue'), require('d3-request')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3-selection', 'd3-transition', 'd3-axis', 'd3-scale', 'd3-collection', 'd3-queue', 'd3-request'], factory) :
  (factory((global.d3 = global.d3 || {}),global.d3,global.d3,global.d3,global.d3,global.d3,global.d3,global.d3));
}(this, function (exports,d3Selection,d3Transition,d3Axis,d3Scale,d3Collection,d3Queue,d3Request) { 'use strict';

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

  function parent() {
    var parents = [];
    return this.filter(function() {
      if (parents.indexOf(this.parentNode) > -1) return false;
      parents.push(this.parentNode);
      return true;
    }).select(function() {
      return this.parentNode;
    });
  }

  function selectAppend(name) {
    var select = d3Selection.selector(name),
       n = parseAttributes(name), s;

    name = d3Selection.creator(n.tag);

    s = this.select(function() {
      return select.apply(this, arguments)
          || this.appendChild(name.apply(this, arguments));
    });

    //attrs not provided by default in v4
    for (var key in n.attr) { s.attr(key, n.attr[key]) }
    return s;
  };

  function tspans(lines, lh) {
    return this.selectAll('tspan')
        .data(function(d) {
          return (typeof(lines) == 'function' ? lines(d) : lines)
            .map(function(l) {
              return { line: l, parent: d }
            });
        })
        .enter()
      .append('tspan')
        .text(function(d) { return d.line; })
        .attr('x', 0)
        .attr('dy', function(d, i) { return i ? (typeof(lh) == 'function' ? lh(d.parent, d.line, i) : lh) || 15 : 0; });
  };

  function appendMany(data, name){
    return this.selectAll(null).data(data).enter().append(name);
  };

  function at(name, value) {
    if (typeof(name) == 'object'){
      for (var key in name){
        this.attr(key.replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase(), name[key]) 
      }
      return this
    } else{
      return arguments.length == 1 ? this.attr(name) : this.attr(name, value)
    }
  };

  function f(){
    var functions = arguments
    
    //convert all string arguments into field accessors
    var i = 0, l = functions.length
    while (i < l) {
      if (typeof(functions[i]) === 'string' || typeof(functions[i]) === 'number'){
        functions[i] = (function(str){ return function(d){ return d[str] } })(functions[i])
      }
      i++
    }

     //return composition of functions
    return function(d) {
      var i=0, l = functions.length
      while (i++ < l) d = functions[i-1].call(this, d)
      return d
    }
  }

  f.not = function(d){ return !d }
  f.run = function(d){ return d() }
  f.objToFn = function(obj, defaultVal){
    if (arguments.length == 1) defaultVal = undefined

    return function(str){
      return typeof(obj[str]) !== undefined ? obj[str] : defaultVal }
  }

  function st(name, value) {
    if (typeof(name) == 'object'){
      for (var key in name){
        addStyle(this, key, name[key])
      }
      return this
    } else{
      return arguments.length == 1 ? this.style(name) : addStyle(this, name, value)
    }


    function addStyle(sel, style, value){
      var style = style.replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase()

      var pxStyles = 'top left bottom right padding-top padding-left padding-bottom padding-right border-top b-width border-left-width border-botto-width m border-right-width  margin-top margin-left margin-bottom margin-right font-size width height stroke-width line-height margin padding border max-width min-width'

      if (~pxStyles.indexOf(style) ){
        sel.style(style, typeof value == 'function' ? f(value, addPx) : addPx(value))
      } else{
        sel.style(style, value)
      }

      return sel
    } 

    function addPx(d){ return d.match ? d : d + 'px' }
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

  function conventions(c){
    c = c || {}

    c.margin = c.margin || {top: 20, right: 20, bottom: 20, left: 20}
    ;['top', 'right', 'bottom', 'left'].forEach(function(d){
      if (!c.margin[d] && c.margin[d] != 0) c.margin[d] = 20 
    })

    c.width  = c.width  || c.totalWidth  - c.margin.left - c.margin.right || 900
    c.height = c.height || c.totalHeight - c.margin.top - c.margin.bottom || 460

    c.totalWidth = c.width + c.margin.left + c.margin.right
    c.totalHeight = c.height + c.margin.top + c.margin.bottom

    c.parentSel = c.parentSel || d3Selection.select('body')

    c.rootsvg = c.parentSel.append('svg')

    c.svg = c.rootsvg
        .attr('width', c.totalWidth)
        .attr('height', c.totalHeight)
      .append('g')
        .attr('transform', 'translate(' + c.margin.left + ',' + c.margin.top + ')')

    c.x = c.x || d3Scale.scaleLinear().range([0, c.width])
    c.y = c.y || d3Scale.scaleLinear().range([c.height, 0])

    c.xAxis = c.xAxis || d3Axis.axisBottom().scale(c.x)
    c.yAxis = c.yAxis || d3Axis.axisLeft().scale(c.y)

    c.drawAxis = function(){
      c.svg.append('g')
          .attr('class', 'x axis')
          .attr('transform', 'translate(0,' + c.height + ')')
          .call(c.xAxis);

      c.svg.append('g')
          .attr('class', 'y axis')
          .call(c.yAxis);
    }
    
    return c
  }

  function attachTooltip(sel, tooltipSel, fieldFns){
    if (!sel.size()) return

    tooltipSel = tooltipSel || d3Selection.select('.tooltip')

    sel 
        .on('mouseover.attachTooltip', ttDisplay)
        .on('mousemove.attachTooltip', ttMove)
        .on('mouseout.attachTooltip',  ttHide)
        .on('click.attachTooltip', function(d){ console.log(d) })

    var d = sel.datum()
    fieldFns = fieldFns || d3Collection.keys(d)
        .filter(function(str){
          return (typeof d[str] != 'object') && (d[str] != 'array')
        })
        .map(function(str){
          return function(d){ return str + ': <b>' + d[str] + '</b>'} })

    function ttDisplay(d){
      tooltipSel
          .classed('tooltip-hidden', false)
          .html('')
        .appendMany(fieldFns, 'div')
          .html(function(fn){ return fn(d) })

      d3Selection.select(this).classed('tooltipped', true)
    }

    function ttMove(d){
      var tt = tooltipSel
      if (!tt.size()) return
      var e = d3Selection.event,
          x = e.clientX,
          y = e.clientY,
          n = tt.node(),
          nBB = n.getBoundingClientRect(),
          doctop = (window.scrollY)? window.scrollY : (document.documentElement && document.documentElement.scrollTop)? document.documentElement.scrollTop : document.body.scrollTop,
          topPos = y+doctop-nBB.height-18;

      tt.style('top', (topPos < 0 ? 18 + y : topPos)+'px');
      tt.style('left', Math.min(Math.max(20, (x-nBB.width/2)), window.innerWidth - nBB.width - 20)+'px');
    }

    function ttHide(d){
      tooltipSel.classed('tooltip-hidden', true);

      d3Selection.selectAll('.tooltipped').classed('tooltipped', false)
    }
  }

  function loadData(files, cb){
    var q = d3Queue.queue()
    files.forEach(function(d){
      var type = d.split('.').reverse()[0]

      var loadFn = {csv: d3Request.csv, tsv: d3Request.tsv, json: d3Request.json}[type]
      if (!loadFn) return cb(new Error('Invalid type', d))
      q.defer(loadFn, d) 
    })
    q.awaitAll(cb)
  }

  function nestBy(array, key){
    return d3Collection.nest().key(key).entries(array).map(function(d){
      d.values.key = d.key
      return d.values
    })
  }

  function round(n, p) {
    return p ? Math.round(n * (p = Math.pow(10, p))) / p : Math.round(n);
  };

  // Clips the specified subject polygon to the specified clip polygon;
  // requires the clip polygon to be counterclockwise and convex.
  // https://en.wikipedia.org/wiki/Sutherland–Hodgman_algorithm
  function polygonClip(clip, subject) {
    var input,
        closed = polygonClosed(subject),
        i = -1,
        n = clip.length - polygonClosed(clip),
        j,
        m,
        a = clip[n - 1],
      b,
      c,
      d;

    while (++i < n) {
      input = subject.slice();
      subject.length = 0;
      b = clip[i];
      c = input[(m = input.length - closed) - 1];
      j = -1;
      while (++j < m) {
        d = input[j];
        if (polygonInside(d, a, b)) {
          if (!polygonInside(c, a, b)) {
            subject.push(polygonIntersect(c, d, a, b));
          }
          subject.push(d);
        } else if (polygonInside(c, a, b)) {
          subject.push(polygonIntersect(c, d, a, b));
        }
        c = d;
      }
      if (closed) subject.push(subject[0]);
      a = b;
    }

    return subject;
  };

  function polygonInside(p, a, b) {
    return (b[0] - a[0]) * (p[1] - a[1]) < (b[1] - a[1]) * (p[0] - a[0]);
  }

  // Intersect two infinite lines cd and ab.
  function polygonIntersect(c, d, a, b) {
    var x1 = c[0], x3 = a[0], x21 = d[0] - x1, x43 = b[0] - x3,
        y1 = c[1], y3 = a[1], y21 = d[1] - y1, y43 = b[1] - y3,
        ua = (x43 * (y1 - y3) - y43 * (x1 - x3)) / (y43 * x21 - x43 * y21);
    return [x1 + ua * x21, y1 + ua * y21];
  }

  // Returns true if the polygon is closed.
  function polygonClosed(coordinates) {
    var a = coordinates[0],
        b = coordinates[coordinates.length - 1];
    return !(a[0] - b[0] || a[1] - b[1]);
  }

  d3Selection.selection.prototype.translate = translateSelection;
  d3Transition.transition.prototype.translate = translateSelection;
  d3Selection.selection.prototype.append = append;
  d3Selection.selection.prototype.parent = parent;
  d3Selection.selection.prototype.selectAppend = selectAppend;
  d3Selection.selection.prototype.tspans = tspans;
  d3Selection.selection.prototype.appendMany = appendMany;
  d3Selection.selection.prototype.at = at;
  d3Selection.selection.prototype.st = st;
  d3Transition.transition.prototype.at = at;
  d3Transition.transition.prototype.st = st;
  d3Selection.selection.prototype.prop = d3Selection.selection.prototype.property;

  exports.wordwrap = wordwrap;
  exports.parseAttributes = parseAttributes;
  exports.f = f;
  exports.ascendingKey = ascendingKey;
  exports.descendingKey = descendingKey;
  exports.conventions = conventions;
  exports.attachTooltip = attachTooltip;
  exports.loadData = loadData;
  exports.nestBy = nestBy;
  exports.round = round;
  exports.polygonClip = polygonClip;

  Object.defineProperty(exports, '__esModule', { value: true });

}));