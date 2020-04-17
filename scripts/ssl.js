let forge = require('node-forge');
forge.options.usePureJavaScript = true;
let pki = forge.pki;

const fs = require('fs');
const path = require('path');

let mkdirp = require('mkdirp');

let attrs = [
     {name:'commonName',value:'localhost'}
    ,{name:'countryName',value:'DE'}
    ,{shortName:'ST',value:'NRW'}
    ,{name:'localityName',value:'Soest'}
    ,{name:'organizationName',value:'Archi'}
    ,{shortName:'OU',value:'Test'}
];

console.log("Generating 2048 bit RSA keys for HTTPS");
console.log("This can take a few secounds ... ");
console.log("");
pki.rsa.generateKeyPair({bits: 2048, workers: 2}, function(err, keys) {
    let cert = pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.serialNumber = '01';
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear()+1);
    cert.setSubject(attrs);
    cert.setIssuer(attrs);
    cert.sign(keys.privateKey);

    let pem_privkey = pki.privateKeyToPem(keys.privateKey);
    let pem_cert = pki.certificateToPem(cert);

    mkdirp(path.join(__dirname, "..", "keys")).then(() => { 
        fs.writeFile(path.join(__dirname, "..", "keys", "key.pem"), pem_privkey, function(errr) {
            if (errr) {
                console.error(errr);
            } 
        });
        fs.writeFile(path.join(__dirname, "..", "keys", "cert.pem"), pem_cert, function(errr) {
            if (errr) {
                console.error(errr);
            } else {
                console.log("Done.");
                console.log("You can find the private key and the certificate in the keys/ folder in the root folder of the projects. This is the default location");
            }
        });

    }).catch((err) => {
        console.error(err);
    });

});