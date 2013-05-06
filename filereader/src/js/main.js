(function($w, $d){
    var APP = $w.APP = {},
        $,
        fileInput,
        result,
        canvas,
        ctx;

    grammar = [
        {
            color: '#3579C3',
            match: [
                'function','var','while','for','do','switch','if','else'
            ]
        },
        {
            color: 'hotpink',
            match: [
                /banana/
            ]
        }
    ],
    bg = 'rgb(39,40,34)';

    //jQuery-like API
    Element.prototype.on = Element.prototype.addEventListener;
    $ = $d.querySelectorAll.bind(document);

    APP.init = function(){
        fileInput = $('#file')[0];
        result = $('.result')[0];
        canvas = $('canvas')[0];
        ctx = canvas.getContext('2d');
        bindEvents();
    };

    function readFile(e){
        var files = e.target.files, f, reader;

        if(files) {
            //We only care about one.
            f = files[0];
            if(!/text\/(.+)/.test(f.type)) {
                console.log('Expected text file, got: ' + f.type);
                return;
            }
            reader = new FileReader();
            reader.onload = function(e){
                var increment = 13, base = 10;

                ctx.fillStyle=bg;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.font = '12px courier';

                e.target.result.split('\n').forEach(function(l){
                    ctx.fillStyle="#ffffff";
                    ctx.fillText(l, 10, base);

                    //Highlight keywords
                    grammar.forEach(function(r){
                        var fromIndex = 0, index, measure, kmeasure;

                        r.match.forEach(function(k){
                            if(k instanceof RegExp) {
                                console.log('RegExp not yet supported');
                            } else {
                                //String based match
                                index = l.indexOf(k, fromIndex);

                                kmeasure = ctx.measureText(k);
                                while(index !== -1) {
                                    fromIndex = index;

                                    //length before
                                    measure = ctx.measureText(l.substring(0, index));

                                    ctx.fillStyle=bg;
                                    ctx.fillRect(10 + measure.width, base - 10, kmeasure.width, 12);
                                    ctx.fillStyle=r.color;
                                    ctx.fillText(k, 10 + measure.width, base);

                                    index = l.indexOf(k, fromIndex + 1);
                                }
                            }
                        });
                    });

                    base += increment;
                });
            };
            reader.readAsText(f);
        }
    }

    function bindEvents(){
        fileInput.on('change', readFile, false);
    }

}(window, document));


window.onload = function(){
    APP.init();
};