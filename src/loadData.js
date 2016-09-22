import {queue} from 'd3-queue';
import {csv, tsv, json} from 'd3-request'

export default function(files, cb){
  var q = queue()
  files.forEach(function(d){
    var type = d.split('.').reverse()[0]

    var loadFn = {csv: csv, tsv: tsv, json: json}[type]
    if (!loadFn) return cb(new Error('Invalid type', d))
    q.defer(loadFn, d) 
  })
  q.awaitAll(cb)
}