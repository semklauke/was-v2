const path = require('path');

let rimraf = require('rimraf');

let c = 0; 
let cb = function(err) {
    if (err) {
        console.error(err);
    } else {
        c++;
        if (c === 5) 
            console.log("Clear done.");
    }
}

rimraf(path.join(__dirname, "..", "includes"), cb);
rimraf(path.join(__dirname, "..", "static", "js"), cb);
rimraf(path.join(__dirname, "..", "backend.*"), cb);
rimraf(path.join(__dirname, "..", "log"), cb);
rimraf(path.join(__dirname, "..", "dist"), cb);