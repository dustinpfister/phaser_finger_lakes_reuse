# Schedule lib

The name alone should be a strong indication of what this lib is all about, but as always it is called for to write a few quick notes about key details. With that said, yes this lib has to do with game time, and how it relates to real world time. In addition to that it also provided a class that is used to trigger events that happen over the course of a game day.

This lib also contains logic that has to do with the Color Tag System in the game. That is that at Finger Lakes Reuse we have differing color tags where at any given moment there is a current color tag that we are printing for items that are being priced. With that said there are then older items that where all ready priced, going back six weeks, so then we have current colors that are 25%, 50%, and 75% off. There is then a given color that are items that are not discounted official, but we look for them, and when found reprice them, or throw them out.

## COLOR SYSTEM

### Calibration

If for some reason the color tag system is off course from what the real world case is, this lib can be calibrated by way of changing the hard coded COLOR values. The COLOR.first\_tuesday value shoukd be an instance of a javaScript Date, and it should be the first tuesday in which there was a colors tag change event. The COLOR.first\_index value should then also be changed to line up with the date that is used as well. To know what index to set take a look at COLOR.data.

```
COLOR.first_tuesday = new Date(2025, 0, 7);
COLOR.first_index = 0;
COLOR.data = [
    { i: 0, desc: 'lavender', web: '#ff00aa' },
    { i: 1, desc: 'green',    web: '#00ff00' },
    { i: 2, desc: 'red',      web: '#ff0000' },
    { i: 3, desc: 'orange',   web: '#ff8800' },
    { i: 4, desc: 'yellow',   web: '#ffff00' },
    { i: 5, desc: 'blue',     web: '#0000ff' },
];
```

For this above example I am using the color tag event that happened on Jan 7th 2025, that was a change to printing lavender, which would be a first index of 0.
