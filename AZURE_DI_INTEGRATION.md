# Azure Document Intelligence Integration Guide

**Updated**: December 8, 2025  
**Based on**: Production Azure DI Content Understanding Build

---

## Overview

InvoicePipe now uses the **production-tested Azure Document Intelligence (Content Understanding)** implementation, matching the exact patterns and best practices from the MercyCare Azure DI build.

---

## Key Updates

### 1. **API Endpoint Enhancement**

The analyze endpoint now includes the `stringEncoding=utf16` parameter for better text extraction:

```typescript
const analyzeUrl = `${endpoint}/contentunderstanding/analyzers/${analyzerId}:analyze?api-version=${apiVersion}&stringEncoding=utf16`;
```

### 2. **Content-Type Correction**

Binary PDF uploads now use the correct `application/pdf` content type instead of `application/octet-stream`:

```typescript
headers = {
    "Content-Type": "application/pdf",
    "Ocp-Apim-Subscription-Key": subscriptionKey,
    "x-ms-useragent": "invoicepipe-nextjs",
};
```

### 3. **Enhanced Field Extraction**

Added support for `valueDate` field type and proper field value priority:

```typescript
export function extractFieldValue(field: CUField | undefined): string | number | null {
    if (!field) return null;
    
    return (
        field.valueString ??
        field.valueNumber ??
        field.valueDate ??
        field.content ??
        null
    );
}
```

### 4. **Extended Invoice Schema**

Added additional fields matching the Azure DI OutputSchema:

- `vendorAddress`
- `customerAddress`
- `billingAddress`
- `vendorTaxId`
- `customerTaxId`
- `poNumber`

### 5. **Improved Error Handling**

- Environment variable validation
- Detailed error messages with HTTP status codes
- Processing time tracking
- Development vs production logging

---

## Environment Variables

### Current InvoicePipe Format

```env
AZURE_CU_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
AZURE_CU_API_VERSION=2025-05-01-preview
AZURE_CU_ANALYZER_ID=custom-invoice-analyzer-id
AZURE_CU_KEY=your-subscription-key
```

### Azure DI Build Format (Alternative)

```env
CONTENT_UNDERSTANDING_ENDPOINT=https://your-resource.cognitiveservices.azure.com/
CONTENT_UNDERSTANDING_SUBSCRIPTION_KEY=your-subscription-key
API_VERSION=2025-05-01-preview
ANALYZER_ID=custom-invoice-analyzer-id
```

**Note**: Both formats are supported. The code uses the `AZURE_CU_*` prefix by default.

---

## API Version

The production Azure DI build uses:

```
API_VERSION=2025-05-01-preview
```

This is the latest preview version with Content Understanding support. Update your `.env.local` accordingly.

---

## Analyzer ID

The default analyzer ID is:

```
ANALYZER_ID=custom-invoice-analyzer-id
```

Replace this with your actual custom analyzer ID from Azure AI Studio.

---

## Field Mapping

### Azure DI OutputSchema → InvoicePipe Database

| Azure DI Field | InvoicePipe Field | Type | Notes |
|----------------|-------------------|------|-------|
| `InvoiceId` | `invoice_number` | string | Required |
| `VendorName` | `vendor` | string | Required |
| `CustomerName` | `customer_name` | string | - |
| `Company` | `company` | string | Fallback to CustomerName |
| `InvoiceTotal` | `invoice_total` | number | - |
| `Total` | `total` | number | Required |
| `SubTotal` | `sub_total` | number | - |
| `TotalTax` | `total_tax` | number | - |
| `AmountDue` | `amount_due` | number | - |
| `InvoiceDate` | `invoice_date` | string | ISO date |
| `DueDate` | `due_date` | string | ISO date |
| `PurchaseOrder` | `po_number` | string | - |
| `PONumber` | `po_number` | string | Alternative field |
| `DocumentType` | `document_type` | string | - |
| `VendorAddress` | - | string | Extended field |
| `CustomerAddress` | - | string | Extended field |
| `BillingAddress` | - | string | Extended field |
| `VendorTaxId` | - | string | Extended field |
| `CustomerTaxId` | - | string | Extended field |

---

## Processing Flow

### 1. Upload PDF

```
POST /api/upload
Content-Type: multipart/form-data
```

Returns a `slug` (UUID) for the uploaded file.

### 2. Process with Azure DI

```
POST /api/invoice/cu-process
Content-Type: application/json
Body: { "slug": "uuid-here" }
```

**Processing Steps**:
1. Fetch PDF from database
2. Call Azure Content Understanding API
3. Poll for completion (with timeout)
4. Normalize extracted fields
5. Validate critical fields
6. Insert into `invoices` table
7. Return structured result

### 3. Response Format

