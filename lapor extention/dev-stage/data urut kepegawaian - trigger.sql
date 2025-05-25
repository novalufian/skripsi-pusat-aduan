-- Trigger untuk INSERT
DELIMITER $$
CREATE TRIGGER after_pegawai_insert
AFTER INSERT ON Pegawai
FOR EACH ROW
BEGIN
    INSERT INTO AuditLog (user_id, action, table_name, record_id, details)
    VALUES (NEW.created_by, 'INSERT', 'Pegawai', NEW.id_pegawai, CONCAT('New record created: ', NEW.nama));
END$$
DELIMITER ;

-- Trigger untuk UPDATE
DELIMITER $$
CREATE TRIGGER after_pegawai_update
AFTER UPDATE ON Pegawai
FOR EACH ROW
BEGIN
    INSERT INTO AuditLog (user_id, action, table_name, record_id, details)
    VALUES (NEW.updated_by, 'UPDATE', 'Pegawai', NEW.id_pegawai, CONCAT('Record updated: ', OLD.nama, ' -> ', NEW.nama));
END$$
DELIMITER ;

-- Trigger untuk DELETE (Soft Delete)
DELIMITER $$
CREATE TRIGGER after_pegawai_delete
AFTER UPDATE ON Pegawai
FOR EACH ROW
BEGIN
    IF NEW.is_deleted = TRUE THEN
        INSERT INTO AuditLog (user_id, action, table_name, record_id, details)
        VALUES (NEW.updated_by, 'SOFT_DELETE', 'Pegawai', NEW.id_pegawai, CONCAT('Record soft deleted: ', OLD.nama));
    END IF;
END$$
DELIMITER ;