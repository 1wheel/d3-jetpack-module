export default function(name) {
  var s = this.select(name)
  return s.size() ? s : this.append(name)
};
