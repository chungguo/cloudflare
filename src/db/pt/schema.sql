DROP TABLE IF EXISTS tb_pt_sites;
CREATE TABLE IF NOT EXISTS tb_pt_sites (host TEXT PRIMARY KEY, path TEXT, cookies TEXT);
INSERT INTO tb_pt_sites (host, path, cookies) VALUES ('hdmayi.com', '/attendance.php', '');
