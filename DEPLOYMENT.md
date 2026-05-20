# Deployment

## Branches

- `develop`: preview/staging checks and deploy hooks.
- `main`: production checks and deploy hooks.

Both branches run CI for backend and frontend before deploy hooks are triggered.

## Backend on Render

Use the root `render.yaml` blueprint or create a Render Web Service manually:

- Root directory: `backend`
- Runtime: Docker
- Dockerfile: `backend/Dockerfile`
- Health check path: `/health`

Required environment variables:

- `DATABASE_URL`
- `JWT_SECRET`
- `FRONTEND_URL`
- `CLOUDINARY_URL`
- `CLOUDINARY_FOLDER` optional
- `PORT=5000`

For deploy hooks, add these GitHub repository secrets:

- `RENDER_DEPLOY_HOOK_DEVELOP`
- `RENDER_DEPLOY_HOOK_MAIN`

## Frontend on Vercel

Create the Vercel project from the `frontend` directory.

Required environment variable:

- `NEXT_PUBLIC_BACKEND_URL`
- `NEXT_PUBLIC_CLOUDINARY_FOLDER` optional

For deploy hooks, add these GitHub repository secrets:

- `VERCEL_DEPLOY_HOOK_DEVELOP`
- `VERCEL_DEPLOY_HOOK_MAIN`

Set `NEXT_PUBLIC_BACKEND_URL` to the matching Render backend URL for the branch/environment.
