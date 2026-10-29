#!/usr/bin/env bash

java -jar openapi-generator-cli.jar generate \
  -i build/swagger.json \
  -g typescript-fetch \
  -o client-sdk
