#!/usr/bin/env python3
"""
Link and asset checker for the Easy Fit mockup.

Walks every HTML page and confirms that each relative href/src resolves to a
file that actually exists. Runs locally and in CI before the Pages deploy, so a
broken path can never reach the client.

Usage:  python3 tools/check-links.py
Exit:   0 = all good, 1 = something is missing
"""
from __future__ import annotations

import pathlib
import re
import sys
import urllib.parse

ROOT = pathlib.Path(__file__).resolve().parent.parent

# The six routes the client clicks through, plus the entry page.
PAGES = [
    "index.html",
    "armoury-stainless/index.html",
    "accessories/index.html",
    "accessories/easy-fit/index.html",
    "vehicle/kenworth-k200/index.html",
    "products/aircleaner-panels/index.html",
    "dealers/easy-fit-range/index.html",
]

# Schemes and artefacts that are not local files.
SKIP_PREFIXES = (
    "http://", "https://", "//", "#", "mailto:", "tel:", "data:",
    "javascript:", "chrome-extension:", "${",
)

ATTR = re.compile(r'(?:href|src)="([^"]+)"')


def check_page(rel: str) -> list[str]:
    path = ROOT / rel
    if not path.exists():
        return [f"{rel}: page itself is missing"]

    base = path.parent
    problems: list[str] = []
    seen: set[str] = set()

    html = path.read_text(encoding="utf-8", errors="replace")
    for value in ATTR.findall(html):
        if value.startswith(SKIP_PREFIXES) or value in seen:
            continue
        seen.add(value)

        target = urllib.parse.unquote(value.split("#")[0].split("?")[0])
        if not target:
            continue
        if not (base / target).exists():
            problems.append(f"{rel}: {value}")

    return problems


def main() -> int:
    failures: list[str] = []
    for rel in PAGES:
        found = check_page(rel)
        status = "OK" if not found else f"{len(found)} BROKEN"
        print(f"  {rel:<44} {status}")
        failures.extend(found)

    print()
    if failures:
        print(f"{len(failures)} broken reference(s):")
        for f in failures:
            print(f"  - {f}")
        return 1

    print(f"All local references resolve across {len(PAGES)} pages.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
