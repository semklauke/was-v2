const path = require('path');
const fs = require('fs');
const net = require('net')

const prompts = require('prompts');

const c = require('./../includes/config').default;

let formatToNodePath = str_in => {
    let str = "path.join("
    for (let el of str_in.split("/")) {
        if (el == "") continue;
        str += `'${el}', `
    }
    return str.slice(0,-2) + ")"
}

const questions = [
    {
        type: "text",
        name: "db",
        message: "Pfad zur sqlite3 datenbank: ",
        initial: c.db
    },
    {
        type: "text",
        name: "log_folder",
        message: "Pfad zum logging ordner: ",
        initial: c.log_folder
    },
    {
        type: 'confirm',
        name: 'debug',
        message: 'Debug modus? ',
        initial: c.debug,
    },
    {
        type: 'confirm',
        name: 'http',
        message: 'Http server? (ohne ssl)',
        initial: c.http,
    },
    {
        type: 'confirm',
        name: 'https',
        message: 'Https server? (mit ssl)',
        initial: c.https,
    },
    {
        type: (_, prevs) => prevs.http ? 'number' : null,
        name: 'port_http',
        message: 'http Port: ',
        initial: c.port.http,
        min: 0
    },
    {
        type: (_, prevs) => prevs.https ? 'number' : null,
        name: 'port_https',
        message: 'https Port: ',
        initial: c.port.https,
        min: 0
    },
    {
        type: (_, prevs) => prevs.https ? 'text' : null,
        name: 'ssl_cert',
        message: 'Pfad zum RSA SSL Zertificat in PEM format: ',
        initial: c.ssl.cert,
        format: formatToNodePath
    },
    {
        type: (_, prevs) => prevs.https ? 'text' : null,
        name: 'ssl_key',
        message: 'Pfad zum RSA SSL Privat Key in PEM format: ',
        initial: c.ssl.key,
        format: formatToNodePath
    },
    {
        type:  'text',
        name: 'ip_ipv4',
        message: 'IPv4 Addresse: ',
        initial: c.ip.ipv4,
        validate: val => net.isIP(val) === 4
    },
    {
        type: 'confirm',
        name: 'ipv6',
        message: 'IPv6 aktivieren (neben IPv4) ? ',
        initial: c.ipv6
    },
    {
        type:  prev => prev === true ? 'text' : null,
        name: 'ip_ipv6',
        message: 'IPv6 Addresse: ',
        initial: c.ip.ipv6,
        validate: val => net.isIP(val) === 6
    },
    {
        type:  'password',
        name: 'password',
        message: 'Passwort: ',
        initial: c.password,
    },
    {
        type:  'text',
        name: 'frontend_folder',
        message: 'Pfad zum Ordner in den das Vue frontend gerendert wird: ',
        initial: c.frontend_folder,
    },
    {
        type:  'text',
        name: 'pay_date',
        message: 'Zahlungsdatum, welches auf die Spendenquittungen geschrieben wird: ',
        initial: c.pay_date,
    },
    {
        type: 'text',
        name: "print_date",
        message: "Druckdatum, welches auf die Spendenquittungen geschrieben wird (null = Datum des abrufes der webseite): ",
        initial: c.print_date === null ? 'null' : c.print_date,
        format: val => val === 'null' || val === null ? 'null' : '"'+val+'"'

    },
    {
        type: 'number',
        name: "donation_receipt_threshold",
        message: "Ab welchem Geldbetrag wird eine Spendenquittung ausgestellt: ",
        initial: c.donation_receipt_threshold,
        format: val => parseFloat(val),
        min: 0.0
    }
];


console.log("Bearbeiten der config in src/includes/config.ts.");
console.log("Die aktuellen werte erscheinen in Grau. Mit ENTER kann man diese übernehmen");
console.log("\n");
setTimeout(async () => {
    const response = await prompts(questions);
    let newConfig = `import path from 'path';

export default {
    // path of sqlite3 database file relaive to the project root
    "db" : '${ response.db }',

    // path of the lof folder relative to the project root
    "log_folder" : "${ response.log_folder }",

    // is the appliaction in debbuging mode (true/false)
    "debug" : ${ response.debug },

    // start a http server
    "http" : ${ response.http },

    // start a https server (with ssl encryption, see settings below)
    "https" : ${ response.https },

    // port the backend server is running on
    "port" : {
        "http": ${ response.http ? response.port_http : c.port.http }, // no ssl http port
        "https": ${ response.https ? response.port_https : c.port.https } // https port
    },

    // paths to the ssl private key and certificate, relative to the project root
    "ssl" : {
        "cert" : ${ response.https ?  response.ssl_cert : formatToNodePath(c.ssl.cert)},
        "key" : ${ response.https ?  response.ssl_key : formatToNodePath(c.ssl.key)}
    },

    // make service available via ipv4 AND ipv6
    "ipv6": ${ response.ipv6 },

    // the ip the service is accessed by
    "ip": {
        "ipv4": "${ response.ip_ipv4 }",
        "ipv6": "${ response.ip_ipv6 ? response.ip_ipv6 : "0000:0000:0000:0000:0000:0000:0000:0000" }",
    },

    // password for the front end side. pls change this
    "password" : "${ response.password }",

    // build outputr folder for the vue frontend, relative to the project root
    "frontend_folder" : "${ response.frontend_folder }",

    // default pay date printet on the donation receipt
    "pay_date" : "${ response.pay_date }",

    // default print date printet on the donation receipt
    // null means the current date of the access  
    "print_date" : ${ response.print_date === 'null' ? 'null' : '"'+response.print_date+'"' },

    // threshold, from which donation amout on, donation receipts will be generated
    "donation_receipt_threshold": ${ response.donation_receipt_threshold },

    frontend : {
        "default_zipcode" : "59494",
        "default_city" : "Soest"
    }
};`;

    fs.writeFile(path.join(__dirname, "..", "src", "includes", "config.ts"), newConfig, (err) => {
        if (err) throw err;
        console.log("\n");
        console.log('Neue Config geschrieben: ');
        console.log(response);
    });

    
}, 1200);
    


