export default function(lines, lh) {
  return this.selectAll('tspan')
      .data(lines).enter()
    .append('tspan')
      .text(function(d) { return d; })
      .attr('x', 0)
      .attr('dy', function(d, i) { return i ? lh || 15 : 0; });
};