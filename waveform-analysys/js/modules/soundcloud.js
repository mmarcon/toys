(function(APP, SC, d, win){

    SC.initialize({
        client_id: '3250702ba4b56851bbab494386639d1e'
    });

    var W;

    var CANVAS_WIDTH = 450,
        CANVAS_HEIGHT = 70,
        CORS_PROXY = 'http://www.corsproxy.com/';

    APP.init = function(){
        var progress = d.querySelector('.progress') || {style:{}};

        SC.get("/tracks", function(tracks){
            var track = tracks[Math.floor(Math.random() * tracks.length)],
                waveform,
                duration,
                w,
                particleSystem;

            while(!track.streamable) {
                track = tracks[Math.floor(Math.random() * tracks.length)];
            }

            waveform = CORS_PROXY + track.waveform_url.replace('http://', '');
            duration = track.duration;
            APP.debugInfo.track = track;

            w = new APP.Wave(waveform);
            w.time = duration;

            APP.debugInfo.w = w;
            particleSystem = new APP.Particles('.particles', 1);
            particleSystem.initSystem();

            w.draw(function(){
                var play = function play(sound){
                    var t = sound.position, currentDuration = sound.duration || sound.durationEstimate || w.time;

                    progress.style.width = (t * CANVAS_WIDTH / w.time) + 'px';
                    var vals = w.getValuesAtTime(t);
                    particleSystem.setDuration(currentDuration);
                    particleSystem.addParticle(t, vals);

                    if(t < currentDuration) {
                        setTimeout(play, 1200, sound);
                    } else {
                        d.querySelector('.waveform-wrapper').style.display = 'none';
                        win.location.reload();
                    }
                };
                SC.stream('/tracks/' + track.id, function(sound){
                    sound.play();
                    APP.debugInfo.sound = sound;
                    play(sound);
                });
            });
        });
    };

    APP.initFake = function(){
        var total = 60 * 1000, current = 0;
        var particleSystem = new APP.Particles('.particles', total);
        particleSystem.initSystem();
        var play = function play(){
            particleSystem.addParticle(current, [~~(Math.random() * 26 + 1), ~~(Math.random() * 22 + 1)]);
            current += 300;
            setTimeout(play, 300);
        };
        play();
    };

    APP.initFake2 = function() {
        var progress = d.querySelector('.progress') || {style:{}};

        SC.get("/tracks", function(tracks){
            var track = tracks[Math.floor(Math.random() * tracks.length)],
                waveform = CORS_PROXY + track.waveform_url.replace('http://', ''),
                duration = track.duration, w, particleSystem,
                current = 0;
            APP.debugInfo.track = track;

            w = new APP.Wave(waveform);
            w.time = duration;

            APP.debugInfo.w = w;
            particleSystem = new APP.Particles('.particles', duration);
            particleSystem.initSystem();

            w.draw(function(){
                var play = function play(){
                    var vals = w.getValuesAtTime(current);
                    particleSystem.addParticle(current, [~~(Math.random() * 26 + 1), ~~(Math.random() * 22 + 1)]);
                    progress.style.width = (current * CANVAS_WIDTH / w.time) + 'px';
                    current += 600;
                    setTimeout(play, 600);
                };
                play();
            });
        });
    };

    APP.Wave = function(url) {
        this.url = url;
        this.canvas = d.querySelector('.waveform');
        this.context = this.canvas.getContext('2d');
        this.time = -1;
    };

    W = APP.Wave.prototype;

    W.draw = function(done){
        var self = this,
            img = new Image();

        img.crossOrigin = 'Anonymous';

        img.onload = function(){
            self.context.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            done.call(self);
        };

        img.src = self.url;
    };

    W.getValuesAt = function(x) {
        var values = [], data, t, zero;
        //Get the column
        data = this.context.getImageData(x, 0, 1, CANVAS_HEIGHT);
        //I want to determine the top-most transparent pixel y coordinate
        //and the bottom-most white pixel y coordinate
        //Transparent is 0,0,0,0
        //Gray-ish is ~ 239,239,239,255
        //Let's be smart and get indexes of the pixels for which alpha is 0
        t = [].filter.call(data.data, function(el, index){
            return (index - 3) % 4 === 0;
        });

        zero = t.length / 2;

        return [zero - t.indexOf(0), t.lastIndexOf(0) - zero];
    };

    W.getValuesAtTime = function(t) {
        var self = this;

        if(!self.time) {
            return -1;
        }

        return self.getValuesAt(Math.round(t * CANVAS_WIDTH / self.time));
    };

})(APP, SC, document, window);