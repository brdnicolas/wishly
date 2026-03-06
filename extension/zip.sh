#!/bin/bash
cd "$(dirname "$0")"
rm -f envly-extension.zip
zip -r envly-extension.zip . -x "zip.sh" "envly-extension.zip"
echo "✓ envly-extension.zip créé"