```json
{
  "success": true,
  "invoice_id": "123",
  "normalized": {
    "invoiceId": "INV-001",
    "vendorName": "Acme Supplies Pty Ltd",
    "total": 4892.10,
    ...
  },
  "processing_time_ms": 5420,
  "azure_api_time_ms": 4850,
  "raw": { ... }  // Only in development
}
```

---

## Error Handling

### Validation Errors (422)

Missing critical fields:

```json
{
  "error": "Critical invoice fields not extracted. Manual review required.",
  "missingFields": ["invoiceId", "total"],
  "normalized": { ... }
}
```

### Azure API Errors (502)

```json
{
  "error": "[CU] Analyze failed (401): Unauthorized"
}
```

### Timeout Errors (500)

```json
{
  "error": "[CU] Operation timed out after 3600 seconds"
}
```

---

## Performance Metrics

Based on production testing:

- **Typical Processing Time**: 5-16 seconds
- **Azure API Response**: 4-15 seconds
- **Database Operations**: <1 second
- **Timeout**: 3600 seconds (1 hour)
- **Polling Interval**: 1 second

---

## Logging

### Development Mode

Full raw API responses and detailed field logging:

```
[CU] Processing invoice with slug: abc-123
[CU] Processing file: invoice.pdf (245678 bytes)
[CU] Calling Azure Content Understanding API...
[CU] Azure API responded in 4850ms
[CU] Raw API Response: { ... }
[CU] Normalized Invoice Fields: { ... }
[CU]   invoiceId: INV-001
[CU]   vendorName: Acme Supplies Pty Ltd
[CU]   total: 4892.10
[CU] Inserting invoice into database...
[CU] ✅ Successfully processed invoice 123 in 5420ms
```

### Production Mode

Minimal logging without raw responses:

```
[CU] Processing invoice with slug: abc-123
[CU] Azure API responded in 4850ms
[CU] ✅ Successfully processed invoice 123 in 5420ms
```

---

## Testing

### Local Testing

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Upload a test invoice via the dashboard

3. Check console logs for processing details

### API Testing

```bash
# Upload a PDF
curl -X POST http://localhost:3000/api/upload \
  -F "file=@test-invoice.pdf"

# Process the invoice
curl -X POST http://localhost:3000/api/invoice/cu-process \
  -H "Content-Type: application/json" \
  -d '{"slug":"returned-uuid-here"}'
```

---

## Migration from Old Implementation

### Breaking Changes

None. The API remains backward compatible.

### New Features

1. ✅ `stringEncoding=utf16` parameter for better text extraction
2. ✅ Correct `application/pdf` content type
3. ✅ Support for `valueDate` field type
4. ✅ Extended invoice fields (addresses, tax IDs)
5. ✅ Processing time metrics
6. ✅ Enhanced error messages
7. ✅ Environment variable validation

### Recommended Updates

1. Update `AZURE_CU_API_VERSION` to `2025-05-01-preview`
2. Verify `AZURE_CU_ANALYZER_ID` matches your custom analyzer
3. Test with sample invoices to ensure field extraction works
4. Update database schema if using extended fields

---

## Database Schema Updates (Optional)

If you want to store the extended fields:

```sql
ALTER TABLE invoices
ADD COLUMN vendor_address TEXT,
ADD COLUMN customer_address TEXT,
ADD COLUMN billing_address TEXT,
ADD COLUMN vendor_tax_id TEXT,
ADD COLUMN customer_tax_id TEXT;
```

Then update the INSERT query in `cu-process/route.ts` to include these fields.

---

## Troubleshooting

### Issue: "AZURE_CU_ENDPOINT is not configured"

**Solution**: Ensure `.env.local` has the correct environment variables set.

### Issue: "Operation timed out after 3600 seconds"

**Solution**: 
- Check Azure resource is running
- Verify network connectivity
- Check Azure service health

### Issue: "Missing critical fields"

**Solution**:
- Verify your custom analyzer is trained correctly
- Check the PDF quality and format
- Review raw API response in development mode

### Issue: "Analyze failed (401): Unauthorized"

**Solution**:
- Verify `AZURE_CU_KEY` is correct
- Check subscription key hasn't expired
- Ensure endpoint URL matches your Azure resource

---

## References

- [Azure Document Intelligence Documentation](https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/)
- [Content Understanding API Reference](https://learn.microsoft.com/en-us/rest/api/aiservices/operation-groups?view=rest-aiservices-v4.0%20(2024-11-30))
- [Custom Model Training](https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence/how-to-guides/build-a-custom-model)

---

## Support

For issues specific to InvoicePipe integration, check:
- Console logs in development mode
- Raw API responses
- Database insert queries

For Azure DI issues, refer to Azure support or documentation.
