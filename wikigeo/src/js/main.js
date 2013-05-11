$(window).on('load', function(){
    var m = $('#map'), busy = false, b = $('button'), info = $('#info'),
        h3 = info.find('h3'), section = info.find('p'),
        c = $('#container');

    navigator.geolocation.getCurrentPosition(go, $.noop);

    function go(position){

        m.jHERE({
            enable:['behavior'],
            zoom: 12,
            center: position.coords,
            type: 'smart'
        });

        b.on('click', check);
        $(document).on('click', '.back', function(){
            c.css({'-webkit-transform': 'rotateY(0deg)',
                   '-moz-transform': 'rotateY(0deg)',
                   '-o`-transform': 'rotateY(0deg)',
                   '-ms-transform': 'rotateY(0deg)',
                   'transform': 'rotateY(0deg)'});
        });
        $(document).on('click', '.more-info', function(){
            h3.text($(this).data('name'));
            section.text($(this).data('info'));
            c.css({'-webkit-transform': 'rotateY(180deg)',
                   '-moz-transform': 'rotateY(180deg)',
                   '-o`-transform': 'rotateY(180deg)',
                   '-ms-transform': 'rotateY(180deg)',
                   'transform': 'rotateY(180deg)'});
        });

        $.jHERE._JSLALoader.is.done(check);
    }

    function check(){
        if(busy) {
            return;
        }
        var center = m.jHERE().center;
        b.prop('disabled', true);
        geojson([center.longitude, center.latitude], {
            radius: 10000,
            limit: 50,
            summaries: true,
            images: true
        }, function(data) {
            var places;
            if(data && data.features && data.features.length > 0){
                places = data.features.map(normalize);
                places.forEach(function(place){
                    m.jHERE('marker', place, {icon: 'img/w.png', anchor: {
                        x: 6, y: 6
                    },
                    click: function(){
                        m.jHERE('nobubbles');
                        m.jHERE('bubble', place, {
                            content: $makeBubbleTemplate(place.properties.name, place.properties.summary),
                            closable: true
                        });
                    }
                    });
                });
                // m.jHERE('originalMap', function(map) {map.zoomTo(map.getBoundingBox());});
                m.jHERE('heatmap', places, 'density', {
                    colors: {
                        stops: {
                            "0": "#ffffff",
                            "0.20": "#ffb6c1",
                            "0.60": "#dc143c",
                            "0.80": "#ff4500",
                            "1": "#ffffff"
                        },
                        interpolate: true
                    }
                });
            }
            busy = false;
            b.prop('disabled', false);
        });
    }

    function $makeBubbleTemplate(name, summary) {
        var t = $('<h3>' + name + '</h3>'),
            s = $('<p>' + summary + '</p>'),
            button = $('<button>More Info</button>');

        button.attr('data-info', summary);
        button.attr('data-name', name);
        button.addClass('more-info');

        return $('<div class="jh-bubble">').append(t).append(button);
    }

    function normalize(entry){
        return {
            latitude: entry.geometry.coordinates[1],
            longitude: entry.geometry.coordinates[0],
            value: 1,
            properties: entry.properties
        };
    }

});