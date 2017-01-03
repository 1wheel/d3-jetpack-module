import {creator} from "d3-selection";

export default function(name) {
  return this.select(function() {
    return this.parentNode;
  });
}
