export default function(name, value) {
  if (typeof(name) == 'object'){
    for (var key in name) { this.style(key.replace('_', '-'), name[key]) }
    return this
  } else{
    return arguments.length == 1 ? this.style(name) : this.style(name, value)
  }
};