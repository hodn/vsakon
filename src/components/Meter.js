import * as React from 'react';


let Meter = function (props) {
    let {
        percent = 0,         // a number between 0 and 1, inclusive
        width = 100,         // the overall width
        height = 10,         // the overall height
        color = "#0078bc",   // the fill color
        animate = false,     // if true, animate when the percent changes
        label = null         // a label to describe the contents (for accessibility)
    } = props;

    let w = width > percent * width ? percent * width : width;
    let e = 5;
    let n = Math.floor(width / (e + 2));
    let p = (width - (e * n)) / (n - 1);
    let x = 0;
    let style = animate ? { "transition": "width 500ms, fill 250ms" } : null;
    let path = "";

    for (let i = 0; i < n; i++) {
        path += "M" + x + ",0 h" + e + " v" + height + " h-" + e + " z ";
        x += (e + p);
    }

    return (
        <svg width={width} height={height} aria-label={label} data-tooltip={label}>
            <defs>
                <mask id="_mask">
                    <path d={path} fill="white" />
                </mask>
            </defs>
            <rect width={width} height={height} fill="#ccc" mask="url(#_mask)" />
            <rect width={w} height={height} fill={color} style={style} mask="url(#_mask)" />
        </svg>
    );
};

export default Meter;