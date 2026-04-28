# Lead Module PDF Viewer

Next.js app for viewing PDF files attached to Zoho CRM Leads.

## Setup

```bash
npm install
```

## Environment Variables

None required — Zoho API key is hardcoded in [lib/zoho-config.ts](lib/zoho-config.ts).

## Development

```bash
npm run dev
```

## API Routes

- `GET /api/lead/[recordId]` — fetch lead files from Zoho CRM
- `GET /api/pdf/[recordId]/[fileId]` — download a file attachment

## Key Files

- [lib/zoho-auth.ts](lib/zoho-auth.ts) — Zoho access token retrieval
- [lib/zoho-crm.ts](lib/zoho-crm.ts) — CRM file operations (getLeadFiles, downloadFile)
- [app/lead/[recordId]/page.tsx](app/lead/[recordId]/page.tsx) — lead detail page with PDF viewer
- [components/PdfViewer.tsx](components/PdfViewer.tsx) — PDF viewer component

## Zoho Token Function Response

Create a token endpoint in Zoho crm.
The token endpoint (`zoho-auth.ts` line 2) returns:

```json
{
  "details": {
    "output": "{\"accessToken\": \"1003.xxx\", \"expiresAt\": 1234567890}"
  }
}
```

`output` is a JSON string. Parse it to extract `{ accessToken: string; expiresAt: number }`.
