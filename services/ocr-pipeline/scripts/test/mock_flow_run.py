#!/usr/bin/env python3
"""
mock_flow_run.py - Power Automate Flow Stub for Local Testing

This script simulates the Power Automate invoice processing flow locally:
1. Watches mock_inbox/ for new PDF files
2. Calls the local DEV API /process-invoice/
3. Performs vendor ID lookup
4. Writes results to a local CSV file (mimicking SharePoint/Excel output)
"""

import os
import sys
import csv
import json
import time
import base64
import requests
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, Optional, List


# Vendor lookup table (from Power Automate flow)
VENDOR_TABLE = [
    {"CompanyCode": "CHS", "VendorId": "10037", "VendorName": "Bunzl"},
    {"CompanyCode": "CCS", "VendorId": "10191", "VendorName": "Bunzl"},
    {"CompanyCode": "CHS", "VendorId": "10031", "VendorName": "Bidfood"},
    {"CompanyCode": "CCS", "VendorId": "10156", "VendorName": "Bidfood"},
    {"CompanyCode": "CCS", "VendorId": "16305", "VendorName": "Nisbets"},
    {"CompanyCode": "CHS", "VendorId": "11351", "VendorName": "Nisbets"},
    {"CompanyCode": "CCS", "VendorId": "13010", "VendorName": "Seton"},
    {"CompanyCode": "CHS", "VendorId": "11249", "VendorName": "Seton"},
    {"CompanyCode": "CCS", "VendorId": "14107", "VendorName": "JBHifi"},
    {"CompanyCode": "CHS", "VendorId": "10636", "VendorName": "JBHifi"},
    {"CompanyCode": "CHS", "VendorId": "10355", "VendorName": "OfficeWorks"},
    {"CompanyCode": "CCS", "VendorId": "10355", "VendorName": "OfficeWorks"},
    {"CompanyCode": "CCS", "VendorId": "10296", "VendorName": "Marbret"},
    {"CompanyCode": "CHS", "VendorId": "10296", "VendorName": "Marbret"},
    {"CompanyCode": "CCS", "VendorId": "10071", "VendorName": "Brownes"},
    {"CompanyCode": "CHS", "VendorId": "10071", "VendorName": "Brownes"},
    {"CompanyCode": "CCS", "VendorId": "10451", "VendorName": "Unicare"},
    {"CompanyCode": "CHS", "VendorId": "10451", "VendorName": "Unicare"},
    {"CompanyCode": "CCS", "VendorId": "10588", "VendorName": "HWLEbsworthLawyers"},
    {"CompanyCode": "CHS", "VendorId": "10588", "VendorName": "HWLEbsworthLawyers"},
    {"CompanyCode": "CCS", "VendorId": "10265", "VendorName": "HarveyNorman"},
    {"CompanyCode": "CHS", "VendorId": "10265", "VendorName": "HarveyNorman"},
    {"CompanyCode": "CCS", "VendorId": "10001", "VendorName": "Activ"},
    {"CompanyCode": "CHS", "VendorId": "10001", "VendorName": "Activ"},
]


