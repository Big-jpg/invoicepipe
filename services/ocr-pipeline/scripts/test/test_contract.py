#!/usr/bin/env python3
"""
test_contract.py - API Contract Validation Tests

This script tests the invoice processing API against expected outputs
to ensure the contract remains stable across changes.
"""

import json
import os
import sys
from pathlib import Path
from typing import Dict, Any, List, Tuple
import requests
import base64


class ContractTester:
    """Test API contract against expected outputs."""
    
    def __init__(self, base_url: str, fixtures_dir: Path):
        self.base_url = base_url.rstrip('/')
        self.fixtures_dir = fixtures_dir
        self.tolerance_fields = ['confidence', 'timestamp', 'id', 'guid']
        
    def load_expected_output(self, expected_file: Path) -> Dict[str, Any]:
        """Load expected JSON output from file."""
        with open(expected_file, 'r') as f:
            return json.load(f)
    
    def send_invoice(self, pdf_file: Path) -> Dict[str, Any]:
        """Send invoice PDF to the API and return the response."""
        url = f"{self.base_url}/process-invoice/"
        
        # Read PDF file and encode to base64
        with open(pdf_file, 'rb') as f:
            file_content = base64.b64encode(f.read()).decode('utf-8')
        
        payload = {
            "filename": pdf_file.name,
            "file_content": file_content
        }
        
        response = requests.post(url, json=payload)
        response.raise_for_status()
        return response.json()
    
    def compare_values(self, expected: Any, actual: Any, field_name: str) -> Tuple[bool, str]:
        """Compare expected and actual values with tolerance for certain fields."""
        
        # Skip comparison for tolerance fields
        if any(tol_field in field_name.lower() for tol_field in self.tolerance_fields):
            return True, ""
        
        # Handle None values
        if expected is None and actual is None:
            return True, ""
        if expected is None or actual is None:
            return False, f"One value is None: expected={expected}, actual={actual}"
        
        # Handle numeric values with tolerance
        if isinstance(expected, (int, float)) and isinstance(actual, (int, float)):
            tolerance = 0.01  # Allow 1 cent difference for currency
            if abs(expected - actual) <= tolerance:
                return True, ""
            return False, f"Numeric difference exceeds tolerance: expected={expected}, actual={actual}"
        
        # Handle string values (case-insensitive comparison for some fields)
        if isinstance(expected, str) and isinstance(actual, str):
            if expected.strip().lower() == actual.strip().lower():
                return True, ""
            return False, f"String mismatch: expected='{expected}', actual='{actual}'"
        
        # Direct comparison for other types
        if expected == actual:
            return True, ""
        
        return False, f"Value mismatch: expected={expected}, actual={actual}"
    
    def compare_outputs(self, expected: Dict[str, Any], actual: Dict[str, Any]) -> Tuple[bool, List[str]]:
        """Compare expected and actual outputs, return success status and differences."""
        differences = []
        
        # Check for missing fields in actual output
        for key in expected:
            if key not in actual:
                differences.append(f"Missing field in actual output: {key}")
                continue
            
            matches, diff_msg = self.compare_values(expected[key], actual[key], key)
            if not matches:
                differences.append(f"Field '{key}': {diff_msg}")
        
        # Check for extra fields in actual output
        for key in actual:
            if key not in expected and key not in self.tolerance_fields:
                differences.append(f"Extra field in actual output: {key}")
        
        return len(differences) == 0, differences
    
    def test_fixture(self, pdf_file: Path, expected_file: Path) -> Tuple[bool, str]:
        """Test a single fixture and return success status and message."""
        try:
            # Load expected output
            expected = self.load_expected_output(expected_file)
            
            # Send invoice to API
            print(f"  📤 Sending {pdf_file.name} to API...")
            actual = self.send_invoice(pdf_file)
            
            # Compare outputs
            matches, differences = self.compare_outputs(expected, actual)
            
            if matches:
                return True, "✅ Contract matches expected output"
            else:
                diff_msg = "\n    ".join(differences)
                return False, f"❌ Contract validation failed:\n    {diff_msg}"
        
        except requests.exceptions.RequestException as e:
            return False, f"❌ API request failed: {e}"
        except Exception as e:
            return False, f"❌ Test failed with exception: {e}"
    
    def run_all_tests(self) -> bool:
        """Run all contract tests and return overall success status."""
        print("\n" + "=" * 80)
        print("🧪 API Contract Validation Tests")
        print("=" * 80)
        print(f"📍 Base URL: {self.base_url}")
        print(f"📂 Fixtures: {self.fixtures_dir}")
        print("")
        
        # Find all expected JSON files
        expected_files = list(self.fixtures_dir.glob("*.expected.json"))
        
        if not expected_files:
            print("⚠️  No test fixtures found in", self.fixtures_dir)
            print("👉 Add .expected.json files to the fixtures directory")
            return False
        
        print(f"Found {len(expected_files)} test fixture(s)")
        print("")
        
        results = []
        for expected_file in expected_files:
            # Derive PDF filename from expected JSON filename
            pdf_name = expected_file.name.replace('.expected.json', '.pdf')
            pdf_file = self.fixtures_dir / pdf_name
            
            print(f"🔍 Testing: {pdf_name}")
            
            if not pdf_file.exists():
                print(f"  ⚠️  PDF file not found: {pdf_file}")
                print(f"  👉 Create {pdf_name} or update the expected JSON filename")
                results.append(False)
                print("")
                continue
            
            success, message = self.test_fixture(pdf_file, expected_file)
            print(f"  {message}")
            results.append(success)
            print("")
        
        # Summary
        print("=" * 80)
        passed = sum(results)
        total = len(results)
        print(f"📊 Results: {passed}/{total} tests passed")
        
        if all(results):
            print("✅ All contract tests passed!")
            return True
        else:
            print("❌ Some contract tests failed")
            return False


def main():
    """Main entry point."""
    # Get base URL from environment or use default
    base_url = os.environ.get('OCR_LOCAL_BASE_URL', 'http://localhost:8000')
    
    # Determine fixtures directory
    script_dir = Path(__file__).parent
    fixtures_dir = script_dir / 'fixtures'
    
    # Create tester and run tests
    tester = ContractTester(base_url, fixtures_dir)
    success = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
