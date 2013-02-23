#waveform-analysys

## URL: [http://toys.marcon.me/waveform-analysys](http://toys.marcon.me/waveform-analysys)

A simple little application that gets a random sound from [Soundcloud](http://soundcloud.com) and retrieves the corresponding waveform:

![image](https://raw.github.com/mmarcon/toys/gh-pages/waveform-analysys/img/example_wave.png)

The waveform is then drawn on canvas and used to determine the amplitude (more or less, I am not a sound expert at all) at any given time while the track is played.

While the track plays, every second or so a new particle is inserted into a simple particle system. The speed of the particle is function of the amplitude, the position of the particle depends on the time the amplitude sample was taken. Sounds very complicated, but it is in fact pretty easy.

For some reason I have some performance issues (the particle system periodically goes down to ~30FPS when the browser window is big). If you know why, [let me know](http://twitter.com/mmarcon) or submit a pull request.

##License
Copyright 2013 Massimiliano Marcon.

Licensed under the MIT License