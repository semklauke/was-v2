--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------
CREATE TABLE walker (
    rec_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    class VARCHAR NOT NULL,
    lastname VARCHAR,
    firstname VARCHAR,
    distance_m INTEGER NOT NULL
);

CREATE TABLE donations (
    rec_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    walker_id INTEGER NOT NULL,
    donation_each_km REAL NOT NULL,
    --gesamtspende REAL DEFAULT NULL,
    donation_amout_recived REAL DEFAULT NULL,
    needs_donation_receipt INTEGER NOT NULL DEFAULT 0,
    donation_recived INTEGER NOT NULL DEFAULT 0,
    zipcode INTEGER DEFAULT 59494,
    city VARCHAR DEFAULT 'Soest',
    adress VARCHAR,
    firstname VARCHAR,
    lastname VARCHAR,
    --spender_nr INTEGER NOT NULL,
    FOREIGN KEY(walker_id) REFERENCES walker(rec_id)
);

CREATE TABLE token (
    rec_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    login_token VARCHAR NOT NULL,
    stamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ttest (
    rec_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    test VARCHAR
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------
DROP TABLE IF EXISTS walker;
DROP TABLE IF EXISTS donations; 
DROP TABLE IF EXISTS token; 
DROP TABLE IF EXISTS ttest;
DROP TABLE IF EXISTS `rollback`;
DROP TABLE IF EXISTS log;
