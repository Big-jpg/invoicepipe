# Init Trigger

## When a new email arrives in a shared mailbox (V2)

```json
{
  "type": "OpenApiConnection",
  "inputs": {
    "parameters": {
      "mailboxAddress": "invoicecapture@contoso.com.au",
      "importance": "Any",
      "hasAttachments": true,
      "includeAttachments": true,
      "folderId": "Id::REDACTED"
    },
    "host": {
      "apiId": "/providers/Microsoft.PowerApps/apis/shared_office365",
      "connection": "shared_office365",
      "operationId": "SharedMailboxOnNewEmailV2"
    }
  },
  "recurrence": {
    "frequency": "Minute",
    "interval": 1
  },
  "splitOn": "@triggerOutputs()?['body/value']",
  "metadata": {
    "operationMetadataId": "172875bb-1eb4-4c96-a20b-7e6e90d16953",
    "Id::AAMkADcwMWE5ODBiLWQ0YmMtNDE4Mi1hZGYxLWYzMWU1MzYzNDc5NwAuAAAAAAD-JYBFfci6TZQu5Nrxf-0-AQAmMWjMrw22QqAvvp8Z5DF7AAC_F5lZAAA=": "OCR",
    "Id::AQMkADcwMWE5ODBiLWQ0YmMtNDE4Mi1hZGYxLWYzMWU1MzYzNDc5NwAuAAAD-yWARX3Iuk2ULuTa8X-9PwEAJjFozK8NtkKgL76fGeQxewAAAgEMAAAA": "Inbox"
  }
}
```

# Set Variables 

## Vendor Table
```json
{
  "type": "InitializeVariable",
  "inputs": {
    "variables": [
      {
        "name": "VendorTable",
        "type": "array",
        "value": [
          {
            "CompanyCode": "CHS",
            "VendorId": "10037",
            "VendorName": "Bunzl"
          },
          {
            "CompanyCode": "CCS",
            "VendorId": "10191",
            "VendorName": "Bunzl"
          },
          {
            "CompanyCode": "CHS",
            "VendorId": "10031",
            "VendorName": "Bidfood"
          },
          {
            "CompanyCode": "CCS",
            "VendorId": "10156",
            "VendorName": "Bidfood"
          },
          {
            "CompanyCode": "CCS",
            "VendorId": "16305",
            "VendorName": "Nisbets"
          },
          {
            "CompanyCode": "CHS",
            "VendorId": "11351",
            "VendorName": "Nisbets"
          },
          {
            "CompanyCode": "CCS",
            "VendorId": "13010",
            "VendorName": "Seton"
          },
          {
            "CompanyCode": "CHS",
            "VendorId": "11249",
            "VendorName": "Seton"
          },
          {
            "CompanyCode": "CCS",
            "VendorId": "14107",
            "VendorName": "JBHifi"
          },
          {
            "CompanyCode": "CHS",
            "VendorId": "10636",
            "VendorName": "JBHifi"
          },
          {
            "CompanyCode": "CHS",
            "VendorId": "10355",
            "VendorName": "OfficeWorks"
          },
          {
            "CompanyCode": "CCS",
            "VendorId": "12272",
            "VendorName": "OfficeWorks"
          },
          {
            "CompanyCode": "CCL",
            "VendorId": "10231",
            "VendorName": "OfficeWorks"
          },
          {
            "CompanyCode": "CCL",
            "VendorId": "10231",
            "VendorName": "OfficeWorks"
          },
          {
            "CompanyCode": "CHS",
            "VendorId": "10107",
            "VendorName": "Marbret"
          },
          {
            "CompanyCode": "CHS",
            "VendorId": "10107",
            "VendorName": "Marbret"
          },
          {
            "CompanyCode": "CCS",
            "VendorId": "16301",
            "VendorName": "Marbret"
          },
          {
            "CompanyCode": "CCS",
            "VendorId": "10180",
            "VendorName": "Brownes"
          },
          {
            "CompanyCode": "CCS",
            "VendorId": "10180",
            "VendorName": "Brownes"
          },
          {
            "CompanyCode": "CHS",
            "VendorId": "10033",
            "VendorName": "Brownes"
          },
          {
            "CompanyCode": "CHS",
            "VendorId": "11153",
            "VendorName": "Unicare"
          },
          {
            "CompanyCode": "CCS",
            "VendorId": "10155",
            "VendorName": "Unicare"
          },
          {
            "CompanyCode": "CCL",
            "VendorId": "10045",
            "VendorName": "HWLEbsworthLawyers"
          },
          {
            "CompanyCode": "CCL",
            "VendorId": "10045",
            "VendorName": "HWLEbsworthLawyers"
          },
          {
            "CompanyCode": "CCS",
            "VendorId": "10387",
            "VendorName": "HWLEbsworthLawyers"
          },
          {
            "CompanyCode": "CHS",
            "VendorId": "10237",
            "VendorName": "HWLEbsworthLawyers"
          },
          {
            "CompanyCode": "CHS",
            "VendorId": "10833",
            "VendorName": "Harvey Norman"
          },
          {
            "CompanyCode": "CCS",
            "VendorId": "13456",
            "VendorName": "Harvey Norman"
          },
          {
            "CompanyCode": "CHS",
            "VendorId": "10833",
            "VendorName": "Harvey Norman"
          },
          {
            "CompanyCode": "CHS",
            "VendorId": "10833",
            "VendorName": "Harvey Norman"
          },
          {
            "CompanyCode": "CCS",
            "VendorId": "13456",
            "VendorName": "Harvey Norman"
          },
          {
            "CompanyCode": "CHS",
            "VendorId": "11385",
            "VendorName": "Activ"
          },
          {
            "CompanyCode": "CCS",
            "VendorId": "16453",
            "VendorName": "Activ"
          }
        ]
      }
    ]
  },
  "runAfter": {}
}
```

