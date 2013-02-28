(function(APP, d, w){
    var P;

    window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    })();

    APP.Particles = function(selector, duration){
        this.canvas = d.querySelector(selector);
        this.context = this.canvas.getContext('2d');
        this.w = this.canvas.width;
        this.h = this.canvas.height;
        this.particles = [];
        this.duration = duration;
    };

    P = APP.Particles.prototype;

    P.setDuration = function(duration) {
        this.duration = duration;
    };

    P.addParticle = function(t, values) {
        //t : this.duration = y : this.canvas.height
        var p = {
            x: Math.round(t * this.canvas.width / this.duration),
            y: this.canvas.height,
            up: true
        }, colorup, colordown;

        p.vx = 0;
        p.vup = Math.round((values[0] + values[1]) / 30);
        p.vdown = Math.round((values[0] + values[1]) / 10);

        if(Math.random() > 0.5) {
            colorup = [53,121,195];
            colordown = [21, 48, 77];
        } else {
            colorup = [255,70,0];
            colordown = [77, 20, 0];
        }

        p.colorup = 'rgba(' + colorup.join(',') + ',0.9)';
        p.colordown = 'rgba(' + colordown.join(',') + ',0.6)';
        p.radius = 5;

        this.particles.push(p);
    };

    P.draw = function(){
        APP.stats.begin();
        var self = this, ctx = self.context, canvas = self.canvas, particles = self.particles, i, p, w = self.w, h = self.h;
        window.requestAnimFrame(self.draw.bind(self));

        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.fillRect(0, 0, w, h);
        ctx.rect(0, 0, w, h);
        ctx.clip();
        ctx.globalCompositeOperation = "lighter";

        for (i = particles.length - 1; i >= 0; i--) {
            p = particles[i];

            ctx.beginPath();
            ctx.fillStyle = p.up ? p.colorup : p.colordown;
            ctx.arc(p.x, p.y, p.radius, Math.PI*2, false);
            ctx.fill();

            if(p.up) {
                p.y -= p.vup;
                if (p.y <= 0) {
                    p.up = false;
                }
            } else {
                p.y += p.vdown;
                if (p.y >= h) {
                    p.up = true;
                }
            }
        }
        APP.stats.end();
    };

    P.initSystem = function(){
        this.draw();
    };

})(APP, document, window);