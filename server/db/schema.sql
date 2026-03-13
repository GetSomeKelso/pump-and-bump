CREATE TABLE IF NOT EXISTS users (
  id              SERIAL PRIMARY KEY,
  email           VARCHAR(255) UNIQUE NOT NULL,
  password_hash   VARCHAR(255) NOT NULL,
  verified        BOOLEAN DEFAULT FALSE,
  verify_token    VARCHAR(64),
  verify_expires  TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
  user_id       INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  lmp_date      DATE,
  cycle_length  INTEGER CHECK (cycle_length BETWEEN 20 AND 45) DEFAULT 28,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS daily_logs (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date_key      DATE NOT NULL,
  logged        INTEGER NOT NULL DEFAULT 0 CHECK (logged >= 0),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date_key)
);

CREATE INDEX IF NOT EXISTS idx_daily_logs_user_date ON daily_logs(user_id, date_key);
