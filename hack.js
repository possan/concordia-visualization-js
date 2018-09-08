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

    file_element.options[0] = new Option('01 Venus Earth Geocentric.txt', '01.json');
    file_element.options[1] = new Option('02 Venus Earth Linklines.txt', '02.json');
    file_element.options[2] = new Option('03 Venus Earth Mid-points of LI.txt', '03.json');
    file_element.options[3] = new Option('04 Jupiter Uranus Loop Figure Conjunctions.txt', '04.json');
    file_element.options[4] = new Option('05 Jupiter Uranus Linklines.txt', '05.json');
    file_element.options[5] = new Option('06 Venus Earth Mars Pentagrams.txt', '06.json');
    file_element.options[6] = new Option('07 Venus Earth Mars Conjunctions.txt', '07.json');
    file_element.options[7] = new Option('08 Venus Earth Mars View Conjunctions.txt', '08.json');
    file_element.options[8] = new Option('09 Jupiter Uranus Mars.txt', '09.json');
    file_element.options[9] = new Option('10 Jupiter Saturn Neptune View Conjunctions.txt', '10.json');
    file_element.options[10] = new Option('11 Jupiter Saturn Neptune Linklines.txt', '11.json');
    file_element.options[11] = new Option('12 Jupiter Saturn Neptune Linklines with Midpoints.txt', '12.json');
    file_element.options[12] = new Option('13 Rotation of figure Mid-points Me-Ma.txt', '13.json');
    file_element.options[13] = new Option('14 Barycentre at Ju-Sa-oppositions.txt', '14.json');
    file_element.options[14] = new Option('15 Mid-points of linklines Ma-Ju at Ve-Sa.txt', '15.json');
    file_element.options[15] = new Option('16 Mercury in its orbit at Ve-Ma.txt', '16.json');
    file_element.options[16] = new Option('17 Moon at Sun-Earth-View.txt', '17.json');
    file_element.options[17] = new Option('18 LI Venus-Earth at Venus-Earth-View.txt', '18.json');
    file_element.options[18] = new Option('19 Rotation of figure at Venus-Sun-View.txt', '19.json');

    loadFile('1.json');
    clear();
});
