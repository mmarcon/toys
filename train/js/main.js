(function(doc){
    var $ = doc.querySelectorAll.bind(doc),
        data = ["verona 19:57 20:12 0 0 0",
                "vicenza 20:24 21:20 45 27 68",
                "cittadella 20:46 21:49 21 22 29",
                "castelfranco 20:58 21:59 12 12 10",
                "treviso 21:18 22:20 23 20 21",
                "conegliano 21:38 22:38 26 20 18"];

    function calculate(data, width){
        var p = 0, px = 0, dTotal = 0, pTotal = 0, aTotal = 0, cData = [];
        data.forEach(function(l){
            var steps = l.split(' ').map(function(s){
                    var i = parseInt(s,10);
                    if(isNaN(i)) {
                        return s;
                    }
                    return i;
                }),
                dPartial = steps[3],
                pPartial = steps[4],
                aPartial = steps[5];
            cData.push(steps);
            dTotal += dPartial;
            pTotal += pPartial;
            aTotal += aPartial;
        });


        var css = {}, ghostCss = {}, dSemi = 0, aSemi = 0, pSemi = 0, li, speedLi, rot = 0;
        cData.forEach(function(step, idx){
            var key, px;
            dSemi += step[3];
            pSemi += step[4];
            aSemi += step[5];

            key = Math.round(aSemi * 100 / aTotal);
            px = Math.round(dSemi / dTotal * width);

            css[key + '%'] = {
                left: (px - 95) + 'px'
            };

            li = doc.createElement('li');
            li.style.left = (px + 3) + 'px';
            li.style['-webkit-transform'] = 'rotateY(' + rot + 'deg)';
            li.innerHTML = step[0];

            rot-=5;

            $('.stations')[0].appendChild(li);

            key = Math.round(pSemi * 100 / pTotal);
            ghostCss[key + '%'] = {
                left: (px - 95) + 'px'
            };
        });
        return [css, ghostCss];
    }

    console.log(JSON.stringify(calculate(data, 4000)[0]).replace(/"/g, '').replace(/,/g, ' ').replace(/%\:/g, '% '));
    console.log(JSON.stringify(calculate(data, 4000)[1]).replace(/"/g, '').replace(/,/g, ' ').replace(/%\:/g, '% '));

    $('button')[0].addEventListener('click', function(){
        $('body')[0].classList.add('go');
        this.style.display = 'none';
    });
}(document));