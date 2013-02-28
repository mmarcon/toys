#mapstagram

## URL: [http://toys.marcon.me/mapstagram](http://toys.marcon.me/mapstagram)

A very simple application that loads map tiles (satellite view) into a `canvas` (could be any image, really) and apply some simple filters to obtain an Instagram-like effect.

![image](https://raw.github.com/mmarcon/toys/gh-pages/mapstagram/img/shot.png)

Map tile can be replaced with a new one in a random location by pressing the (?) button.

Future enhancements will include saving the *mapstagramized* tile and exposing all filters and parameters via the UI. For now filters and other functionalities can be applied by invoking the following methods on the `APP.debugInfo.cm` object via the console:

 * `sepia()`
 * `vignette()`
 * `frame(color, width)` - `color` is a string of type `rgb(float, float, float)`, `width` is a number and is expressed in pixels.
 * `tint(color, opacity)` - `color` is a string of type `rgb(float, float, float)`, `opacity` is a float. Applies a colored layer on top of the image.
 * `save()` opens a popup with the resulting image that can be saved locally.
 * `restore()` revert image back to the original.
 * `clear()` clears the canvas completely.

##License
Copyright 2013 Massimiliano Marcon.

Licensed under the MIT License
