# Project connections

- Repository: https://github.com/SDF-01/HailShogun
- Default branch: main
- Hosting provider: Amazon S3 static website (free tier)
- Intended production URL: http://hailshogun.s3-website-us-east-1.amazonaws.com
- Production status: not deployed. This machine has no AWS CLI credentials.
- Preview URL: none
- Deploy command: `powershell -File scripts/deploy-s3.ps1`
- Manual GitHub deploy: Actions workflow "Deploy HailShogun to Amazon S3" (`workflow_dispatch`)
- Required GitHub secrets before that workflow can succeed: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
- Optional GitHub variables: `AWS_REGION` (default us-east-1), `S3_BUCKET` (default hailshogun)
- Protected files: do not commit `.env`, AWS keys, or credentials
- Not used: Vercel
