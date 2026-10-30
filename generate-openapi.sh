#!/usr/bin/env bash
set -e

npm run tsoa:build

java -jar openapi-generator-cli.jar generate \
  -i build/swagger.json \
  -g typescript-fetch \
  -o client-sdk
