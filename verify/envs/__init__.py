"""Verification environments. The code under test is in src/; make it importable as `refunds`."""
import sys
from pathlib import Path

_SRC = str(Path(__file__).resolve().parents[2] / "src")
if _SRC not in sys.path:
    sys.path.insert(0, _SRC)
