#!/usr/bin/env python3
"""
Test file for AI Security Analysis demonstration.

This file is used to demonstrate different security scenarios.
Modify this file to show how AI detects vulnerabilities.
"""

def safe_function():
    """Safe function without vulnerabilities."""
    print("This is a safe function")
    return True


def process_data(data):
    """Process data safely."""
    if not data:
        return None
    
    # Safe data processing
    result = data.strip().lower()
    return result


if __name__ == "__main__":
    safe_function()
    print("Test completed successfully")
