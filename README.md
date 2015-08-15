# File Line Reader

Asynchronous line-by-line file reader.

## Install

`npm install file-line-reader`

## Usage

Use the constructor to create a LineReader object. Then use the function `nextLine` to receive the next line. The
library will only load as many content of the file as necessary allowing to read very large files.

    var LineReader = require('file-line-reader');
    
    var reader = new LineReader('longfile.txt');
    
    // Reads the file line of the longfile.txt file
    reader.nextLine(function (err, line) {
        if (err) {
            // file not found, no read rights, ..
        }
        
        console.log(line);
    });

## Advanced Example

In this example we read the license file line by line with a 100ms delay between each log call.

    var LineReader = require('file-line-reader');
    
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

## License

MIT License.