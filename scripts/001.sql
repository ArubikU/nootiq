ALTER TABLE promo_codes ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'general';

CREATE INDEX IF NOT EXISTS idx_promo_codes_type ON promo_codes(type);

CREATE TABLE IF NOT EXISTS promo_claims (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    promo_code_id VARCHAR(255) NOT NULL,
    promo_type VARCHAR(50) NOT NULL,
    claimed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (promo_code_id) REFERENCES promo_codes(id) ON DELETE CASCADE,
    UNIQUE(user_id, promo_type) 
);

CREATE TABLE IF NOT EXISTS referral_codes (
    id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    code VARCHAR(255) UNIQUE NOT NULL,
    uses_left INT NOT NULL DEFAULT 10,
    total_uses INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_referral_codes_user ON referral_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON referral_codes(code);

CREATE TABLE IF NOT EXISTS referral_claims (
    id VARCHAR(255) PRIMARY KEY,
    referral_code_id VARCHAR(255) NOT NULL,
    referred_user_id VARCHAR(255) NOT NULL,
    referrer_user_id VARCHAR(255) NOT NULL,
    claimed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    reward_duration INT NOT NULL DEFAULT 1, 
    FOREIGN KEY (referral_code_id) REFERENCES referral_codes(id) ON DELETE CASCADE,
    FOREIGN KEY (referred_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (referrer_user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(referred_user_id, referrer_user_id) 
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS referred_by VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code_used VARCHAR(255);

UPDATE promo_codes SET type = 'general' WHERE type IS NULL;


CREATE OR REPLACE FUNCTION generate_referral_code() RETURNS VARCHAR(255) AS $$
DECLARE
    new_code VARCHAR(255);
BEGIN
    LOOP
        new_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
        EXIT WHEN NOT EXISTS (SELECT 1 FROM referral_codes WHERE code = new_code);
    END LOOP;
    RETURN new_code;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE promo_claims IS 'Tracks which users have claimed which types of promo codes to prevent multiple claims of same type';
COMMENT ON TABLE referral_codes IS 'User-generated referral codes for inviting other users';
COMMENT ON TABLE referral_claims IS 'Tracks successful referral claims and rewards';
COMMENT ON COLUMN promo_codes.type IS 'Type of promo code: general, new_user, referral, etc.';
