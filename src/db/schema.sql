DROP TABLE IF EXISTS tb_sites;
CREATE TABLE IF NOT EXISTS tb_sites (host TEXT PRIMARY KEY, path TEXT, cookies TEXT);
INSERT INTO tb_sites (host, path, cookies) VALUES ('hdmayi.com', '/attendance.php', '');
