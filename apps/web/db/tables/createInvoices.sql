CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    filename TEXT NOT NULL,
    vendor TEXT,
    company TEXT,
    invoice_number TEXT,
    po_number TEXT,
    invoice_date DATE,
    due_date DATE,
    amount_due NUMERIC(12, 2),
    total NUMERIC(12, 2),
    document_type TEXT,
    customer_name TEXT,
    invoice_total NUMERIC(12, 2),
    sub_total NUMERIC(12, 2),
    total_tax NUMERIC(12, 2),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes are created automatically for primary keys, but to match your UI:
CREATE UNIQUE INDEX IF NOT EXISTS invoices_pkey ON invoices (id);