## PO
```json
{
  "type": "InitializeVariable",
  "inputs": {
    "variables": [
      {
        "name": "PO",
        "type": "string",
        "value": "NA"
      }
    ]
  },
  "runAfter": {
    "Vendor_Table": [
      "Succeeded"
    ]
  },
  "metadata": {
    "operationMetadataId": "2cf7fb7b-2238-4ce3-ba43-81cd39ece81f"
  }
}
```

## Customer
```json
{
  "type": "InitializeVariable",
  "inputs": {
    "variables": [
      {
        "name": "Customer",
        "type": "string",
        "value": "NA"
      }
    ]
  },
  "runAfter": {
    "PO": [
      "Succeeded"
    ]
  },
  "metadata": {
    "operationMetadataId": "3ef4ca68-3c4c-4972-b706-c496c8e50d17"
  }
}
```

## Vendor Name
```json
{
  "type": "InitializeVariable",
  "inputs": {
    "variables": [
      {
        "name": "VendorName",
        "type": "string",
        "value": "NA"
      }
    ]
  },
  "runAfter": {
    "Customer": [
      "Succeeded"
    ]
  },
  "metadata": {
    "operationMetadataId": "3ef4ca68-3c4c-4972-b706-c496c8e50d17"
  }
}
```

## Vendor Id
```json
{
  "type": "InitializeVariable",
  "inputs": {
    "variables": [
      {
        "name": "VendorId",
        "type": "string",
        "value": "NA"
      }
    ]
  },
  "runAfter": {
    "Vendor_Name": [
      "Succeeded"
    ]
  },
  "metadata": {
    "operationMetadataId": "3ef4ca68-3c4c-4972-b706-c496c8e50d17"
  }
}
```

## Invoice NO
```json
{
  "type": "InitializeVariable",
  "inputs": {
    "variables": [
      {
        "name": "InvoiceNo",
        "type": "string",
        "value": "NA"
      }
    ]
  },
  "runAfter": {
    "Vendor_Id": [
      "Succeeded"
    ]
  },
  "metadata": {
    "operationMetadataId": "69e84bfa-2378-43ce-b239-4c4a9f67d9ce"
  }
}
```

## InvoiceDate
```json
{
  "type": "InitializeVariable",
  "inputs": {
    "variables": [
      {
        "name": "InvoiceDate",
        "type": "string",
        "value": "NA"
      }
    ]
  },
  "runAfter": {
    "Invoice_No": [
      "Succeeded"
    ]
  },
  "metadata": {
    "operationMetadataId": "9a096ea3-7afc-4efd-bfe3-1053ea2166d9"
  }
}
```

