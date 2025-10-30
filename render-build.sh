#!/bin/bash
# Backend-only build script for Render deployment
npm install
npx esbuild server/index.production.ts --platform=node --packages=external --bundle --format=esm --outdir=dist
