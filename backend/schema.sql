CREATE TABLE users (
  id TEXT PRIMARY KEY,
  discord_name TEXT,
  role TEXT DEFAULT 'spiller',
  permissions JSONB DEFAULT '{}',
  first_login TIMESTAMPTZ,
  last_login TIMESTAMPTZ,
  ip TEXT
);

CREATE TABLE bans (
  id SERIAL PRIMARY KEY,
  user_id TEXT,
  reason TEXT,
  banned_by TEXT,
  banned_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  active BOOLEAN DEFAULT TRUE
);

CREATE TABLE ban_appeals (
  id SERIAL PRIMARY KEY,
  ban_id INTEGER,
  user_id TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending',
  admin_note TEXT,
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE staff_notes (
  id SERIAL PRIMARY KEY,
  user_id TEXT,
  note TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE logs (
  id SERIAL PRIMARY KEY,
  actor TEXT,
  action TEXT,
  target TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
