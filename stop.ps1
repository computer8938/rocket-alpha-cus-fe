#!/usr/bin/env pwsh
param()

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$EnvFile = Join-Path (Split-Path $PSScriptRoot -Parent) "rocket-alpha" ".env"

Write-Host "[rocket-alpha-cus-fe] Stopping customer frontend..." -ForegroundColor Yellow
docker compose -p "rocket-alpha-cus-fe" --env-file "$EnvFile" -f (Join-Path $PSScriptRoot "docker-compose.yml") down --remove-orphans
if ($LASTEXITCODE -ne 0) { throw "Failed to stop rocket-alpha-cus-fe" }
Write-Host "[rocket-alpha-cus-fe] Stopped." -ForegroundColor Green
