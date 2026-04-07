#!/usr/bin/env pwsh
param()

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

$EnvFile = Join-Path (Split-Path $PSScriptRoot -Parent) "rocket-alpha" ".env"
$NetworkName = "rocket-alpha-net"

docker network inspect "$NetworkName" *> $null
if ($LASTEXITCODE -ne 0) {
    docker network create "$NetworkName" | Out-Null
}

Write-Host "[rocket-alpha-cus-fe] Starting customer frontend..." -ForegroundColor Yellow
docker compose -p "rocket-alpha-cus-fe" --env-file "$EnvFile" -f (Join-Path $PSScriptRoot "docker-compose.yml") up -d --build
if ($LASTEXITCODE -ne 0) { throw "Failed to start rocket-alpha-cus-fe" }
Write-Host "[rocket-alpha-cus-fe] Started." -ForegroundColor Green
Write-Host "  Gateway URL: http://localhost:4760/" -ForegroundColor White
Write-Host "  Dev URL:     http://localhost:4761" -ForegroundColor White
