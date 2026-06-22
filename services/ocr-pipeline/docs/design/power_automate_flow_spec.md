# Power Automate Invoice Processing Flow - Specification

## Overview

This document describes the Power Automate flow for automated invoice processing. It serves as a machine-readable specification that can be used to recreate or validate the flow.

## Trigger

**Type**: When a new email arrives in a shared mailbox (V2)

**Configuration**:
- **Mailbox Address**: `REDACTED@contoso.com.au`
- **Folder**: Inbox (ID: `REDACTED`)
- **Importance**: Any
- **Has Attachments**: Yes (required)
- **Include Attachments**: Yes
- **Recurrence**: Every 1 minute
- **Split On**: Each email triggers a separate flow instance

## Variables

### VendorTable
**Type**: Array

**Purpose**: Maps vendor names and customer company codes to Epicor Vendor IDs

**Structure**:
```json
{
  "CompanyCode": "MHS|MCS|MCL",
  "VendorId": "string",
  "VendorName": "string"
}
```

**Data**: See `power_automate_invoice_processing.md` for full vendor table

## Actions

### 1. Email Processing
- **Extract attachments** from incoming email
- **Filter** for PDF attachments only
- **Save** PDF files to temporary storage or process directly

### 2. File Naming & Storage
- **Generate filename** based on:
  - Original filename
  - Email received date/time
  - Sender information (optional)
- **Save to SharePoint** document library:
  - Library: [To be specified]
  - Folder structure: [To be specified]

### 3. Content Understanding API Call
- **Endpoint**: Azure Container App or APIM gateway
- **Method**: POST
- **Endpoint Path**: `/process-invoice/`
- **Request Body**:
  ```json
  {
    "filename": "string",
    "file_content": "base64_encoded_pdf"
  }
  ```
- **Response**: Normalized invoice JSON (see schema below)

### 4. Vendor ID Lookup
- **Input**: 
  - `VendorNameClassify` from CU response
  - `CustomerNameClassify` from CU response
- **Process**: 
  - Filter VendorTable array
  - Match on VendorName AND CompanyCode
- **Output**: Epicor VendorId

### 5. Data Transformation
- **Map** CU response fields to SharePoint/Excel schema
- **Add** computed fields:
  - Epicor Vendor ID (from lookup)
  - Processing timestamp
  - Email metadata (sender, subject, received date)
  - File storage location

### 6. Output to SharePoint/Excel
- **Target**: SharePoint list or Excel table
- **Location**: [To be specified]
- **Schema**: See "Output Schema" section below

### 7. Error Handling
- **On API failure**: 
  - Log error to SharePoint error list
  - Send notification email to admin
  - Move email to error folder
- **On lookup failure**:
  - Use default/unknown vendor ID
  - Flag for manual review
- **On file save failure**:
  - Retry up to 3 times
  - Log error if all retries fail

## Connection References

### Office 365 Outlook
- **Connection Name**: `shared_office365`
- **API ID**: `/providers/Microsoft.PowerApps/apis/shared_office365`
- **Operations Used**:
  - `SharedMailboxOnNewEmailV2` (trigger)
  - `MoveEmailV2` (error handling)

### SharePoint
- **Connection Name**: `shared_sharepointonline`
- **API ID**: `/providers/Microsoft.PowerApps/apis/shared_sharepointonline`
- **Operations Used**:
  - `CreateFile` (save PDF)
  - `AddListItem` (add invoice record)

### Excel Online (Business)
- **Connection Name**: `shared_excelonlinebusiness`
- **API ID**: `/providers/Microsoft.PowerApps/apis/shared_excelonlinebusiness`
- **Operations Used**:
  - `AddRowToTable` (add invoice row)

### HTTP (for CU API)
- **Connection Name**: `shared_http` or direct HTTP action
- **Authentication**: API key or managed identity

## Output Schema

The flow writes the following fields to SharePoint/Excel:

| Field Name | Source | Type | Description |
|------------|--------|------|-------------|
| InvoiceId | CU API | String | Invoice number |
| InvoiceDate | CU API | Date | Invoice issue date |
| DueDate | CU API | Date | Payment due date |
| VendorName | CU API | String | Vendor name (extracted) |
| VendorNameClassify | CU API | String | Vendor name (classified) |
| VendorId | Lookup | String | Epicor Vendor ID |
| CustomerName | CU API | String | Customer name (extracted) |
| CustomerNameClassify | CU API | String | Customer company code (MHS/MCS/MCL) |
| InvoiceTotal | CU API | Number | Total invoice amount |
| AmountDue | CU API | Number | Amount due |
| SubTotal | CU API | Number | Subtotal before tax |
| TotalTax | CU API | Number | Total tax (GST) |
| PONumber | CU API | String | Purchase order number |
| DocumentType | CU API | String | Document type classification |
| VendorTaxId | CU API | String | Vendor ABN |
| CustomerTaxId | CU API | String | Customer ABN |
| FileName | Flow | String | Saved PDF filename |
| FileLocation | Flow | String | SharePoint file URL |
| EmailSender | Flow | String | Email sender address |
| EmailSubject | Flow | String | Email subject |
| EmailReceived | Flow | DateTime | Email received timestamp |
| ProcessedDate | Flow | DateTime | Flow processing timestamp |
| Status | Flow | String | Processing status (Success/Error) |
| ErrorMessage | Flow | String | Error details (if any) |

## Flow Diagram

```
[Email Trigger]
    ↓
[Extract Attachments]
    ↓
[Filter PDFs]
    ↓
[For Each PDF]
    ↓
    ├─→ [Save to SharePoint]
    ↓
    ├─→ [Call CU API]
    ↓
    ├─→ [Lookup Vendor ID]
    ↓
    ├─→ [Transform Data]
    ↓
    └─→ [Write to Excel/SharePoint]
        ↓
        [Success] or [Error Handler]
```

## Environment-Specific Configuration

### DEV Environment
- **Mailbox**: `invoicecapture-dev@contoso.com.au` (or test mailbox)
- **CU API URL**: `OCR_DEV_APIM_URL` or `OCR_DEV_CONTAINER_URL`
- **SharePoint Site**: DEV site
- **Excel Workbook**: DEV workbook

### PRD Environment
- **Mailbox**: `invoicecapture@contoso.com.au`
- **CU API URL**: `OCR_PRD_APIM_URL`
- **SharePoint Site**: PRD site
- **Excel Workbook**: PRD workbook

## Notes

1. The flow uses **split on** to process each email independently
2. Vendor lookup requires exact match on both VendorName and CompanyCode
3. All timestamps should be in Australian Eastern Time (AET)
4. PDF files are stored permanently in SharePoint for audit purposes
5. The flow should handle multi-page invoices correctly
6. Duplicate detection is not currently implemented (consider adding based on InvoiceId + VendorId)
