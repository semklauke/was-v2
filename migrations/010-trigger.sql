-- Up
CREATE TRIGGER IF NOT EXISTS trigger_update_donation_received
    AFTER UPDATE OF donation_amount_received ON donations
    FOR EACH ROW 
    WHEN OLD.donation_amount_received != NEW.donation_amount_received  
    BEGIN
        UPDATE donations 
        SET donation_received = (
            SELECT CASE 
                WHEN NEW.donation_amount_received > 0.0
                THEN 1
                ELSE 1
            END
        )
        WHERE rec_id = NEW.rec_id;
    END;

CREATE TRIGGER IF NOT EXISTS trigger_insert_donation_received
    AFTER INSERT ON donations
    FOR EACH ROW
    BEGIN
        UPDATE donations 
        SET donation_received = (
            SELECT CASE 
                WHEN NEW.donation_amount_received > 0.0
                THEN 1
                ELSE 1
            END
        )
        WHERE rec_id = NEW.rec_id;
    END;

-- Down
DROP TRIGGER IF EXISTS trigger_update_donation_received;
DROP TRIGGER IF EXISTS trigger_insert_donation_received;