const path = require('path');
const fs = require('fs');

const prompts = require('prompts');

const c = require('./../includes/config').default;

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
        type: 'number',
        name: 'port',
        message: 'Website Port: ',
        initial: c.port,
    },
    {
        type: 'text',
        name: 'ssl_cert',
        message: 'Pfad zum RSA SSL Zertificat in PEM format: ',
        initial: c.ssl.cert,
    },
    {
        type: 'text',
        name: 'ssl_key',
        message: 'Pfad zum RSA SSL Privat Key in PEM format: ',
        initial: c.ssl.key,
    },
    {
        type:  'text',
        name: 'ip_ipv4',
        message: 'IPv4 Addresse: ',
        initial: c.ip.ipv4,
    },
    {
        type: 'confirm',
        name: 'ipv6',
        message: 'IPv6 aktivieren (neben IPv4) ? ',
        initial: c.ipv6,
    },
    {
        type:  prev => prev === true ? 'text' : null,
        name: 'ip_ipv6',
        message: 'IPv6 Addresse: ',
        initial: c.ip.ipv6,
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
        initial: c.print_date === null ? 'null' : c.print_date 

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

    // port the backend server is running on
    "port" : ${ response.port },

    // paths to the ssl private key and certificate, relative to the project root
    "ssl" : {
        "cert" : ${ response.ssl_cert === 'keys/cert.pem' ? "path.join('keys', 'cert.pem')" : "'"+response.ssl_cert+"'" },
        "key" : ${ response.ssl_key === 'keys/key.pem' ? "path.join('keys', 'key.pem')" : "'"+response.ssl_key+"'" }
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

    
}, 2000);
    


