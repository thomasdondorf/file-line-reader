
var LineReader = require('./index');

var reader = new LineReader('LICENSE.txt');

function slowReader() {
    setTimeout(function() {
        reader.nextLine(function (err, line) {
            if (line !== null) {
                console.log(line);
                slowReader();
            }
        });
    }, 100);
}

slowReader();