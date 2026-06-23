# InvoicePipe Extraction Schema Mapping

Version: Stable (June 2025)


## 🧩 Schema Source of Truth

Primary schema file:  
`custom-invoice-analyzer-id_schema.json`

This schema maps directly into the API `OutputSchema` model.

## 🔍 Field Mappings

| Field | Type | Extraction Type | Description |
| ----- | ---- | --------------- | ----------- |
| `AmountDue` | number | extract | Total amount due |
| `BillingAddress` | string | extract | Customer billing address |
| `CustomerAddress` | string | extract | Customer mailing address |
| `CustomerTaxId` | string | extract | Customer government ID |
| `DueDate` | date | extract | Invoice due date |
| `InvoiceDate` | date | extract | Invoice issue date |
| `InvoiceId` | string | extract | Invoice number |
| `InvoiceTotal` | number | extract | Invoice total amount |
| `PurchaseOrder` | string | extract | Purchase Order ref |
| `SubTotal` | number | extract | Subtotal |
| `TotalTax` | number | extract | Total tax amount |
| `VendorAddress` | string | extract | Vendor address |
| `VendorName` | string | extract | Vendor legal name |
| `VendorTaxId` | string | extract | Vendor government ID |
| `DocumentType` | string | classify | TaxInvoice or Other |
| `PONumber` | string | extract | Special PO logic |
| `CustomerNameClassify` | string | classify | Customer classification (MHS, MCS, MCL) |
| `VendorNameClassify` | string | classify | Vendor classification |


## 🔎 Enum Classifications

### CustomerNameClassify Enum

| Value | Description |
| ----- | ----------- |
| `MHS` | Contoso Human Services |
| `MCS` | Contoso Community Services |
| `MCL` | Contoso Limited |

### VendorNameClassify Enum

| Value |
| ----- |
| Bunzl |
| Bidfood |
| Nisbets |
| Seton |
| JBHifi |
| OfficeWorks |
| Marbret |
| Brownes |
| Unicare |
| HWLEbsworthLawyers |
| HarveyNorman |
| Activ |


## 🔄 Schema Change Process

- Modify `custom-invoice-analyzer-id_schema.json` to retrain model.

- Reflect field additions/removals in `models.py`.

- Regenerate `OutputSchema` as required.

- Rebuild & redeploy container app (`deploy.sh`).


## 🔧 Schema Validation Enforced By

- Azure CU Analyzer during training.

- FastAPI / Pydantic model validation during API execution.