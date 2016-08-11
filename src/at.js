export default function(name, value) {
  if (typeof(name) == 'object'){
    for (var key in name) { this.attr(key.replace('_', ''), name[key]) }
    return this
  } else{
    return arguments.length == 1 ? this.attr(name) : this.attr(name, value)
  }
};