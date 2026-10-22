# HailShogun

Static remake of the Kadena welcome prototype for inbound U.S. Air Force personnel. The repository and the Amazon site name are HailShogun. The page itself stays Kadena Welcome.

This is an independent concept. It is not an official U.S. Air Force website. Official photos and links do not imply endorsement.

## What it does

- Adaptive newcomer questions, with follow-ups only when an earlier answer calls for them.
- Deterministic resource matching against public Kadena and Okinawa starting points.
- A sponsor draft email that a person reviews before anything is shared.
- A 30-day handoff code. The code carries the answers. The site does not store them.

Use fictional names while testing. Do not enter orders, contact details, dependent identities, medical information, or other sensitive data.

## Run locally

```powershell
npm test
python -m http.server 4173
```

Open `http://127.0.0.1:4173`.

## Amazon hosting

The site is plain files, so it can sit in a public S3 bucket on the AWS free tier. After you install the AWS CLI and run `aws configure`:

```powershell
powershell -File scripts/deploy-s3.ps1 -DryRun
powershell -File scripts/deploy-s3.ps1
```

Intended URL:

`http://hailshogun.s3-website-us-east-1.amazonaws.com`

S3 website hosting is HTTP. A CloudFront distribution can add HTTPS later; that address would be a `cloudfront.net` hostname unless you attach a domain you own.

The free tier covers a modest amount of storage and requests for 12 months on new AWS accounts. After that, a site this size usually costs cents, not a Vercel plan, but it is not a promise of zero dollars forever.

GitHub Actions can upload the same files. Add `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` as repository secrets, then run the "Deploy HailShogun to Amazon S3" workflow by hand.

## Assets

Both images from the prototype are in `assets/` and are used on the page:

- `18th-wing.png`: header, footer, and credits. Wikimedia Commons reproduction of U.S. Air Force artwork.
- `okinawa-flight.jpg`: hero and credits. U.S. Air Force photo by Staff Sgt. Jessi Roth, 2023, via DVIDS.

Credits and source links are on the Asset credits page.

## Handoff codes

`HS1` codes are readable by anyone who has them. They expire 30 days after creation. There is no account and no server copy. Share a code only with the assigned sponsor.
