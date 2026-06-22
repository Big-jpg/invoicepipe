# InvoicePipe – Streamlined Invoice Processing

**InvoicePipe** is a full-stack TypeScript application for automated invoice ingestion, field extraction, and structured data presentation. It combines Azure AI, Next.js, Prisma, PostgreSQL, and modern frontend tooling to deliver a polished document processing experience with tenant-isolated security.

---

## 🚀 Features

* **Drag-and-drop PDF Ingestion** with checksum deduplication.
* **Smart Field Extraction** using Azure Content Understanding.
* **Custom CU Normalization** pipeline for Australian invoices.
* **Typed API Routes** for secure auth, upload, processing.
* **Instant Preview** with embedded PDF and extracted metadata.
* **JSON/CSV Export Ready** for accounting or downstream pipelines.
* **Auth via NextAuth** with Prisma adapter and bcrypt hashing.
* **Responsive UI** with Tailwind CSS and Radix primitives.
* **Dark Mode** with client-side theme persistence.

---

## 📁 Project Structure

```
invoicepipe/
├── app/                # Next.js app router (pages, layout, routes)
│   ├── api/            # API routes (auth, upload, CU, preview)
│   ├── dashboard/      # Authenticated client dashboard views
│   ├── invoice/        # Invoice display routes
│   └── sign-in/        # Auth UI views
├── components/         # Shared UI & feature components
├── db/                 # SQL scripts: tables, views, stored procs
├── lib/                # Auth config, DB client, CU integration, utils
├── prisma/             # Prisma schema
├── public/             # Static assets (e.g., fonts)
├── styles/             # Tailwind/global CSS
├── types/              # Type declarations
└── ...
```

---

## ⚙️ Tech Stack

* **Frontend**: React 19, Next.js 15 (App Router), Tailwind CSS, Framer Motion
* **Backend**: Next.js API routes, PostgreSQL, Prisma ORM
* **Auth**: NextAuth + Prisma adapter
* **AI Integration**: Azure Content Understanding (via REST SDK)
* **PDF Processing**: Native PDF ingestion, estimated page heuristics
* **UI Frameworks**: Radix UI, ShadCN components, Lucide Icons
* **Hosting**: Vercel (with function config via `.vercel.json`)

---

## 🧠 How It Works

1. **Upload PDF**
   Users upload PDF invoices via drag-and-drop. Content is hashed for deduplication.

2. **Content Understanding (CU)**
   Azure Content Understanding processes the PDF. Key fields (e.g., `InvoiceId`, `VendorName`, `AmountDue`, etc.) are extracted and normalized.

3. **Database Insert**
   If critical fields are extracted, metadata is persisted to `invoice_uploads` and `invoices`.

4. **Preview Render**
   Users can view an invoice preview with real-time extracted fields and download-ready formats.

---

## 🔐 Security

* All uploads and extractions are tenant-scoped.
* Passwords are hashed using `bcrypt`.
* `.env` values are excluded via `.gitignore`.
* Frontend and API operate in strict mode (`tsconfig.json`).

---

## 🧪 Local Development

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Prisma (generate + migrate)
npx prisma generate
npx prisma migrate dev
```

Ensure `.env.local` includes the following:

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/invoicepipe
AZURE_DOCUMENT_INTELLIGENCE_KEY=your-api-key
AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT=https://<region>.cognitiveservices.azure.com/
NEXTAUTH_SECRET=your-secret
```

---

## 📄 Schema: Custom Tax Invoice

Defined in `custom-tax-invoice-advanced.json`:

* Includes 14+ normalized fields (e.g., `InvoiceId`, `TotalTax`, `DocumentType`)
* Each field is classified or extracted using CU heuristics
* Used as the canonical normalization layer post-Azure response

---

## 🧰 Scripts

```bash
# Start app in dev mode
npm run dev

# Build for production
npm run build

# Lint codebase
npm run lint
```

---

## 📦 Deployment

* Deployed via **Vercel**
* Configured for serverless functions (`.vercel.json`)
* Long-running operations (CU processing) capped at 5 minutes

---

## 📚 Future Roadmap

* Invoice history & export (CSV/JSON)
* User settings & preferences
* Payment integration for invoice volume tiers
* Real-time feedback on field confidence

---

## ❤️ Credits

Built with:

* Next.js + React
* Azure AI Services
* Prisma & PostgreSQL
* TailwindCSS + ShadCN
* Australian caffeine reserves ☕
