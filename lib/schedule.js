
const COLOR = {};

COLOR.data = [
    { i: 0, desc: 'lavender', web: '#ff00aa' },
    { i: 1, desc: 'blue',     web: '#0000ff' },
    { i: 2, desc: 'yellow',   web: '#ffff00' },
    { i: 3, desc: 'orange',   web: '#ff8800' },
    { i: 4, desc: 'red',      web: '#ff0000' },
    { i: 5, desc: 'green',    web: '#00ff00' },
];

COLOR.keys = COLOR.data.map((obj, i)=>{ return i; });

COLOR.get_current_colors = ( print_index=0 ) => {

    if(typeof print_index === 'string'){
        const options = COLOR.data.filter((obj)=>{ return obj.desc === print_index.toLowerCase().trim(); });
        if(options.length >= 1){
            print_index = options[0].i;
        }
        if(options.length === 0){
            print_index = 0;
        }
    }

    const len = COLOR.keys.length;
    const pi = print_index % len;
    return {
        print: COLOR.data[ COLOR.keys[ pi ] ],
        d25: COLOR.data[ COLOR.keys[ ( pi + 2 ) % len ] ],
        d50: COLOR.data[ COLOR.keys[ ( pi + 3 ) % len ] ],
        d75: COLOR.data[ COLOR.keys[ ( pi + 4 ) % len ] ],
        cull: COLOR.data[ COLOR.keys[ ( pi + 5 ) % len ] ]
    };
};


export { COLOR };
