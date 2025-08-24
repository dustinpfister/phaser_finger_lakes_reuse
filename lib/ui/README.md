# UI Lib for Finger Lakes Reuse

This is what I have together for the User Interface Library for finger Lakes Reuse. This UI lib provides a way to create menus, consisting of buttons, and is also where I am parking much of the global controls when it comes to things like keyboard shortcuts.

## The GlobalControl Object

As the name suggests the GlobalControl object is where I am parking logic that has to do with global, game wide controls. As of R7 this is just keyboard controls.

## The Menu Class

The Menu class extends from the Phaser Group class, and with that each child in the Menu is an instance of Button, which extends from the Phaser Sprite class.
