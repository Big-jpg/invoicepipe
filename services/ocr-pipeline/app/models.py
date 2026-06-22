"""
API request/response schemas.

InputSchema matches what Power Automate sends to /process-invoice/
OutputSchema contains only the fields expected downstream (ARM worklist / Excel logging).
"""

from pydantic import BaseModel, Field
from typing import Optional, List

class InputSchema(BaseModel):
    """Base64 JSON contract used by Power Automate/APIM callers."""
    filename: str = Field(..., description="Original filename of the PDF")
    file_content: str = Field(..., description="Base64-encoded PDF bytes")

class OutputSchema(BaseModel):
    AmountDue: Optional[float] = None
    BillingAddress: Optional[str] = None
    CustomerAddress: Optional[str] = None
    CustomerName: Optional[str] = None
    CustomerTaxId: Optional[str] = None
    DueDate: Optional[str] = None
    InvoiceDate: Optional[str] = None
    InvoiceId: Optional[str] = None
    InvoiceTotal: Optional[float] = None
    PurchaseOrder: Optional[str] = None
    SubTotal: Optional[float] = None
    TotalTax: Optional[float] = None
    VendorAddress: Optional[str] = None
    VendorName: Optional[str] = None
    VendorTaxId: Optional[str] = None
    DocumentType: Optional[str] = None
    PONumber: Optional[str] = None
    CustomerNameClassify: Optional[str] = None
    VendorNameClassify: Optional[str] = None

    