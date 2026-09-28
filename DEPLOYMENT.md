# CreditFlow deployment guide

## 1. Create or choose a writable GitHub repository

The connected GitHub account currently cannot create repositories through the API, so create an empty repository manually at <https://github.com/new>.

Recommended settings:

- Repository name: `jkl-creditflow`
- Visibility: **Private**
- Do not initialize with a README, `.gitignore`, or license

## 2. Push this project

From the project root:

```bash
git remote add github https://github.com/<your-github-username>/jkl-creditflow.git
git push -u github main
```

If a `github` remote already exists, use:

```bash
git remote set-url github https://github.com/<your-github-username>/jkl-creditflow.git
git push -u github main
```

## 3. Import into Vercel

In Vercel, choose **Add New → Project → Import Git Repository**, select `jkl-creditflow`, and use:

| Setting | Value |
| --- | --- |
| Framework preset | Vite |
| Root directory | `.` |
| Install command | `pnpm install --frozen-lockfile` |
| Build command | `pnpm build` |
| Output directory | `dist/public` |

These settings are already stored in [`vercel.json`](./vercel.json).

## 4. Current deployment boundary

The Vercel configuration publishes the CreditFlow frontend and its demo workflow interactions. The fullstack database/auth server remains in the WebDev project because the current Express server is not yet converted into Vercel Functions.

For a production Vercel deployment with live data, the next implementation step is to move the tRPC procedures into Vercel-compatible serverless functions and add the required environment variables:

- `DATABASE_URL`
- `JWT_SECRET`
- `VITE_APP_ID`
- `OAUTH_SERVER_URL`
- `VITE_OAUTH_PORTAL_URL`
- `BUILT_IN_FORGE_API_URL`
- `BUILT_IN_FORGE_API_KEY`

Do not commit `.env` files. Add these values in **Vercel → Project Settings → Environment Variables**.

## 5. Verify after deployment

```bash
pnpm check
pnpm test
pnpm build
```

Then open the Vercel deployment and confirm:

- Overview loads at `/`
- New application modal opens
- Application rows open the detail drawer
- Approve / generate / disburse actions update the local workflow state
- The layout works at mobile width
