#!/usr/bin/env python3
import argparse
import re
from pathlib import Path

MANIFESTS = {
    "api": ("k8s/api.yaml", "api"),
    "worker": ("k8s/worker.yaml", "worker"),
    "web": ("k8s/web.yaml", "web"),
}

def main():
    parser = argparse.ArgumentParser(description="Update a service image in the GitOps repo.")
    parser.add_argument("--repo", required=True, type=Path)
    parser.add_argument("--service", choices=MANIFESTS, required=True)
    parser.add_argument("--image", required=True)
    parser.add_argument("--tag", required=True)
    args = parser.parse_args()

    relpath, container = MANIFESTS[args.service]
    path = args.repo / relpath
    if not path.exists():
        raise SystemExit(f"Missing expected manifest: {path}")
    text = path.read_text(encoding="utf-8")
    # Match the named container's image line only.
    pattern = re.compile(
        rf"(?ms)(-\s*name:\s*{re.escape(container)}\s*\n(?:[ \t]+[^\n]*\n)*?[ \t]+image:\s*)\S+"
    )
    updated, count = pattern.subn(rf"\g<1>{args.image}:{args.tag}", text, count=1)
    if count != 1:
        raise SystemExit(f"Could not locate image for container '{container}' in {path}")
    path.write_text(updated, encoding="utf-8")
    print(f"Updated {path} to {args.image}:{args.tag}")

if __name__ == "__main__":
    main()
