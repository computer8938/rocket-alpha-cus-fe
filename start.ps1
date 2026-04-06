#!/usr/bin/env pwsh
param()

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$EnvFile = Join-Path (Split-Path $PSScriptRoot -Parent) "rocket-alpha" ".env"

Write-Host "[rocket-alpha-cus-fe] Starting customer frontend..." -ForegroundColor Yellow
docker compose -p "rocket-alpha-cus-fe" --env-file "$EnvFile" -f (Join-Path $PSScriptRoot "docker-compose.yml") up -d --build
if ($LASTEXITCODE -ne 0) { throw "Failed to start rocket-alpha-cus-fe" }
Write-Host "[rocket-alpha-cus-fe] Started." -ForegroundColor Green
