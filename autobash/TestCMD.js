var execFile = require('child_process').execFile;
var child = execFile('./autobash/screenphantom.js', ['297676664582'], (error, stdout, stderr) => {
    if (error) {
            throw error;
    }
});

