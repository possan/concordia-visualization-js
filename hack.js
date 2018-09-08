var file_element;
var skip_element;
var skip_label;
var ctx;

var WIDTH = 1200;
var HEIGHT = 1200;
var DRAW_DELAY = 30;

var all_lines = [];
var line_timer = 0;
var skip = 1;
var zoom = 10;
var index = 0;

function pol2cart([lat, lon, radius]) {
    // copy of max patch logic, a bit off, but renders the same way.
    var sin_x = Math.sin(lat * Math.PI / 180.0);
    var cos_x = Math.cos(lat * Math.PI / 180.0);
    var cos_y = Math.cos(lon * Math.PI / 180.0);
    return [
        radius * sin_x * cos_y,
        radius * cos_x * cos_y,
        radius * cos_y,
    ];
}

function renderOneLine() {
    if (line_timer != 0) {
        clearTimeout(line_timer);
    }

    if (l >= all_lines.length) {
        console.log('out of lines.');
        return;
    }

    var l = all_lines[index];
    if (!l) {
        console.log('weird.');
        return;
    }

    var xyz1 = pol2cart(l.slice(2, 5)); // body 1
    var xyz2 = pol2cart(l.slice(5, 8)); // body 2

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;

    var s = 0.1 + zoom / 50.0;

    ctx.beginPath();
    ctx.moveTo(WIDTH / 2 + s * xyz1[0], HEIGHT / 2 + s * xyz1[1]);
    ctx.lineTo(WIDTH / 2 + s * xyz2[0], HEIGHT / 2 + s * xyz2[1]);
    ctx.stroke();

    index += skip;

    setTimeout(() => renderOneLine(), DRAW_DELAY);
}

function clear() {
    ctx.fillStyle = '#444';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    if (line_timer != 0) {
        clearTimeout(line_timer);
    }
}

function redraw() {
    clear();
    index = 0;
    setTimeout(() => renderOneLine(), DRAW_DELAY);
}

function loadFile(fn) {
    clear();
    fetch(fn).then(r => {
        r.json().then(data => {
            console.log('Got data', data);
            all_lines = data;
            redraw();
        }).catch(e => {
            console.log('Json parsing failed', e);
        });
    }).catch(e => {
        console.log('Fetch failed', e);
    });
}

function changeFile(e) {
    var nfn = e.target.options[e.target.selectedIndex].value;
    loadFile(nfn);
}

function changeSkip(e) {
    skip = ~~e.target.value;
    skip_label.textContent = '' + skip;
    redraw();
}

function dragSkip(e) {
    if (e.buttons) {
        skip = ~~e.target.value;
        skip_label.textContent = '' + skip;
    }
}

function changeZoom(e) {
    zoom = ~~e.target.value;
    zoom_label.textContent = '' + zoom;
    redraw();
}

function dragZoom(e) {
    if (e.buttons) {
        zoom = ~~e.target.value;
        zoom_label.textContent = '' + zoom;
    }
}

window.addEventListener('load', () => {
    console.log('setting up...');
    canvas = document.getElementById('c');
    ctx = canvas.getContext('2d');
    file_element = document.getElementById('f');
    skip_element = document.getElementById('r');
    skip_label = document.getElementById('rl');
    zoom_element = document.getElementById('z');
    zoom_label = document.getElementById('zl');
    file_element.addEventListener('change', e => changeFile(e));
    skip_element.addEventListener('change', e => changeSkip(e));
    skip_element.addEventListener('mousemove', e => dragSkip(e));
    zoom_element.addEventListener('change', e => changeZoom(e));
    zoom_element.addEventListener('mousemove', e => dragZoom(e));
    document.getElementById('b1').addEventListener('click', () => redraw());

    for(var fn=1; fn<=19; fn++) {
        var opt = new Option(fn + '.json', fn + '.json');
        file_element.options[file_element.options.length] = opt;
    }

    loadFile('1.json');
    clear();
});
