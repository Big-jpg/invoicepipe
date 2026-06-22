# Test Fixtures

This directory contains test fixtures for automated API contract validation.

## Structure

- **PDF Files**: Sample invoice PDFs for testing
- **Expected JSON Files**: Expected normalized JSON outputs for each invoice (`.expected.json`)

## Adding New Fixtures

1. Add a sample PDF invoice to this directory (e.g., `sample_invoice_01.pdf`)
2. Create a corresponding expected output file (e.g., `sample_invoice_01.expected.json`)
3. The expected JSON should match the structure returned by `/process-invoice/` endpoint

## Expected JSON Format

```json
{
  "InvoiceId": "INV-12345",
  "InvoiceDate": "2024-01-15",
  "VendorName": "Vendor Name",
  "CustomerName": "CCS",
  "InvoiceTotal": 1234.56,
  "AmountDue": 1234.56,
  "DueDate": "2024-02-15",
  "SubTotal": 1122.33,
  "TotalTax": 112.23,
  "VendorTaxId": "12345678901",
  "CustomerTaxId": "98765432109",
  "PONumber": "1234",
  "PurchaseOrder": "PO-1234",
  "BillingAddress": "123 Main St",
  "CustomerAddress": "456 Oak Ave",
  "CustomerId": "CUST-001",
  "DocumentType": "TaxInvoice",
  "VendorNameClassify": "Bunzl",
  "CustomerNameClassify": "CCS"
}
```

## Notes

- Binary PDF files should not be committed to Git if they are large (>1MB)
- Consider using external storage (Azure Blob, S3) for large test files
- Document the external storage location in this README if used
- For now, placeholder PDFs or small sample PDFs can be included

## External Storage

If test PDFs are stored externally:
- **Location**: [To be specified]
- **Access**: [To be specified]
- **Download script**: [To be created if needed]
