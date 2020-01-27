-- Up

CREATE TABLE walkers (
    rec_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    class VARCHAR NOT NULL,
    lastname VARCHAR NOT NULL,
    firstname VARCHAR NOT NULL,
    participates INTEGER NOT NULL DEFAULT 0,
    distance_m INTEGER NOT NULL DEFAULT 0,
    course VARCHAR NULL DEFAULT NULL,
    CHECK (participates IN (0,2))
);

CREATE TABLE donations (
    rec_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    walker_id INTEGER NOT NULL,
    donation_each_km REAL NOT NULL,
    --gesamtspende REAL DEFAULT NULL,
    donation_amout_recived REAL NOT NULL DEFAULT 0,
    needs_donation_receipt INTEGER NOT NULL DEFAULT 0,
    donation_recived INTEGER NOT NULL DEFAULT 0,
    zipcode INTEGER DEFAULT 59494,
    city VARCHAR DEFAULT 'Soest',
    address VARCHAR,
    firstname VARCHAR NOT NULL,
    lastname VARCHAR NOT NULL,
    --spender_nr INTEGER NOT NULL,
    CHECK (needs_donation_receipt IN (0,1)),
    CHECK (donation_recived IN (0,1)),
    FOREIGN KEY(walker_id) REFERENCES walkers(rec_id)
);

CREATE TABLE logins (
    rec_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    uuid VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    stamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- Down
DROP TABLE IF EXISTS walkers;
DROP TABLE IF EXISTS donations; 
DROP TABLE IF EXISTS logins; 
DROP TABLE IF EXISTS ttest;