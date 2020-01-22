import path from 'path';

export default {
    // path of sqlite3 database file relaive to the project root
    "db" : 'laeufer.db',

    // path of the lof folder relative to the project root
    "log_folder" : "log",

    // is the appliaction in debbuging mode (true/false)
    "debug" : true,

    // port the backend server is running on
    "port" : 3000,

    // paths to the ssl private key and certificate, relative to the project root
    "ssl" : {
        "cert" : path.join('keys', 'cert.pem'),
        "key" : path.join('keys', 'key.pem')
    }

};