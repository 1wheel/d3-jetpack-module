import {queue} from 'd3-queue';

export default function(files, cb){
  var q = queue()
  files.forEach(function(d){
    var type = d.split('.').reverse()[0]
    if (type != 'csv' && type != 'json') return cb(new Error('Invalid type', d))
    q.defer(d3[type], d) 
  })
  q.awaitAll(cb)
}