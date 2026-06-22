
# Contoso Invoice Automation API Reference

Version: Stable (June 2025)

This API provides PDF invoice extraction via Azure Content Understanding (Document Intelligence). Two endpoints are exposed for different ingestion formats.

---

## Base URL

When deployed:

```text
https://{your-container-app-endpoint}
````

When local:

```text
http://127.0.0.1:8000
```

---

## Endpoints

### 1️⃣ `POST /analyzepdf`

#### Description

Submit a raw PDF file using `multipart/form-data`.

This is used primarily for raw file upload without preprocessing.

#### Request

* **Content-Type:** `multipart/form-data`
* **Body:**

| Field  | Type     | Description                 |
| ------ | -------- | --------------------------- |
| `file` | `binary` | The raw PDF file to analyze |

#### Example using curl:

```bash
curl -X POST http://127.0.0.1:8000/analyzepdf \
  -F "file=@/path/to/invoice.pdf"
```

#### Response

* **HTTP 200 OK**

Returns full JSON response from Azure Content Understanding.

```json
{
  "result": {
    "contents": [...]
  }
}
```

* **HTTP 422 Validation Error**

Returned when file upload fails schema validation.

```json
{
  "detail": [
    {
      "loc": ["string"],
      "msg": "string",
      "type": "string"
    }
  ]
}
```


### 2️⃣ `POST /process-invoice/`

#### Description

Submit a pre-encoded Base64 payload of a PDF for automated field extraction.

This is the production-ready API designed to return clean structured data directly.

#### Request

* **Content-Type:** `application/json`
* **Body:**

```json
{
  "filename": "string",
  "file_content": "string (Base64-encoded PDF)"
}
```

#### Response

* **HTTP 200 OK**

Returns extracted invoice fields based on Azure CU Schema and Pydantic OutputSchema:

| Field                  | Type   | Description                                                  |
| ---------------------- | ------ | ------------------------------------------------------------ |
| `AmountDue`            | float  | Total amount due                                             |
| `BillingAddress`       | string | Billing address                                              |
| `CustomerAddress`      | string | Customer address                                             |
| `CustomerName`         | string | Customer name                                                |
| `CustomerTaxId`        | string | Customer Tax ID                                              |
| `DueDate`              | string | Due date                                                     |
| `InvoiceDate`          | string | Invoice date                                                 |
| `InvoiceId`            | string | Invoice number                                               |
| `InvoiceTotal`         | float  | Invoice total                                                |
| `PurchaseOrder`        | string | Purchase order reference                                     |
| `SubTotal`             | float  | Subtotal                                                     |
| `TotalTax`             | float  | Total tax                                                    |
| `VendorAddress`        | string | Vendor address                                               |
| `VendorName`           | string | Vendor name                                                  |
| `VendorTaxId`          | string | Vendor Tax ID                                                |
| `DocumentType`         | string | Document classification (`TaxInvoice` or `Other`)            |
| `PONumber`             | string | Customer Purchase Order                                      |
| `CustomerNameClassify` | string | Classified customer name (enum: MHS, MCS, MCL)               |
| `VendorNameClassify`   | string | Classified vendor name (enum: Bunzl, Bidfood, Nisbets, etc.) |

#### Example Response

```json
{
  "AmountDue": 150.00,
  "BillingAddress": "123 Some Street",
  "CustomerAddress": "456 Another St",
  "CustomerName": "Contoso",
  "CustomerTaxId": "ABN12345678",
  "DueDate": "2025-06-01",
  "InvoiceDate": "2025-05-15",
  "InvoiceId": "INV-001",
  "InvoiceTotal": 200.00,
  "PurchaseOrder": "PO123",
  "SubTotal": 180.00,
  "TotalTax": 20.00,
  "VendorAddress": "789 Vendor Lane",
  "VendorName": "Bidfood",
  "VendorTaxId": "ABN87654321",
  "DocumentType": "TaxInvoice",
  "PONumber": "1234",
  "CustomerNameClassify": "CCS",
  "VendorNameClassify": "Bidfood"
}
```

* **HTTP 422 Validation Error**

```json
{
  "detail": [
    {
      "loc": ["string"],
      "msg": "string",
      "type": "string"
    }
  ]
}
```

## 🔒 Authentication

Authentication is handled externally via Azure API Management (APIM) or internal network routing depending on deployment mode.


## 🔧 Azure Schema Mapping Reference

The full extraction model for Content Understanding is configured in `custom-invoice-analyzer-id_schema.json`. This governs what fields are trained and returned.

* Supports hybrid `extract` and `classify` modes.
* Contains vendor and customer name classifiers.

## 🧪 Testing Tools

PowerShell scripts provided:

* `tests/test_local.ps1` — Local server testing

* `tests/test_live.ps1` — Deployed container app testing

* `tests/test_apim.ps1` — APIM Gateway testing

## 📞 Support

For implementation queries or further integration, contact Your Name [here 📬](mailto:developer@contoso.com.au?subject=Invoice%20Automation%20API%20Support&body=Hi%20Team%2C%0A%0AI%20have%20a%20question%20regarding%20the%20Contoso%20Invoice%20Automation%20API.%0A%0AThanks%2C%0A)


Built with ❤️ by Your Name