-- Up
CREATE TABLE IF NOT EXISTS postprocessing (
    rec_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    resource VARCHAR NOT NULL,
    login_id INTEGER NOT NULL,
    uuid VARCHAR NOT NULL,
    stamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    used TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY(login_id) REFERENCES logins(rec_id) 
);

CREATE VIEW post AS
SELECT
    p.rec_id as rec_id,
    p.resource as resource,
    p.stamp as stamp,
    p.used as used,
    p.uuid as uuid,
    l.uuid as login_uuid,
    l.name as name
FROM postprocessing AS p
LEFT JOIN logins AS l
ON p.login_id = l.rec_id
ORDER BY p.stamp DESC;

-- Down
DROP VIEW IF EXISTS post;
DROP TABLE IF EXISTS postprocessing;