class FlowStub:
    """Simulates the Power Automate flow locally."""
    
    def __init__(self, api_base_url: str, inbox_dir: Path, output_file: Path):
        self.api_base_url = api_base_url.rstrip('/')
        self.inbox_dir = inbox_dir
        self.output_file = output_file
        self.processed_files = set()
        
        # Ensure output directory exists
        output_file.parent.mkdir(parents=True, exist_ok=True)
        
        # Initialize CSV file with headers if it doesn't exist
        if not output_file.exists():
            self._init_csv()
    
    def _init_csv(self):
        """Initialize CSV file with headers."""
        headers = [
            "FileName",
            "ProcessedDate",
            "InvoiceId",
            "InvoiceDate",
            "DueDate",
            "VendorName",
            "VendorNameClassify",
            "VendorId",
            "CustomerName",
            "CustomerNameClassify",
            "InvoiceTotal",
            "AmountDue",
            "SubTotal",
            "TotalTax",
            "PONumber",
            "DocumentType",
            "VendorTaxId",
            "CustomerTaxId",
            "Status",
            "ErrorMessage"
        ]
        
        with open(self.output_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=headers)
            writer.writeheader()
    
    def lookup_vendor_id(self, vendor_name: str, company_code: str) -> Optional[str]:
        """Lookup Epicor Vendor ID based on vendor name and company code."""
        for entry in VENDOR_TABLE:
            if (entry["VendorName"].lower() == vendor_name.lower() and 
                entry["CompanyCode"].upper() == company_code.upper()):
                return entry["VendorId"]
        return None
    
    def call_api(self, pdf_file: Path) -> Dict[str, Any]:
        """Call the CU API to process the invoice."""
        url = f"{self.api_base_url}/process-invoice/"
        
        # Read and encode PDF
        with open(pdf_file, 'rb') as f:
            file_content = base64.b64encode(f.read()).decode('utf-8')
        
        payload = {
            "filename": pdf_file.name,
            "file_content": file_content
        }
        
        response = requests.post(url, json=payload, timeout=120)
        response.raise_for_status()
        return response.json()
    
    def process_invoice(self, pdf_file: Path) -> Dict[str, Any]:
        """Process a single invoice PDF."""
        print(f"  📄 Processing: {pdf_file.name}")
        
        result = {
            "FileName": pdf_file.name,
            "ProcessedDate": datetime.now().isoformat(),
            "Status": "Success",
            "ErrorMessage": ""
        }
        
        try:
            # Call CU API
            print(f"  📤 Calling API...")
            api_response = self.call_api(pdf_file)
            
            # Extract fields from API response
            result.update({
                "InvoiceId": api_response.get("InvoiceId", ""),
                "InvoiceDate": api_response.get("InvoiceDate", ""),
                "DueDate": api_response.get("DueDate", ""),
                "VendorName": api_response.get("VendorName", ""),
                "VendorNameClassify": api_response.get("VendorNameClassify", ""),
                "CustomerName": api_response.get("CustomerName", ""),
                "CustomerNameClassify": api_response.get("CustomerNameClassify", ""),
                "InvoiceTotal": api_response.get("InvoiceTotal", ""),
                "AmountDue": api_response.get("AmountDue", ""),
                "SubTotal": api_response.get("SubTotal", ""),
                "TotalTax": api_response.get("TotalTax", ""),
                "PONumber": api_response.get("PONumber", ""),
                "DocumentType": api_response.get("DocumentType", ""),
                "VendorTaxId": api_response.get("VendorTaxId", ""),
                "CustomerTaxId": api_response.get("CustomerTaxId", ""),
            })
            
            # Lookup Vendor ID
            vendor_name = result["VendorNameClassify"]
            company_code = result["CustomerNameClassify"]
            
            if vendor_name and company_code:
                print(f"  🔍 Looking up Vendor ID for {vendor_name} + {company_code}...")
                vendor_id = self.lookup_vendor_id(vendor_name, company_code)
                if vendor_id:
                    result["VendorId"] = vendor_id
                    print(f"  ✅ Found Vendor ID: {vendor_id}")
                else:
                    result["VendorId"] = "UNKNOWN"
                    result["ErrorMessage"] = f"Vendor ID not found for {vendor_name} + {company_code}"
                    print(f"  ⚠️  Vendor ID not found")
            else:
                result["VendorId"] = "UNKNOWN"
                result["ErrorMessage"] = "Missing vendor or customer classification"
            
            print(f"  ✅ Processing complete")
            
        except requests.exceptions.RequestException as e:
            result["Status"] = "Error"
            result["ErrorMessage"] = f"API request failed: {e}"
            print(f"  ❌ API error: {e}")
        except Exception as e:
            result["Status"] = "Error"
            result["ErrorMessage"] = f"Processing failed: {e}"
            print(f"  ❌ Error: {e}")
        
        return result
    
    def write_to_csv(self, result: Dict[str, Any]):
        """Append result to CSV file."""
        with open(self.output_file, 'a', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=result.keys())
            writer.writerow(result)
    
    def scan_inbox(self) -> List[Path]:
        """Scan inbox for new PDF files."""
        pdf_files = []
        for file_path in self.inbox_dir.glob("*.pdf"):
            if file_path not in self.processed_files:
                pdf_files.append(file_path)
        return pdf_files
    
    def run_once(self):
        """Run one scan cycle."""
        new_files = self.scan_inbox()
        
        if not new_files:
            return 0
        
        print(f"\n📥 Found {len(new_files)} new PDF(s)")
        
        for pdf_file in new_files:
            result = self.process_invoice(pdf_file)
            self.write_to_csv(result)
            self.processed_files.add(pdf_file)
            print(f"  💾 Result written to {self.output_file}")
        
        return len(new_files)
    
    def run_watch(self, interval: int = 5):
        """Watch inbox directory continuously."""
        print("=" * 80)
        print("🔄 Power Automate Flow Stub - Watch Mode")
        print("=" * 80)
        print(f"📂 Watching: {self.inbox_dir}")
        print(f"📊 Output: {self.output_file}")
        print(f"🌐 API: {self.api_base_url}")
        print(f"⏱️  Scan interval: {interval} seconds")
        print("")
        print("💡 Drop PDF files into the inbox directory to process them")
        print("💡 Press Ctrl+C to stop")
        print("")
        
        try:
            while True:
                self.run_once()
                time.sleep(interval)
        except KeyboardInterrupt:
            print("\n\n⏹️  Stopped by user")


def main():
    """Main entry point."""
    # Get configuration from environment or use defaults
    api_base_url = os.environ.get('OCR_LOCAL_BASE_URL', 'http://localhost:8000')
    
    # Determine project root
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    
    inbox_dir = project_root / 'mock_inbox'
    output_file = project_root / 'mock_output' / 'invoice_results.csv'
    
    # Ensure inbox exists
    inbox_dir.mkdir(parents=True, exist_ok=True)
    
    # Create flow stub
    stub = FlowStub(api_base_url, inbox_dir, output_file)
    
    # Check for command line arguments
    if len(sys.argv) > 1 and sys.argv[1] == '--once':
        # Run once and exit
        count = stub.run_once()
        if count > 0:
            print(f"\n✅ Processed {count} file(s)")
        else:
            print("\n💤 No new files found")
    else:
        # Watch mode
        stub.run_watch()


if __name__ == "__main__":
    main()