## InvoiceTotal
```json
{
  "type": "InitializeVariable",
  "inputs": {
    "variables": [
      {
        "name": "InvoiceTotal",
        "type": "string",
        "value": "NA"
      }
    ]
  },
  "runAfter": {
    "InvoiceDate": [
      "Succeeded"
    ]
  },
  "metadata": {
    "operationMetadataId": "7feab2bb-0bd6-460a-b070-33151ccaf56c"
  }
}
```

## Business Partner
```json
{
  "type": "InitializeVariable",
  "inputs": {
    "variables": [
      {
        "name": "BusinessPartner",
        "type": "string",
        "value": "NA"
      }
    ]
  },
  "runAfter": {
    "InvoiceTotal": [
      "Succeeded"
    ]
  },
  "metadata": {
    "operationMetadataId": "7feab2bb-0bd6-460a-b070-33151ccaf56c"
  }
}
```

## Company Code
```json
{
  "type": "InitializeVariable",
  "inputs": {
    "variables": [
      {
        "name": "CompanyCode",
        "type": "string",
        "value": "NA"
      }
    ]
  },
  "runAfter": {
    "Business_Partner": [
      "Succeeded"
    ]
  }
}
```

## UAT
```json
{
  "type": "InitializeVariable",
  "inputs": {
    "variables": [
      {
        "name": "UAT",
        "type": "integer",
        "value": 1
      }
    ]
  },
  "runAfter": {
    "Company_Code": [
      "Succeeded"
    ]
  },
  "metadata": {
    "operationMetadataId": "2cf7fb7b-2238-4ce3-ba43-81cd39ece81f"
  }
}
```

## ConditionA
```json
{
  "type": "InitializeVariable",
  "inputs": {
    "variables": [
      {
        "name": "ConditionA",
        "type": "string",
        "value": "NA"
      }
    ]
  },
  "runAfter": {
    "Set_UAT_Variable_=_1_Here_to_Test_": [
      "Succeeded"
    ]
  },
  "metadata": {
    "operationMetadataId": "7feab2bb-0bd6-460a-b070-33151ccaf56c"
  }
}
```

# Apply to each attachement

