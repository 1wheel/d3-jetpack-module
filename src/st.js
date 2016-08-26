import ƒ from "./f";

export default function(name, value) {
  if (typeof(name) == 'object'){
    for (var key in name){
      this.style(value, name[key]) 
    }
    return this
  } else{
    return arguments.length == 1 ? this.style(name) : this.style(name, value)
  }


  function addStyle(sel, style, value){
    var style = style.replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase()

    var pxStyles = 'top left bottom right padding-top padding-left padding-bottom padding-right border-top b-width border-left-width border-botto-width m border-right-width  margin-top margin-left margin-bottom margin-right font-size width height stroke-width line-height margin padding border'
  } 

  function addPx(d){
    return d.match ? d : d + 'px'
  }
};