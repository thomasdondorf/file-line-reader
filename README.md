# File Line Reader

Asynchronous line-by-line file reader.

## Install

`npm install file-line-reader`

## Usage

Use the constructor to create a LineReader object. Then use the function `nextLine` to receive the next line. The
library will only load as many content of the file as necessary allowing to read very large files.

    var LineReader = require('./index');
    
    var reader = new LineReader('longfile.txt');
    
    reader.nextLine(function (err, line) {
        if (err) {
            // file not found, not rights, ..
        }
        
        console.log(line);
    });

## Advanced Example

In this example I read the license file line-by-line with a 100ms delay between each log call.

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

## License

MIT License.