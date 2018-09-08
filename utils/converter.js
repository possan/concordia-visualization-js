var fs = require('fs');

function convertfile(output, path) {
    var c = fs.readFileSync(path, 'UTF-8');
    var lines = c.split('\n').map(l => l.trim());
    var newlines = [];
    var afterheader = false;
    lines.forEach(l => {
        if (afterheader) {
            var c2 = l.split(/\t/);
            if (/[0-9]+/g.test(c2[0])) {
                c2[0] = parseInt(c2[0]);
                for(var i=2; i<c2.length; i++) {
                    c2[i] = parseFloat(c2[i]);
                }
                console.log(c2);
                newlines.push(c2);
            }
        }
        if (l.startsWith('++++')) {
            afterheader = true;
        }
    });

    fs.writeFileSync(output, JSON.stringify(newlines, null, 2), 'UTF-8');
}

convertfile('01.json', 'Raw Data/01 Venus Earth Geocentric.txt');
convertfile('02.json', 'Raw Data/02 Venus Earth Linklines.txt');
convertfile('03.json', 'Raw Data/03 Venus Earth Mid-points of LI.txt');
convertfile('04.json', 'Raw Data/04 Jupiter Uranus Loop Figure Conjunctions.txt');
convertfile('05.json', 'Raw Data/05 Jupiter Uranus Linklines.txt');
convertfile('06.json', 'Raw Data/06 Venus Earth Mars Pentagrams.txt');
convertfile('07.json', 'Raw Data/07 Venus Earth Mars Conjunctions.txt');
convertfile('08.json', 'Raw Data/08 Venus Earth Mars View Conjunctions.txt');
convertfile('09.json', 'Raw Data/09 Jupiter Uranus Mars.txt');
convertfile('10.json', 'Raw Data/10 Jupiter Saturn Neptune View Conjunctions.txt');
convertfile('11.json', 'Raw Data/11 Jupiter Saturn Neptune Linklines.txt');
convertfile('12.json', 'Raw Data/12 Jupiter Saturn Neptune Linklines with Midpoints.txt');
convertfile('13.json', 'Raw Data/13 Rotation of figure Mid-points Me-Ma.txt');
convertfile('14.json', 'Raw Data/14 Barycentre at Ju-Sa-oppositions.txt');
convertfile('15.json', 'Raw Data/15 Mid-points of linklines Ma-Ju at Ve-Sa.txt');
convertfile('16.json', 'Raw Data/16 Mercury in its orbit at Ve-Ma.txt');
convertfile('17.json', 'Raw Data/17 Moon at Sun-Earth-View.txt');
convertfile('18.json', 'Raw Data/18 LI Venus-Earth at Venus-Earth-View.txt');
convertfile('19.json', 'Raw Data/19 Rotation of figure at Venus-Sun-View.txt');
