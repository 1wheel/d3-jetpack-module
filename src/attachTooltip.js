import {axisLeft} from 'd3-axis';
import {select} from 'd3-selection';
import {selectAll} from 'd3-selection';

export default function(sel, tooltipSel, fieldFns){
  if (!sel.size()) return

  tooltipSel = tooltipSel || select('.tooltip')

  sel 
      .on('mouseover.attachTooltip', ttDisplay)
      .on('mousemove.attachTooltip', ttMove)
      .on('mouseout.attachTooltip',  ttHide)
      .on('click.attachTooltip', function(d){ console.log(d) })

  var d = sel.datum()
  fieldFns = fieldFns || d3.keys(d)
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

    select(this).classed('tooltipped', true)
  }

  function ttMove(d){
    var tt = tooltipSel
    if (!tt.size()) return
    var e = d3.event,
        x = e.clientX,
        y = e.clientY,
        n = tt.node(),
        nBB = n.getBoundingClientRect(),
        doctop = (window.scrollY)? window.scrollY : (document.documentElement && document.documentElement.scrollTop)? document.documentElement.scrollTop : document.body.scrollTop;

    tt.style('top', (y+doctop-nBB.height-18)+'px');
    tt.style('left', Math.min(Math.max(20, (x-nBB.width/2)), window.innerWidth - nBB.width - 20)+'px');
  }

  function ttHide(d){
    tooltipSel.classed('tooltip-hidden', true);

    selectAll('.tooltipped').classed('tooltipped', false)
  }
}
