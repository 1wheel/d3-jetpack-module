import {selector} from "d3-selection";
import {creator} from "d3-selection";

export default function(name) {
  var select = selector(name),
      create = creator(name);
  return this.select(function() {
    return select.apply(this, arguments)
        || this.appendChild(create.apply(this, arguments));
  });
};

