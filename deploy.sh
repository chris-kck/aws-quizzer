#!/usr/bin/env bash
set -euo pipefail

# Deploy and run helper for aws-quizzer
# Requires Slack CLI to be installed and logged in: `slack login`

echo "Deploying aws-quizzer manifest and datastores..."
slack deploy --remote

echo "Starting local run (Ctrl+C to stop)..."
slack run
