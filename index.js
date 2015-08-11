
var fs = require('fs');
var readline = require('readline');
var util = require('util');

var EventEmitter = require('events').EventEmitter;

// at least read that many before stopping (so that we have a filled buffer)
var LINES_TO_READ = 1000;

function LineReader(filename, options) {
    options = options || {};
    var that = this;

    this.closed = false;
    this.buffer = [];
    this.waitingCallbacks = [];
    this.nextTickRegistered = false;
    this.options = {
        skipLines : options.skipLines || 0
    };

    var instream = fs.createReadStream(filename);

    var rl = readline.createInterface({
        input: instream,
        output: null,
        terminal: false
    });

    var lineCount = 0;

    rl.on('line', function(line) {
        lineCount++;
        if (that.options.skipLines < lineCount) {
            that.buffer.push(line);
            that.asyncPrepareServeCallbacks();

            if (that.buffer.length > LINES_TO_READ) {
                rl.pause();
            }
        }
    });

    rl.on('close', function() {
        that.closed = true;
        that.asyncPrepareServeCallbacks();
    });
    this.rl = rl;
}
util.inherits(LineReader, EventEmitter);

LineReader.prototype.resumeReading = function() {
    this.rl.resume();
};

LineReader.prototype.asyncPrepareServeCallbacks = function() {
    var that = this;
    if (!this.nextTickRegistered) {
        this.nextTickRegistered = true;
        process.nextTick(function() {
            that.nextTickRegistered = false;
            that.serveCallbacks();
        });
    }
};

LineReader.prototype.serveCallbacks = function() {
    if (this.buffer.length === 0 && !this.closed) {
        this.resumeReading();
    } else if (this.waitingCallbacks.length !== 0) {
        while (this.waitingCallbacks.length !== 0 && (this.buffer.length !== 0 || this.closed)) {
            var cb = this.waitingCallbacks.shift();
            var line = null;
            if (this.buffer.length !== 0) {
                line = this.buffer.shift(); // null -> this.closed -> EOF
            }
            cb(null, line);
        }
    }
};

LineReader.prototype.nextLine = function(cb) {
    this.waitingCallbacks.push(cb);
    this.asyncPrepareServeCallbacks();
};

module.exports = LineReader;