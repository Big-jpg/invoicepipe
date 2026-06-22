#!/bin/bash
# ============================================================================
# dev_run.sh - One-command local dev environment
# ============================================================================
# This script:
# - Creates a Python virtualenv (if not present)
# - Installs dependencies from requirements.txt
# - Loads environment from .ocr.dev.env
# - Starts uvicorn app.main:app --host 0.0.0.0 --port 8000
# ============================================================================

set -e

# Determine the project root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
VENV_DIR="$PROJECT_ROOT/venv"

echo "============================================================================"
echo "🚀 Contoso Invoice OCR - Local DEV Environment"
echo "============================================================================"
echo ""

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: python3 is not installed"
    echo "👉 Please install Python 3.8 or later"
    exit 1
fi

# Create virtualenv if it doesn't exist
if [ ! -d "$VENV_DIR" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv "$VENV_DIR"
    echo "✅ Virtual environment created at $VENV_DIR"
else
    echo "✅ Virtual environment already exists at $VENV_DIR"
fi

# Activate virtualenv
echo "🔌 Activating virtual environment..."
source "$VENV_DIR/bin/activate"

# Install/upgrade dependencies
echo "📥 Installing dependencies from requirements.txt..."
pip install --upgrade pip -q
pip install -r "$PROJECT_ROOT/requirements.txt" -q
echo "✅ Dependencies installed"

# Load environment variables
echo ""
echo "📂 Loading DEV environment configuration..."
source "$PROJECT_ROOT/scripts/load_env_dev.sh"

# Check if load was successful
if [ $? -ne 0 ]; then
    echo "❌ Failed to load environment configuration"
    exit 1
fi

# Start the FastAPI application
echo ""
echo "============================================================================"
echo "🎯 Starting FastAPI application..."
echo "============================================================================"
echo ""
echo "📍 API will be available at: http://localhost:8000"
echo "📖 API docs will be available at: http://localhost:8000/docs"
echo "📊 Health check: http://localhost:8000/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

cd "$PROJECT_ROOT"
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
