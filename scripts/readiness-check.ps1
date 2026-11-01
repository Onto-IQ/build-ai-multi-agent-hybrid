# Homework readiness check for Windows PowerShell.
# From the course repo:
#   powershell -ExecutionPolicy Bypass -File scripts/readiness-check.ps1
# Repo shape only (no Claude / OpenCode / workshop):
#   powershell -ExecutionPolicy Bypass -File scripts/readiness-check.ps1 -CourseFiles

param(
  [switch]$CourseFiles,
  [switch]$SkipClaude,
  [switch]$SkipOpencode,
  [switch]$SkipOpenrouter,
  [switch]$SkipWorkshop
)

$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)

$nodeArgs = @('scripts/verify-setup.mjs')
if ($CourseFiles) { $nodeArgs += '--course-files' }
if ($SkipClaude) { $nodeArgs += '--skip-claude' }
if ($SkipOpencode) { $nodeArgs += '--skip-opencode' }
if ($SkipOpenrouter) { $nodeArgs += '--skip-openrouter' }
if ($SkipWorkshop) { $nodeArgs += '--skip-workshop' }

& node @nodeArgs
exit $LASTEXITCODE
