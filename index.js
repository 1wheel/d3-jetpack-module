import {selection} from "d3-selection";
import {transition} from "d3-transition";

import translateSelection from "./src/translate-selection";
import append from "./src/append";
import tspans from "./src/tspans";

selection.prototype.translate = translateSelection
selection.prototype.append = append
selection.prototype.tspans = tspans

export {default as wordwrap} from "./src/wordwrap";
export {default as parseAttributes} from "./src/parseAttributes";