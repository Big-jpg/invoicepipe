# MercyCare Automated Invoice Processing

## Overview

This system enables automated extraction and structuring of metadata from uploaded PDF invoices using Azure Document Intelligence (Content Understanding) and displays them through a custom-built, fullstack Next.js application deployed on Vercel.

---

## 🏗 Architecture Summary

### Frontend

* **Framework**: Next.js (v15)
* **Deployment**: Vercel
* **Theme**: Dynamic light/dark mode with user preferences
* **Branding**: Custom MercyCare styling (logo, pill badges, gradient CTA buttons)
* **User Flow**:

  1. User uploads a PDF invoice (drag & drop or file picker)
  2. Invoice is stored in Neon Postgres (blob + metadata)
  3. Extraction is triggered via CU endpoint (`/api/invoice/cu-process`)
  4. Extracted fields are normalized and inserted into the `invoices` table
  5. User is redirected to a `/invoice/card/[slug]` page showing parsed fields and PDF preview

### Backend

* **Storage**: Neon Postgres (binary blob, original filename, extracted fields)
* **Extraction API**: Azure Document Intelligence (Content Understanding)

  * Model ID: `custom-tax-invoice`
  * API Version: `2024-12-01-preview`
* **Normalization**: Handles field discovery from multiple CU result paths
* **Routes**:

  * `/api/upload`: Handles file upload and inserts into DB
  * `/api/invoice/cu-process`: Extracts invoice fields and stores structured metadata

### CU Response Normalization

* Supports CU response structures from:

  * `result.documents[0].fields`
  * `documents[0].fields`
  * `result.contents[0].fields`
  * `contents[0].fields`
  * `fields`
* Types parsed:

  * `valueString`
  * `content`
  * `valueNumber`

---

## 🧾 Extracted Invoice Fields

| Field           | Type               |
| --------------- | ------------------ |
| `invoiceId`     | `string`           |
| `purchaseOrder` | `string`           |
| `amountDue`     | `number or string` |
| `vendorName`    | `string`           |
| `company`       | `string`           |
| `total`         | `number or string` |
| `documentType`  | `string`           |

---

## 💾 Data Storage

```sql
CREATE TABLE invoice_uploads (
  id UUID PRIMARY KEY,
  content BYTEA,
  original_filename TEXT,
  uploaded_at TIMESTAMP DEFAULT now()
);

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT,
  vendor TEXT,
  company TEXT,
  invoice_number TEXT,
  po_number TEXT,
  amount_due NUMERIC,
  total NUMERIC,
  document_type TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

---

## 🚀 Deployment Notes

* Vercel build hooks and cache restore are optimized
* Next.js `build` step strictly enforces ESLint rules (no `any`) and passes CU type checks
* PDF viewer is embedded using `<iframe>` with seamless styling
* Definition of content extraction is driven by the custom-tax-invoice.json at the root of the project

---

## 🔐 Auth (Planned)

* Local Postgres `users` table
* Slug-based access controls for invoice pages
* Session-aware metadata audit and rerun button for corrections

---

## 🎯 Future Enhancements

* Admin override for bad CU outputs
* CSV export of invoice data
* Dashboard insights (volume, vendor match, confidence decay)
* ARM system integration (post-CU sync)
* Vendor ABN verification via fuzzy match

---

## 💡 Motivation

Built as a highly scalable, model-agnostic AP automation MVP to demo the value of Azure AI + Vercel/Next.js orchestration. Easily extendable to include custom business logic, user management, and exception workflows.

---

**Maintained by**: Ross Farrell (Sole Trader)
**Client**: MercyCare (WA, Australia)
**Primary API**: Azure Document Intelligence Content Understanding

---

“Let machines handle paperwork. Let people handle people.”
