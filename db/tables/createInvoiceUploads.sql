CREATE TABLE IF NOT EXISTS invoice_uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_filename TEXT NOT NULL,
    content BYTEA NOT NULL,
    filesize INTEGER,
    uploaded_at TIMESTAMPTZ DEFAULT now(),
    sha256 TEXT UNIQUE,
    estimated_page_count INTEGER
);

-- Unique index for sha256
CREATE UNIQUE INDEX IF NOT EXISTS invoice_uploads_sha256_key ON invoice_uploads (sha256);