```json
{
  "type": "Foreach",
  "foreach": "@triggerOutputs()?['body/attachments']",
  "actions": {
    "If_UAT_==_1": {
      "type": "If",
      "expression": {
        "and": [
          {
            "equals": [
              "@variables('UAT')",
              1
            ]
          }
        ]
      },
      "actions": {
        "Call_Azure_OCR_via_HTTP_Trigger": {
          "type": "Http",
          "inputs": {
            "uri": "https://prod-25.australiasoutheast.logic.azure.com:443/workflows/067631ae67464ca895807607d9ec95d6/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=20cSmSFENGFguFipl6otbhOzRrFeI6pnp2SLYq1OO90",
            "method": "POST",
            "headers": {
              "Content-Type": "application/json"
            },
            "body": {
              "filename": "@item()?['name']",
              "file_content": "@item()?['contentBytes']"
            }
          },
          "runtimeConfiguration": {
            "contentTransfer": {
              "transferMode": "Chunked"
            }
          }
        },
        "Parse_OCR_Success_JSON_Response": {
          "type": "ParseJson",
          "inputs": {
            "content": "@body('Call_Azure_OCR_via_HTTP_Trigger')",
            "schema": {
              "type": "object",
              "properties": {
                "InvoiceId": {
                  "type": [
                    "string",
                    "null"
                  ]
                },
                "PurchaseOrder": {
                  "type": [
                    "string",
                    "null"
                  ]
                },
                "InvoiceDate": {
                  "type": [
                    "string",
                    "null"
                  ]
                },
                "VendorName": {
                  "type": [
                    "string",
                    "null"
                  ]
                },
                "VendorAddress": {
                  "type": [
                    "string",
                    "null"
                  ]
                },
                "VendorTaxId": {
                  "type": [
                    "string",
                    "null"
                  ]
                },
                "CustomerName": {
                  "type": [
                    "string",
                    "null"
                  ]
                },
                "CustomerAddress": {
                  "type": [
                    "string",
                    "null"
                  ]
                },
                "CustomerTaxId": {
                  "type": [
                    "string",
                    "null"
                  ]
                },
                "InvoiceTotal": {
                  "type": [
                    "number",
                    "string",
                    "null"
                  ]
                },
                "AmountDue": {
                  "type": [
                    "number",
                    "string",
                    "null"
                  ]
                },
                "SubTotal": {
                  "type": [
                    "number",
                    "string",
                    "null"
                  ]
                },
                "TotalTax": {
                  "type": [
                    "number",
                    "string",
                    "null"
                  ]
                },
                "DueDate": {
                  "type": [
                    "string",
                    "null"
                  ]
                },
                "DocumentType": {
                  "type": [
                    "string",
                    "null"
                  ]
                },
                "PONumber": {
                  "type": [
                    "string",
                    "null"
                  ]
                }
              }
            }
          },
          "runAfter": {
            "Call_Azure_OCR_via_HTTP_Trigger": [
              "Succeeded"
            ]
          }
        },
        "Set_Invoice_Type_Azure": {
          "type": "SetVariable",
          "inputs": {
            "name": "ConditionA",
            "value": "@if(equals(toLower(coalesce(body('Parse_OCR_Success_JSON_Response')?['body']?['DocumentType'],'')), 'taxinvoice'), 'taxinvoice', 'other')"
          },
          "runAfter": {
            "Parse_OCR_Success_JSON_Response": [
              "Succeeded"
            ]
          },
          "metadata": {
            "operationMetadataId": "771fade3-6384-4ed7-810e-f4b82cfa0c9a"
          }
        },
        "Set_InvoiceDate_Az": {
          "type": "SetVariable",
          "inputs": {
            "name": "InvoiceDate",
            "value": "@string(body('Parse_OCR_Success_JSON_Response')?['InvoiceDate'])"
          },
          "runAfter": {
            "Set_Invoice_Type_Azure": [
              "Succeeded"
            ]
          },
          "metadata": {
            "operationMetadataId": "24b16479-d769-4927-9922-64f2396d6e67"
          }
        },
        "Set_InvoiceTotal_Az": {
          "type": "SetVariable",
          "inputs": {
            "name": "InvoiceTotal",
            "value": "@string(coalesce(body('Parse_OCR_Success_JSON_Response')?['InvoiceTotal'],body('Parse_OCR_Success_JSON_Response')?['AmountDue'],0))"
          },
          "runAfter": {
            "Set_InvoiceDate_Az": [
              "Succeeded"
            ]
          },
          "metadata": {
            "operationMetadataId": "24037281-89ce-4d7d-992d-b817caf4c614"
          }
        },
        "Set_Invoice_No_Az": {
          "type": "SetVariable",
          "inputs": {
            "name": "InvoiceNo",
            "value": "@string(body('Parse_OCR_Success_JSON_Response')?['InvoiceId'])"
          },
          "runAfter": {
            "Set_InvoiceTotal_Az": [
              "Succeeded"
            ]
          },
          "metadata": {
            "operationMetadataId": "3b9224c0-0e65-41f4-bbc8-5bc4b8fe0eb6"
          }
        },
        "Set_Customer_Number_Az": {
          "type": "SetVariable",
          "inputs": {
            "name": "Customer",
            "value": "@string(body('Parse_OCR_Success_JSON_Response')?['CustomerName'])"
          },
          "runAfter": {
            "Set_Invoice_No_Az": [
              "Succeeded"
            ]
          },
          "metadata": {
            "operationMetadataId": "0cc48313-b926-4966-9c61-ab5350d7bcef"
          }
        },
        "Set_Purchase_Order_Az": {
          "type": "SetVariable",
          "inputs": {
            "name": "PO",
            "value": "@trim(string(coalesce(body('Parse_OCR_Success_JSON_Response')?['PurchaseOrder'],body('Parse_OCR_Success_JSON_Response')?['PONumber'],'NO_PO_FOUND')))\r\n"
          },
          "runAfter": {
            "Set_Customer_Number_Az": [
              "Succeeded"
            ]
          },
          "metadata": {
            "operationMetadataId": "40bfa4f1-14cd-4e23-ad0a-d36e0c5ee022"
          }
        },
        "Set_Vendor_Name": {
          "type": "SetVariable",
          "inputs": {
            "name": "VendorName",
            "value": "@string(body('Parse_OCR_Success_JSON_Response')?['VendorNameClassify'])"
          },
          "runAfter": {
            "Set_Company_Code": [
              "Succeeded"
            ]
          },
          "metadata": {
            "operationMetadataId": "40bfa4f1-14cd-4e23-ad0a-d36e0c5ee022"
          }
        },
        "Compose_Az": {
          "type": "Compose",
          "inputs": "@concat(variables('PO'), '___', formatDateTime(variables('InvoiceDate'), 'dd/MM/yy'), '___', variables('InvoiceTotal'), '___')",
          "runAfter": {
            "Set_Vendor_Id": [
              "Succeeded"
            ]
          },
          "metadata": {
            "operationMetadataId": "b662b0a5-c1df-4c70-85d6-aa347b957ec0"
          }
        },
        "Create_file_Az": {
          "type": "OpenApiConnection",
          "inputs": {
            "parameters": {
              "dataset": "https://mcs38.sharepoint.com/sites/Kinetic-ARMLive",
              "folderPath": "/WorkList/ALL",
              "name": "@{outputs('Compose_Az')}@{variables('InvoiceNo')}.PDF",
              "body": "@item()?['contentBytes']"
            },
            "host": {
              "apiId": "/providers/Microsoft.PowerApps/apis/shared_sharepointonline",
              "connection": "shared_sharepointonline",
              "operationId": "CreateFile"
            }
          },
          "runAfter": {
            "Compose_Az": [
              "Succeeded"
            ]
          },
          "runtimeConfiguration": {
            "contentTransfer": {
              "transferMode": "Chunked"
            }
          },
          "metadata": {
            "operationMetadataId": "11a5e989-00cc-464d-9f8b-ffb54de03488"
          }
        },
        "Add_a_row_into_a_table_1": {
          "type": "OpenApiConnection",
          "inputs": {
            "parameters": {
              "source": "sites/mcs38.sharepoint.com,50e6c0bf-a8e1-4a24-927b-a6b9cf95ed8c,088351ea-671b-454c-8a52-6f8d54ed9cce",
              "drive": "b!v8DmUOGoJEqSe6a5z5XtjOpRgwgbZ0xFilJvjVTtnM75lfopPN7-R65CokIy3rsA",
              "file": "01TUYP2DVWQ5HGCWHXSFFYZQTYP3KMJIOZ",
              "table": "{9D4FED09-A825-489A-97EF-AF73445E67CC}",
              "item/Invoice": "@concat(string(variables('InvoiceNo')), '.PDF')",
              "item/PO": "@string(variables('PO'))",
              "item/Invoice Date": "@formatDateTime(string(variables('InvoiceDate')), 'dd/MM/yyyy')",
              "item/Company": "@concat(toUpper(string(variables('Customer'))),concat(toUpper(substring(variables('VendorName'), 0, 1)),toLower(substring(variables('VendorName'), 1, sub(length(variables('VendorName')), 1)))))",
              "item/FileName": "@concat(toUpper(string(variables('Customer'))),concat(toUpper(substring(variables('VendorName'), 0, 1)),toLower(substring(variables('VendorName'), 1, sub(length(variables('VendorName')), 1)))))",
              "item/Processed": "N",
              "item/Amount": "@concat('$', formatNumber(float(variables('InvoiceTotal')), '0.00'))",
              "item/Vendor": "@string(variables('VendorId'))",
              "item/Vendor Name": "@string(variables('VendorName'))",
              "item/CompanyNew": "@concat(toUpper(string(variables('Customer'))),concat(toUpper(substring(variables('VendorName'), 0, 1)),toLower(substring(variables('VendorName'), 1, sub(length(variables('VendorName')), 1)))))",
              "item/TextInvoice": "@string(variables('InvoiceNo'))",
              "item/CompanyCode": "@string(variables('CompanyCode'))",
              "item/InvoiceType": "Tax Invoice"
            },
            "host": {
              "apiId": "/providers/Microsoft.PowerApps/apis/shared_excelonlinebusiness",
              "connection": "shared_excelonlinebusiness",
              "operationId": "AddRowV2"
            }
          },
          "runAfter": {
            "Create_file_Az": [
              "Succeeded"
            ]
          },
          "metadata": {
            "01TUYP2DU5FQRKATPSTFHL4YWXN4G2HVMS": "/OCRInvoices.xlsx",
            "tableId": "{9D4FED09-A825-489A-97EF-AF73445E67CC}",
            "operationMetadataId": "834e7e5d-cf93-4760-8dec-1fc86e681b57",
            "01TUYP2DQDTHLNNENHGRDJTQJ4WTDMIFNA": "/OCRInvoicesTest.xlsx",
            "01TUYP2DVWQ5HGCWHXSFFYZQTYP3KMJIOZ": "/OCRInvoices.xlsx",
            "01TUYP2DTH7APREIUAYBAITCL6AVAK67KE": "/OCRInvoicesTest.xlsx"
          }
        },
        "Set_Company_Code": {
          "type": "SetVariable",
          "inputs": {
            "name": "CompanyCode",
            "value": "@string(body('Parse_OCR_Success_JSON_Response')?['CustomerNameClassify'])"
          },
          "runAfter": {
            "Set_Purchase_Order_Az": [
              "Succeeded"
            ]
          }
        },
        "Filter_array": {
          "type": "Query",
          "inputs": {
            "from": "@variables('VendorTable')",
            "where": "@and(equals(item()?['CompanyCode'],variables('CompanyCode')),equals(item()?['VendorName'],variables('VendorName')))"
          },
          "runAfter": {
            "Set_Vendor_Name": [
              "Succeeded"
            ]
          }
        },
        "Set_Vendor_Id": {
          "type": "SetVariable",
          "inputs": {
            "name": "VendorId",
            "value": "@first(body('Filter_array'))?['VendorId']"
          },
          "runAfter": {
            "Filter_array": [
              "Succeeded"
            ]
          }
        }
      },
      "else": {
        "actions": {
          "Extract_information_from_invoices": {
            "type": "OpenApiConnection",
            "inputs": {
              "parameters": {
                "item/requestv2/base64Encoded": "@item()?['contentBytes']",
                "recordId": "5ed4d0fd-e9d4-4026-b09b-71f83ea90c60"
              },
              "host": {
                "apiId": "/providers/Microsoft.PowerApps/apis/shared_commondataserviceforapps",
                "connection": "shared_commondataserviceforapps",
                "operationId": "aibuilderpredict_invoiceprocessingpretrained"
              }
            },
            "metadata": {
              "flowSystemMetadata": {
                "portalOperationId": "aibuilderpredict_invoiceprocessingpretrained",
                "portalOperationGroup": "aibuilder",
                "portalOperationApiDisplayNameOverride": "AI Builder",
                "portalOperationIconOverride": "https://content.powerapps.com/resource/makerx/static/pauto/images/designeroperations/aiBuilderNew.51dbdb6b.png",
                "portalOperationBrandColorOverride": "#0A76C4",
                "portalOperationApiTierOverride": "Standard"
              },
              "operationMetadataId": "773880b4-ee00-4173-b12f-5b3047c4c74f"
            }
          },
          "Extract_information_from_documents": {
            "type": "OpenApiConnection",
            "inputs": {
              "parameters": {
                "recordId": "d7a32bfb-8235-4993-9ab0-7665a6495a11",
                "item/requestv2/mimeType": "application/pdf",
                "item/requestv2/base64Encoded": "@items('Apply_to_each_attachement')?['contentBytes']"
              },
              "host": {
                "apiId": "/providers/Microsoft.PowerApps/apis/shared_commondataserviceforapps",
                "connection": "shared_commondataserviceforapps",
                "operationId": "aibuilderpredict_formsprocessing"
              }
            },
            "runAfter": {
              "Extract_information_from_invoices": [
                "Succeeded"
              ]
            },
            "metadata": {
              "flowSystemMetadata": {
                "portalOperationId": "aibuilderpredict_formsprocessing",
                "portalOperationGroup": "aibuilder",
                "portalOperationApiDisplayNameOverride": "AI Builder",
                "portalOperationIconOverride": "https://content.powerapps.com/resource/makerx/static/pauto/images/designeroperations/aiBuilderNew.51dbdb6b.png",
                "portalOperationBrandColorOverride": "#0A76C4",
                "portalOperationApiTierOverride": "Standard"
              },
              "operationMetadataId": "ad61de51-e18c-4599-a497-9765b9421b5a"
            }
          },
          "Set_Invoice_Type_PowerApps": {
            "type": "SetVariable",
            "inputs": {
              "name": "ConditionA",
              "value": "@outputs('Extract_information_from_documents')?['body/responsev2/predictionOutput/labels/InvoiceType/text']"
            },
            "runAfter": {
              "Extract_information_from_documents": [
                "Succeeded"
              ]
            },
            "metadata": {
              "operationMetadataId": "771fade3-6384-4ed7-810e-f4b82cfa0c9a"
            }
          },
          "Set_InvoiceDate": {
            "type": "SetVariable",
            "inputs": {
              "name": "InvoiceDate",
              "value": "@outputs('Extract_information_from_invoices')?['body/responsev2/predictionOutput/result/fields/invoiceDate/valueDate']"
            },
            "runAfter": {
              "Set_Invoice_Type_PowerApps": [
                "Succeeded"
              ]
            },
            "metadata": {
              "operationMetadataId": "24b16479-d769-4927-9922-64f2396d6e67"
            }
          },
          "Set_InvoiceTotal": {
            "type": "SetVariable",
            "inputs": {
              "name": "InvoiceTotal",
              "value": "@{outputs('Extract_information_from_invoices')?['body/responsev2/predictionOutput/result/fields/invoiceTotal/valueNumber']}"
            },
            "runAfter": {
              "Set_InvoiceDate": [
                "Succeeded"
              ]
            },
            "metadata": {
              "operationMetadataId": "24037281-89ce-4d7d-992d-b817caf4c614"
            }
          },
          "Set_Invoice_No": {
            "type": "SetVariable",
            "inputs": {
              "name": "InvoiceNo",
              "value": "@outputs('Extract_information_from_invoices')?['body/responsev2/predictionOutput/result/fields/invoiceId/valueText']"
            },
            "runAfter": {
              "Set_InvoiceTotal": [
                "Succeeded"
              ]
            },
            "metadata": {
              "operationMetadataId": "3b9224c0-0e65-41f4-bbc8-5bc4b8fe0eb6"
            }
          },
          "Set_Customer_Number": {
            "type": "SetVariable",
            "inputs": {
              "name": "Customer",
              "value": "@outputs('Extract_information_from_invoices')?['body/responsev2/predictionOutput/result/fields/customerId/valueText']"
            },
            "runAfter": {
              "Set_Invoice_No": [
                "Succeeded"
              ]
            },
            "metadata": {
              "operationMetadataId": "0cc48313-b926-4966-9c61-ab5350d7bcef"
            }
          },
          "Set_Purchase_Order": {
            "type": "SetVariable",
            "inputs": {
              "name": "PO",
              "value": "@outputs('Extract_information_from_documents')?['body/responsev2/predictionOutput/labels/PO/text']"
            },
            "runAfter": {
              "Set_Customer_Number": [
                "Succeeded"
              ]
            },
            "metadata": {
              "operationMetadataId": "40bfa4f1-14cd-4e23-ad0a-d36e0c5ee022"
            }
          },
          "Set_FileNamePartner": {
            "type": "SetVariable",
            "inputs": {
              "name": "BusinessPartner",
              "value": "@outputs('Extract_information_from_documents')?['body/responsev2/predictionOutput/labels/PartnerAccount/text']"
            },
            "runAfter": {
              "Set_Purchase_Order": [
                "Succeeded"
              ]
            },
            "metadata": {
              "operationMetadataId": "a3ced4af-ee3d-4a40-9c9e-14f556c65572"
            }
          },
          "Compose": {
            "type": "Compose",
            "inputs": "@concat(variables('PO'), '___', formatDateTime(variables('InvoiceDate'), 'dd/MM/yy'), '___', variables('InvoiceTotal'), '___')",
            "runAfter": {
              "Set_FileNamePartner": [
                "Succeeded"
              ]
            },
            "metadata": {
              "operationMetadataId": "b662b0a5-c1df-4c70-85d6-aa347b957ec0"
            }
          },
          "Create_file": {
            "type": "OpenApiConnection",
            "inputs": {
              "parameters": {
                "dataset": "https://mcs38.sharepoint.com/sites/Kinetic-ARMLive",
                "folderPath": "/WorkList/ALL",
                "name": "@{outputs('Compose')}@{outputs('Extract_information_from_invoices')?['body/responsev2/predictionOutput/result/fields/invoiceId/valueText']}.PDF",
                "body": "@item()?['contentBytes']"
              },
              "host": {
                "apiId": "/providers/Microsoft.PowerApps/apis/shared_sharepointonline",
                "connection": "shared_sharepointonline",
                "operationId": "CreateFile"
              }
            },
            "runAfter": {
              "Compose": [
                "Succeeded"
              ]
            },
            "runtimeConfiguration": {
              "contentTransfer": {
                "transferMode": "Chunked"
              }
            },
            "metadata": {
              "operationMetadataId": "11a5e989-00cc-464d-9f8b-ffb54de03488"
            }
          },
          "Add_a_row_into_a_table": {
            "type": "OpenApiConnection",
            "inputs": {
              "parameters": {
                "source": "sites/mcs38.sharepoint.com,50e6c0bf-a8e1-4a24-927b-a6b9cf95ed8c,088351ea-671b-454c-8a52-6f8d54ed9cce",
                "drive": "b!v8DmUOGoJEqSe6a5z5XtjOpRgwgbZ0xFilJvjVTtnM75lfopPN7-R65CokIy3rsA",
                "file": "01TUYP2DVWQ5HGCWHXSFFYZQTYP3KMJIOZ",
                "table": "{9D4FED09-A825-489A-97EF-AF73445E67CC}",
                "item/Invoice": "@{outputs('Extract_information_from_documents')?['body/responsev2/predictionOutput/labels/invoiceId/text']}.PDF",
                "item/PO": "@outputs('Extract_information_from_documents')?['body/responsev2/predictionOutput/labels/PO/text']",
                "item/Invoice Date": "@formatDateTime(variables('InvoiceDate'), 'dd/MM/yy')",
                "item/Company": "@{outputs('Extract_information_from_documents')?['body/responsev2/predictionOutput/labels/PartnerAccount/text']}Bidfood",
                "item/FileName": "@{outputs('Extract_information_from_documents')?['body/responsev2/predictionOutput/labels/PartnerAccount/text']}Bidfood",
                "item/Processed": "N",
                "item/Amount": "@outputs('Extract_information_from_documents')?['body/responsev2/predictionOutput/labels/invoiceTotal/text']",
                "item/Vendor Name": "@outputs('Extract_information_from_documents')?['body/responsev2/predictionOutput/labels/vendorName/text']",
                "item/CompanyNew": "@{outputs('Extract_information_from_documents')?['body/responsev2/predictionOutput/labels/PartnerAccount/text']}Bidfood",
                "item/TextInvoice": "@outputs('Extract_information_from_documents')?['body/responsev2/predictionOutput/labels/invoiceId/text']",
                "item/InvoiceType": "@outputs('Extract_information_from_documents')?['body/responsev2/predictionOutput/labels/InvoiceType/text']"
              },
              "host": {
                "apiId": "/providers/Microsoft.PowerApps/apis/shared_excelonlinebusiness",
                "connection": "shared_excelonlinebusiness",
                "operationId": "AddRowV2"
              }
            },
            "runAfter": {
              "Create_file": [
                "Succeeded"
              ]
            },
            "metadata": {
              "01TUYP2DU5FQRKATPSTFHL4YWXN4G2HVMS": "/OCRInvoices.xlsx",
              "tableId": "{9D4FED09-A825-489A-97EF-AF73445E67CC}",
              "operationMetadataId": "834e7e5d-cf93-4760-8dec-1fc86e681b57",
              "01TUYP2DQDTHLNNENHGRDJTQJ4WTDMIFNA": "/OCRInvoicesTest.xlsx",
              "01TUYP2DVWQ5HGCWHXSFFYZQTYP3KMJIOZ": "/OCRInvoices.xlsx",
              "01TUYP2DTH7APREIUAYBAITCL6AVAK67KE": "/OCRInvoicesTest.xlsx"
            }
          }
        }
      }
    }
  },
  "runAfter": {
    "ConditionA": [
      "Succeeded"
    ]
  },
  "metadata": {
    "operationMetadataId": "642ea5e6-799c-4d7b-b22d-393362818370"
  }
}
```
