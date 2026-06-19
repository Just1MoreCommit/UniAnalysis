const { db } = require('./db');

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS universities (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      name           TEXT NOT NULL,
      abbreviation   TEXT NOT NULL,
      website_url    TEXT,
      admissions_url TEXT,
      logo_url       TEXT,
      scrape_url     TEXT,
      is_active      INTEGER DEFAULT 1,
      created_at     TEXT DEFAULT (datetime('now')),
      updated_at     TEXT DEFAULT (datetime('now'))
    );

    CREATE UNIQUE INDEX IF NOT EXISTS idx_universities_abbreviation ON universities(abbreviation);

    CREATE TABLE IF NOT EXISTS news (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      university_id   INTEGER NOT NULL,
      title           TEXT NOT NULL,
      description     TEXT,
      source_url      TEXT NOT NULL,
      category        TEXT DEFAULT 'general',
      published_at    TEXT,
      scraped_at      TEXT DEFAULT (datetime('now')),
      content_hash    TEXT UNIQUE,
      FOREIGN KEY (university_id) REFERENCES universities(id)
    );

    CREATE VIRTUAL TABLE IF NOT EXISTS news_fts USING fts5(
      title,
      description,
      content='news',
      content_rowid='id'
    );

    CREATE TABLE IF NOT EXISTS platforms (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      name          TEXT NOT NULL,
      website_url   TEXT NOT NULL,
      logo_url      TEXT,
      tagline       TEXT,
      courses       TEXT,
      pricing       TEXT,
      last_scraped  TEXT,
      created_at    TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS scrape_logs (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      university_id  INTEGER,
      platform_id    INTEGER,
      status         TEXT NOT NULL,
      items_found    INTEGER DEFAULT 0,
      error_message  TEXT,
      started_at     TEXT DEFAULT (datetime('now')),
      finished_at    TEXT
    );

    -- FTS5 sync triggers
    CREATE TRIGGER IF NOT EXISTS news_fts_insert
    AFTER INSERT ON news BEGIN
      INSERT INTO news_fts(rowid, title, description)
      VALUES (new.id, new.title, new.description);
    END;

    CREATE TRIGGER IF NOT EXISTS news_fts_update
    AFTER UPDATE ON news BEGIN
      INSERT INTO news_fts(news_fts, rowid, title, description)
      VALUES ('delete', old.id, old.title, old.description);
      INSERT INTO news_fts(rowid, title, description)
      VALUES (new.id, new.title, new.description);
    END;

    CREATE TRIGGER IF NOT EXISTS news_fts_delete
    AFTER DELETE ON news BEGIN
      INSERT INTO news_fts(news_fts, rowid, title, description)
      VALUES ('delete', old.id, old.title, old.description);
    END;
  `);
}

module.exports = { initSchema };
