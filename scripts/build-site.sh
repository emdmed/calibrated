#!/usr/bin/env sh
# Assemble the public site in dist/: the demo pages at the root and the kit
# assets under skills/, so the pages' ../skills/... links resolve unchanged.
set -eu
cd "$(dirname "$0")/.."
rm -rf dist
mkdir -p dist
cp demo/*.html dist/
for dir in skills/*/assets; do
  mkdir -p "dist/$dir"
  cp -R "$dir/." "dist/$dir/"
done
