(function(APP, d, w){
    var config = {
        credentials: {
            id: 'vIhACCr8fH8BimkeaxYm',
            token: 'krTA_4qmIEB9JE-xikmLfA'
        },
        mapUrl: 'm.nok.it/?app_id=vIhACCr8fH8BimkeaxYm&token=krTA_4qmIEB9JE-xikmLfA&c={LAT},{LON}&nord&nodot&t={T}&h={H}&w={W}&z={ZOOM}',
        proxy: 'http://corsproxy.com/'
    };

    var CanvasManager = function(selector){
        this.canvas = d.querySelector(selector);
        this.context = this.canvas.getContext('2d');
        this.image = null;
    };

    CanvasManager.prototype.renderImage = function(url, done){
        var img = new Image(), self = this;
        img.crossOrigin = 'Anonymous';
        img.onload = function(){
            self.context.drawImage(img, 0, 0, self.canvas.width, self.canvas.height);
            if(typeof done === 'function') {
                done.call(self);
            }
        };
        img.src = url;
        this.image = img;
    };

    function grayval(r, g, b) {
        return r * 0.3 + g * 0.59 + b * 0.11;
    }

    CanvasManager.prototype.bw = function(){
        var imgData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height),
            pix = imgData.data,
            i = 0,
            n = pix.length,
            grayscale;

        for (; i < n; i += 4) {
            grayscale = grayval(pix[i], pix[i + 1], pix[i + 2]);
            pix[i] = pix[i + 1] = pix[i + 2] = grayscale;
        }
        this.context.putImageData(imgData, 0, 0);
    };

    CanvasManager.prototype.threshold = function(t){
        var imgData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height),
            pix = imgData.data,
            i = 0,
            n = pix.length,
            grayscale;

        t = t || 100;

        for (; i < n; i += 4) {
            grayscale = grayval(pix[i], pix[i + 1], pix[i + 2]);
            pix[i] = pix[i + 1] = pix[i + 2] = (grayscale > t ? 255 : 0);
        }
        this.context.putImageData(imgData, 0, 0);
    };

    function sepiaval(r, g, b) {
        var or, og, ob;
        or = (r * 0.393) + (g *0.769) + (b * 0.189);
        og = (r * 0.349) + (g *0.686) + (b * 0.168);
        ob = (r * 0.272) + (g *0.534) + (b * 0.131);
        return [or, og, ob];
    }

    CanvasManager.prototype.sepia = function(){
        var imgData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height),
            pix = imgData.data,
            i = 0,
            n = pix.length,
            sepia;

        for (; i < n; i += 4) {
            sepia = sepiaval(pix[i], pix[i + 1], pix[i + 2]);
            pix[i] = sepia[0];
            pix[i + 1] = sepia[1];
            pix[i + 2] = sepia[2];
        }
        this.context.putImageData(imgData, 0, 0);
    };

    CanvasManager.prototype.vignette = function(){
        //https://github.com/rendro/vintageJS/blob/master/src/vintage.js
        var gradient, self = this, ctx = self.context, canvas = self.canvas,
        outerRadius = Math.sqrt(Math.pow(canvas.width/2, 2) + Math.pow(canvas.height/2, 2));
        ctx.globalCompositeOperation = 'source-over';
        gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, outerRadius);
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(0.65, 'rgba(0,0,0,0)');
        gradient.addColorStop(1, 'rgba(0,0,0,0.7)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.globalCompositeOperation = 'lighter';
        gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, outerRadius);
        gradient.addColorStop(0, 'rgba(255,255,255,0.05)');
        gradient.addColorStop(0.65, 'rgba(255,255,255,0)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    CanvasManager.prototype.tint = function(color, opacity){
        var self = this, ctx = self.context, canvas = self.canvas;

        color = color || {r: 204, g: 0, b: 0};
        opacity = opacity || 0.4;

        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + opacity + ')';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    CanvasManager.prototype.restore = function(){
        this.context.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
    };

    CanvasManager.prototype.save = function(){
        window.open(this.canvas.toDataURL("image/png"), 'Map');
    };

    function buildTileURL(options) {
        return config.proxy + config.mapUrl
            .replace('{LAT}', options.lat || 0)
            .replace('{LON}', options.lon || 0)
            .replace('{T}', options.type || 0)
            .replace('{W}', options.width || 500)
            .replace('{H}', options.height || 500)
            .replace('{ZOOM}', options.zoom || 10);
    }

    /*
        0 (normal.day)
        Normal map view in day light mode.

        1 (satellite.day)
        Satellite map view in day light mode.

        2 (terrain.day)
        Terrain map view in day light mode.

        3 (hybrid.day)
        Satellite map view with streets in day light mode.

        4 (normal.day.transit)
        Normal grey map view with public transit in day light mode.

        5 (normal.day.grey)
        Normal grey map view in day light mode (used for background maps).

        6 (normal.day.mobile)
        Normal map view for small screen devices in day light mode.

        7 (normal.night.mobile)
        Normal map view for small screen devices in night mode.

        8 (terrain.day.mobile)
        Terrain map view for small screen devices in day light mode.

        9 (hybrid.day.mobile)
        Satellite map view with streets for small screen devices in day light mode.

        10 (normal.day.transit.mobile)
        Normal grey map view with public transit for small screen devices in day light mode.

        11 (normal.day.grey.mobile)
        12 (carnav.day.grey) Map view designed for navigation devices.
        13 (pedestrian.day) Map view designed for pedestrians walking by day.
        14 (pedestrian.night) Map view designed for pedestrians walking by night.

    */

    APP.init = function(){
        var cm = APP.debugInfo.cm = new CanvasManager('canvas');
        cm.renderImage(buildTileURL({
            lat: 52.5,
            lon: 13.3,
            type: 1,
            width: 500,
            height: 500,
            zoom: 14
        }));
    };
})(APP, document, window);



window.onload = function() {
    APP.init();
};