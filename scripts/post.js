const path = require('path');
//const htmltopdf = require('html5-to-pdf');
const puppeteer = require('puppeteer');
const fs = require('fs');
const ejs = require('ejs');

const sqlite = require('better-sqlite3');
const DB = require('better-sqlite3-helper');

let data = {
    className: "7B",
    walker: [],
    sum: 0,
    pdf: true
};


let getNameFunction = function() {
    return this.firstname + " " + this.lastname;
}
function round(x) {
    return Math.round((x + Number.EPSILON) * 100) / 100;
}

const sql_walker_for_class = `
    SELECT * FROM walkers WHERE class LIKE ? ORDER BY lastname, firstname
`;

const sql_donation_for_walker = `
    SELECT * FROM donations WHERE walker_id = ?
`;


DB({
    path: path.join(__dirname, "..", "laeufer.db"),
    readonly: true,
    migrate: false
});
DB().defaultSafeIntegers(false);   


let walkerStmt = DB().prepare(sql_walker_for_class);
let donationStmt = DB().prepare(sql_donation_for_walker);
for (let w of walkerStmt.iterate("%"+"7B")) {
    let tmpw = w;
    let wr = {
        sum: 0,
        donations: [],
        rec_id: tmpw.rec_id,
        class: tmpw.class,
        distance_m: tmpw.distance_m,
        lastname: tmpw.lastname,
        firstname: tmpw.firstname,
        participates: tmpw.participates,
        getName: getNameFunction
    };

    let wd = donationStmt.all(tmpw.rec_id);
    for (let d of wd) {
        let sum = round((tmpw.distance_m/1000) * d.donation_each_km);
        wr.sum += sum;
        wr.donations.push({
            rec_id: d.rec_id,
            donation_each_km: d.donation_each_km,
            firstname: d.firstname,
            lastname: d.lastname,
            sum,
            getName: getNameFunction
        });
    }
    data.sum += wr.sum;
    data.walker.push(wr);
}




ejs.renderFile(path.join(__dirname, "..", "views", "class.ejs"), data, {}, function(err, str){
    if (err) {
        console.log(err);
    }
    (async () => {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(str, { waitUntil: "networkidle0"} );
        await page.addStyleTag({
            path: path.join(__dirname, "..", "static", "lib", "bootstrap", "css", "bootstrap.min.css")
        });
        await page.addStyleTag({
            path: path.join(__dirname, "..", "static", "css", "class.css")
        });
        await page.emulateMediaType('screen');
        console.log(await page.content());
        await page.pdf({
            path: 'test.pdf', 
            format: 'A4',
            margin: {
                top: '20px',
                bottom: '15px',
                left: '25px',
                right: '25px'
            }
        });    
        await browser.close();
    })();

});





    // const run = async () => {
    //     const html5ToPDF = new htmltopdf({
    //         inputBody: str,
    //         outputPath: path.join(__dirname, "..", "tmp", "7B.pdf"),
    //         template: "htmlbootstrap",
    //         include: [
    //             //path.join(__dirname, "..", "static", "lib", "bootstrap", "css", "bootstrap.min.css"),
    //             path.join(__dirname, "..", "static", "css", "class.css")
    //         ]
    //     });

    //     await html5ToPDF.start();
    //     await html5ToPDF.build();
    //     await html5ToPDF.close();
    // };


    // (async () => {
    //     console.log("test");  
    //     try {
    //         await run();
    //         console.log("done");  
    //     } catch (e) {
    //         console.error(e);
    //     } finally {
    //         process.exit(0);
    //     }
    // })();