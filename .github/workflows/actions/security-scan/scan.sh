#!/bin/bash

echo "Starting security scan..."

trivy fs . --severity HIGH,CRITICAL