import path from 'path';

export default {
    // path of sqlite3 database file relaive to the project root
    "db" : 'laeufer.db',

    // path of the lof folder relative to the project root
    "log_folder" : "log",

    // is the appliaction in debbuging mode (true/false)
    "debug" : true,

    // start a http server
    "http" : true,

    // start a https server (with ssl encryption, see settings below)
    "https" : true,

    // port the backend server is running on
    "port" : {
        "http": 80, // no ssl http port
        "https": 443 // https port
    },

    // paths to the ssl private key and certificate, relative to the project root
    "ssl" : {
        "cert" : path.join('keys', 'cert.pem'),
        "key" : path.join('keys', 'key.pem')
    },

    // make service available via ipv4 AND ipv6
    "ipv6": true,

    // the ip the service is accessed by
    "ip": {
        "ipv4": "0.0.0.0",
        "ipv6": "0000:0000:0000:0000:0000:0000:0000:0000",
    },

    // password for the front end side. pls change this
    "password" : "abcd",

    // build outputr folder for the vue frontend, relative to the project root
    "frontend_folder" : "dist",

    // default pay date printet on the donation receipt
    "pay_date" : "01.09.2020",

    // default print date printet on the donation receipt
    // null means the current date of the access  
    "print_date" : null,

    // threshold, from which donation amout on, donation receipts will be generated
    "donation_receipt_threshold": 10,

    frontend : {
        "default_zipcode" : "59494",
        "default_city" : "Soest"
    }
};