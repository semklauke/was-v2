-- Up
CREATE TABLE IF NOT EXISTS log (
    rec_id INTEGER PRIMARY KEY, 
    timestamp INTEGER DEFAULT (strftime('%s','now')),
    level TEXT,
    message TEXT
);

CREATE TABLE IF NOT EXISTS rbs (
    rec_id INTEGER PRIMARY KEY,
    timestamp INTEGER DEFAULT (strftime('%s','now')),
    type TEXT,
    message TEXT, 
    user TEXT, 
    rb TEXT, 
    error TEXT
);

-- Down
DROP TABLE IF EXISTS log;
DROP TABLE IF EXISTS rbs;