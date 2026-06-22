#!/usr/bin/env python3
"""
fetch_epicor_vendorlist.py - Fetch vendor data from Epicor BAQ endpoint

This script:
1. Retrieves paginated vendor data from the Epicor BAQ endpoint
2. Writes raw JSON output to data/epicor_vendorlist_raw.json
3. Writes normalized CSV to data/epicor_vendorlist_clean.csv

Configuration via environment variables:
- EPICOR_API_KEY: API key for authentication
- EPICOR_BASE_URL: Base URL of the Epicor API
- EPICOR_BAQ_NAME: BAQ name (default: VendorList_OCR)
"""

import os
import sys
import json
import csv
import requests
from pathlib import Path
from typing import List, Dict, Any
from urllib.parse import urljoin


class EpicorVendorFetcher:
    """Fetch and process vendor data from Epicor BAQ endpoint."""
    
    def __init__(self, api_key: str, base_url: str, baq_name: str = "VendorList_OCR"):
        self.api_key = api_key
        self.base_url = base_url.rstrip('/')
        self.baq_name = baq_name
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {api_key}",
            "Accept": "application/json",
            "Content-Type": "application/json"
        })
    
    def fetch_page(self, page: int = 1, page_size: int = 100) -> Dict[str, Any]:
        """Fetch a single page of vendor data."""
        url = urljoin(self.base_url, f"/api/v1/BaqSvc/{self.baq_name}/Data")
        
        params = {
            "$top": page_size,
            "$skip": (page - 1) * page_size
        }
        
        print(f"  📥 Fetching page {page} (records {params['$skip']+1}-{params['$skip']+page_size})...")
        
        response = self.session.get(url, params=params, timeout=30)
        response.raise_for_status()
        return response.json()
    
    def fetch_all(self, page_size: int = 100) -> List[Dict[str, Any]]:
        """Fetch all vendor data with pagination."""
        all_records = []
        page = 1
        
        print("🔄 Fetching vendor data from Epicor BAQ...")
        print(f"📍 Endpoint: {self.base_url}/api/v1/BaqSvc/{self.baq_name}/Data")
        print("")
        
        while True:
            try:
                data = self.fetch_page(page, page_size)
                
                # Extract records from response
                # The actual structure may vary - adjust based on Epicor response format
                records = data.get('value', [])
                
                if not records:
                    print(f"  ✅ No more records (page {page})")
                    break
                
                all_records.extend(records)
                print(f"  ✅ Retrieved {len(records)} records (total: {len(all_records)})")
                
                # Check if there are more pages
                if len(records) < page_size:
                    print(f"  ✅ Last page reached")
                    break
                
                page += 1
                
            except requests.exceptions.RequestException as e:
                print(f"  ❌ Error fetching page {page}: {e}")
                break
        
        print("")
        print(f"✅ Total records fetched: {len(all_records)}")
        return all_records
    
    def normalize_record(self, record: Dict[str, Any]) -> Dict[str, str]:
        """Normalize a vendor record to standard format."""
        # Adjust field names based on actual Epicor BAQ response
        # This is a template - update with actual field names
        return {
            "VendorId": record.get("VendorNum", ""),
            "VendorName": record.get("Name", ""),
            "ABN": record.get("TaxPayerID", ""),
            "CompanyCode": record.get("Company", ""),
            "Status": record.get("VendorStatus", ""),
            "Address1": record.get("Address1", ""),
            "Address2": record.get("Address2", ""),
            "City": record.get("City", ""),
            "State": record.get("State", ""),
            "PostalCode": record.get("ZIP", ""),
            "Country": record.get("Country", ""),
            "Phone": record.get("PhoneNum", ""),
            "Email": record.get("EMailAddress", ""),
        }
    
    def save_raw_json(self, records: List[Dict[str, Any]], output_file: Path):
        """Save raw JSON data to file."""
        print(f"💾 Saving raw JSON to {output_file}...")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(records, f, indent=2, ensure_ascii=False)
        print(f"✅ Saved {len(records)} records")
    
    def save_clean_csv(self, records: List[Dict[str, Any]], output_file: Path):
        """Save normalized CSV data to file."""
        print(f"💾 Saving clean CSV to {output_file}...")
        
        if not records:
            print("⚠️  No records to save")
            return
        
        # Normalize all records
        normalized = [self.normalize_record(r) for r in records]
        
        # Get all field names
        fieldnames = list(normalized[0].keys())
        
        # Write CSV
        with open(output_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(normalized)
        
        print(f"✅ Saved {len(normalized)} records")


def main():
    """Main entry point."""
    print("=" * 80)
    print("🔧 Epicor Vendor List Fetcher")
    print("=" * 80)
    print("")
    
    # Get configuration from environment
    api_key = os.environ.get('EPICOR_API_KEY')
    base_url = os.environ.get('EPICOR_BASE_URL')
    baq_name = os.environ.get('EPICOR_BAQ_NAME', 'VendorList_OCR')
    
    # Validate configuration
    if not api_key:
        print("❌ Error: EPICOR_API_KEY environment variable is not set")
        print("👉 Set EPICOR_API_KEY with your Epicor API key")
        sys.exit(1)
    
    if not base_url:
        print("❌ Error: EPICOR_BASE_URL environment variable is not set")
        print("👉 Set EPICOR_BASE_URL with your Epicor API base URL")
        print("   Example: https://erp.contoso.com.au")
        sys.exit(1)
    
    print(f"📋 Configuration:")
    print(f"   Base URL: {base_url}")
    print(f"   BAQ Name: {baq_name}")
    print(f"   API Key: {api_key[:8]}...")
    print("")
    
    # Determine output paths
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    data_dir = project_root / 'data'
    
    # Ensure data directory exists
    data_dir.mkdir(parents=True, exist_ok=True)
    
    raw_json_file = data_dir / 'epicor_vendorlist_raw.json'
    clean_csv_file = data_dir / 'epicor_vendorlist_clean.csv'
    
    # Create fetcher and fetch data
    try:
        fetcher = EpicorVendorFetcher(api_key, base_url, baq_name)
        records = fetcher.fetch_all()
        
        if not records:
            print("⚠️  No vendor records retrieved")
            sys.exit(1)
        
        # Save outputs
        print("")
        fetcher.save_raw_json(records, raw_json_file)
        fetcher.save_clean_csv(records, clean_csv_file)
        
        print("")
        print("=" * 80)
        print("✅ Vendor data fetch completed successfully")
        print("=" * 80)
        print(f"📄 Raw JSON: {raw_json_file}")
        print(f"📊 Clean CSV: {clean_csv_file}")
        print("")
        print("💡 Use the CSV file to join against CU outputs for vendor validation")
        
    except requests.exceptions.RequestException as e:
        print("")
        print(f"❌ API request failed: {e}")
        print("👉 Check your network connection and Epicor endpoint configuration")
        sys.exit(1)
    except Exception as e:
        print("")
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
