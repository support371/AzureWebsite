# Dev Starter: Next.js (Vercel) + Azure Functions (API)

## Prereqs
- Node 18+
- Azure Functions Core Tools (`func`)
- (Optional) Azurite if you want local storage emulation

## Frontend (Next.js)
```bash
cd apps/web
cp .env.local.example .env.local
npm i
npm run dev
```

## Backend (Azure Functions)
```bash
cd apps/api
cp local.settings.json.example local.settings.json
npm i
npm run start
```

## Verify
	•	Web: http://localhost:3000
	•	API: http://localhost:7071/api/hello

---

## 6) Quick start commands (copy/paste)

```bash
# Frontend
cd apps/web
cp .env.local.example .env.local
npm i
npm run dev

# Backend
cd apps/api
cp local.settings.json.example local.settings.json
npm i
npm run start
```
