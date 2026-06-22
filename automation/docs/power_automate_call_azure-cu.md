# Init Trigger

## Manual 
```json
{
  "type": "Request",
  "kind": "Http",
  "inputs": {
    "triggerAuthenticationType": "All",
    "schema": {
      "type": "object",
      "properties": {
        "filename": {
          "type": "string"
        },
        "file_content": {
          "type": "string"
        }
      }
    }
  },
  "metadata": {}
}
```

# API

## HTTP Request

```json
{
  "type": "Http",
  "inputs": {
    "uri": "https://APIM_ROUTE/invoice/process-invoice/",
    "method": "POST",
    "headers": {
      "Ocp-Apim-Subscription-Key": "REDACTED",
      "Content-Type": "application/json"
    },
    "body": {
      "filename": "@triggerBody()?['filename']",
      "file_content": "@triggerBody()?['file_content']"
    }
  },
  "runAfter": {},
  "runtimeConfiguration": {
    "contentTransfer": {
      "transferMode": "Chunked"
    }
  }
}
```

## HTTP Response
```json
{
  "type": "Response",
  "kind": "Http",
  "inputs": {
    "statusCode": 200,
    "headers": {
      "Content-Type": "application/json"
    },
    "body": "@{body('HTTP')}\n"
  },
  "runAfter": {
    "HTTP": [
      "Succeeded"
    ]
  }
}
```