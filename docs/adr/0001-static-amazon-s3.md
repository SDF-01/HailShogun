# ADR 0001: Static Amazon S3 hosting

## Status

Accepted

## Context

HailShogun remakes the Kadena welcome prototype. The designed site stored newcomer answers behind `/api/profiles`. This project has no AWS credentials yet, and the requested host is Amazon's free tier instead of Vercel. The questionnaire must not require a database, an AI service, or a paid host.

## Decision

Ship a static site: HTML, CSS, JavaScript, and the two prototype images. Host it as an Amazon S3 website in a bucket named `hailshogun`, which produces:

`http://hailshogun.s3-website-us-east-1.amazonaws.com`

Newcomer answers travel inside an `HS1` code that expires after 30 days. The sponsor pastes that code in the browser. The site does not keep a copy.

## Consequences

- The public URL contains HailShogun and stays inside the S3 free tier limits (storage and requests; new accounts get the 12-month free tier).
- The website endpoint is HTTP. HTTPS needs CloudFront or a domain, which is a later step.
- Anyone who has the code can read the answers. The form tells people to share it only with their sponsor and not to enter sensitive details.
- Deploy with `scripts/deploy-s3.ps1` after `aws configure`, or run the manual GitHub Action after repository secrets exist.
