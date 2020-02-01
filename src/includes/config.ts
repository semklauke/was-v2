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
    },

    // password for the front end side. pls change this
    "password" : "abcd",

    // build outputr folder for the vue frontend, relative to the project root
    "frontend_folder" : "dist",

    // default pay date printet on the donation receipt
    "pay_date" : "01.09.2020",

    // default print date printet on the donation receipt
    // null means the current date of the access  
    "print_date" : null
};