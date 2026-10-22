param(
  [string]$Bucket = "hailshogun",
  [string]$Region = "us-east-1",
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot

if (-not (Get-Command aws -ErrorAction SilentlyContinue)) {
  throw "AWS CLI is not installed. Install AWS CLI v2, run 'aws configure', then run this script again."
}

aws sts get-caller-identity --output text | Out-Null
if ($LASTEXITCODE -ne 0) {
  throw "AWS credentials are not configured. Run 'aws configure' with an account that can use the free tier, then retry."
}

$files = @(
  "index.html",
  "css/styles.css",
  "js/engine.js",
  "js/icons.js",
  "js/app.js",
  "assets/18th-wing.png",
  "assets/okinawa-flight.jpg"
)

Write-Output "Target bucket: $Bucket ($Region)"
Write-Output "Site URL after upload: http://$Bucket.s3-website-$Region.amazonaws.com"
if ($DryRun) {
  $files | ForEach-Object { Write-Output "DRY RUN $_" }
  return
}

$exists = $false
aws s3api head-bucket --bucket $Bucket 2>$null
if ($LASTEXITCODE -eq 0) { $exists = $true }

if (-not $exists) {
  if ($Region -eq "us-east-1") {
    aws s3api create-bucket --bucket $Bucket --region $Region
  } else {
    aws s3api create-bucket --bucket $Bucket --region $Region --create-bucket-configuration LocationConstraint=$Region
  }
  if ($LASTEXITCODE -ne 0) {
    throw "Could not create s3://$Bucket. The name is global. If it is taken, choose another bucket and update the URL."
  }
}

aws s3api put-public-access-block --bucket $Bucket --public-access-block-configuration BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false
aws s3 website "s3://$Bucket" --index-document index.html --error-document index.html

$policy = @"
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadHailShogun",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$Bucket/*"
    }
  ]
}
"@
$policyFile = Join-Path $env:TEMP "hailshogun-bucket-policy.json"
Set-Content -Path $policyFile -Value $policy -Encoding ascii
aws s3api put-bucket-policy --bucket $Bucket --policy "file://$policyFile"
Remove-Item $policyFile

foreach ($relative in $files) {
  $path = Join-Path $root $relative
  if (-not (Test-Path $path)) { throw "Missing site file: $relative" }
  $contentType = switch -Wildcard ($relative) {
    "*.html" { "text/html; charset=utf-8" }
    "*.css" { "text/css; charset=utf-8" }
    "*.js" { "text/javascript; charset=utf-8" }
    "*.png" { "image/png" }
    "*.jpg" { "image/jpeg" }
    default { "application/octet-stream" }
  }
  aws s3 cp $path "s3://$Bucket/$($relative -replace '\\','/')" --content-type $contentType --cache-control "public,max-age=300"
  if ($LASTEXITCODE -ne 0) { throw "Upload failed for $relative" }
}

Write-Output "Deployed: http://$Bucket.s3-website-$Region.amazonaws.com"
