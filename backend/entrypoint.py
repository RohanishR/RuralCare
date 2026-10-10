"""Vercel service entry point; preserve the existing backend package imports."""
import sys
import importlib.util
from pathlib import Path
from types import ModuleType

project_root = str(Path(__file__).resolve().parent.parent)
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# Some function bundles flatten the service root. Keep the same package name
# when the archive directory itself is no longer named "backend".
if "backend" not in sys.modules and importlib.util.find_spec("backend") is None:
    package = ModuleType("backend")
    package.__path__ = [str(Path(__file__).resolve().parent)]
    sys.modules["backend"] = package

from backend.main import app  # noqa: E402, F401
