# Color System Draft

```js
const COLOR_DATA = [
    {
        i: 0,
        desc: 'lavender',
        web: '#ff00aa'
    },
    {
        i: 1,
        desc: 'green',
        web: '#00aa00'
    },
    {
        i: 2,
        desc: 'red',
        web: '#ff0000'
    },
    {
        i: 3,
        desc: 'orange',
        web: '#888800'
    },
    {
        i: 4,
        desc: 'yellow',
        web: '#ffff00'
    },
    {
        i: 5,
        desc: 'blue',
        web: '#0000ff'
    }
];
const COLOR_KEYS = COLOR_DATA.map((obj, i)=>{ return i; });

const get_current_colors = (print_index=0) => {
    const len = COLOR_KEYS.length;
    const pi = print_index % len;
    return {
        print: COLOR_DATA[ COLOR_KEYS[ pi ] ],
        d25: COLOR_DATA[ COLOR_KEYS[ ( pi + 2 ) % len ] ],
        d50: COLOR_DATA[ COLOR_KEYS[ ( pi + 3 ) % len ] ],
        d75: COLOR_DATA[ COLOR_KEYS[ ( pi + 4 ) % len ] ],
        cull: COLOR_DATA[ COLOR_KEYS[ ( pi + 5 ) % len ] ]
    };
}
```
