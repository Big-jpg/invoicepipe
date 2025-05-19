User
 |
 | 1. Drag & Drop PDF
 v
[FileUploader Component]
 |
 | 2. POST /api/upload (multipart/form-data)
 v
[API: /api/upload]
 |-- Stores PDF binary in DB (invoice_uploads) with UUID (data.id)
 |-- Returns { id: UUID }
 |
 v
[FileUploader]
 |-- Calls onUploaded(UUID)
 |
 v
[Home Page (page.tsx)]
 |-- Stores slug = UUID
 |-- "Extract Invoice Details" button enabled
 |
 | 3. Click "Extract Invoice Details"
 v
[Home Page (handleSummarize)]
 |
 |-- Calls:
 |     POST /api/scrape    (body: { slug })
 |     v
 |  [API: /api/scrape]
 |    |-- (MVP: Returns mock extracted invoice content)
 |    |-- (Future: Looks up PDF by slug, passes to Azure Doc Intelligence)
 |    |
 |    v
 |  { content: "Simulated Invoice Data..." }
 |
 |-- Shows summary in UI
 |-- Status: "Storing structured metadata into the database..."
 |
 |-- Calls:
 |     POST /api/invoice/process (body: { slug })
 |     v
 |  [API: /api/invoice/process]
 |    |-- (MVP: Will run Azure Doc Intelligence, store metadata to DB)
 |    |-- (Currently: Could be a placeholder or partial implementation)
 |    |
 |    v
 |  { ... } or error
 |
 |-- On success: router.push(`/invoice/card/${slug}`)
 v
[Invoice Card Page (/invoice/card/[slug])]
 |
 |-- GETs PDF binary and metadata from DB (via SSR)
 |-- Renders PDF preview & structured data
