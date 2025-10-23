# AI CRM Platform (Local Run Instructions)

This workspace contains a single large React component `src/app.jsx`. Follow these steps on Windows PowerShell to run the app locally.

Prerequisites
- Node.js 18+ and npm

Install dependencies

```powershell
cd "c:\Users\Shubham\Desktop\CODE\HACKATHON\bput 2025"
npm install
```

Run dev server

```powershell
npm run dev
```

Open the URL printed by Vite (usually http://localhost:5173) in your browser.

Notes
- The UI uses Tailwind-like class names but the project currently doesn't integrate Tailwind; styles will be minimal unless you add Tailwind.
- `lucide-react` is used for icons (already added to dependencies).
- If you want Tailwind, I can add a minimal Tailwind + PostCSS + Vite setup next.

n8n webhook integration

- To have the "New Campaign" button trigger your local n8n workflow, set an environment variable named `VITE_N8N_TRIGGER_URL` to the ngrok webhook URL for the n8n webhook node (the webhook should accept POST JSON).

Example (PowerShell):

```powershell
# replace <your-ngrok-url> with the https URL ngrok gives you, and /webhook/path with the path n8n shows
$env:VITE_N8N_TRIGGER_URL = 'https://abcd-1234.ngrok.io/webhook/campaign-trigger'
npm run dev
```

Notes:
- The front-end will POST a small JSON payload with campaign info to the webhook URL when you create a campaign.
- For production or long-running development, prefer placing `VITE_N8N_TRIGGER_URL` into a `.env` file at project root like `VITE_N8N_TRIGGER_URL=https://...` and restart the dev server.
- If the env var is missing, the app will still create campaigns locally but skip calling n8n.
