import React from 'react';

var SimpleMeter = function (props) {
  var {
    rotation = 180,        // degrees to rotate the element
    percent = 0,         // a number between 0 and 1, inclusive
    width = 12,         // the overall width
    height = 100,         // the overall height
    rounded = true,      // if true, use rounded corners
    color = "#0078bc",   // the fill color
    animate = false,     // if true, animate when the percent changes
    label = null,          // a label to describe the contents (for accessibility)
  } = props;

  var r = rounded ? Math.ceil(width / 2) : 0;
  var h = percent ? Math.max(width, height * Math.min(percent, 1)) : 0;
  var style = animate ? { "transition": "height 500ms, fill 250ms" } : null;

  return (
    <svg width={width} height={height} aria-label={label} transform={`rotate(${rotation})`} >
      <rect width={width} height={height} fill='#eceff1' rx={r} ry={r}/>
      <rect width={width} height={h} fill={color} rx={r} ry={r} style={style}/>
    </svg>
  );
};

export default SimpleMeter;