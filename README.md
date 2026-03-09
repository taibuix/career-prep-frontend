# 🚀 Career Prep Frontend

Frontend for the AI-powered Career Preparation Platform.
https://github.com/buitai97/career-prep-backend

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- ShadCN UI
- Axios

## Live Demo

https://career-prep-frontend.vercel.app/

## Backend API

https://techshop-backend-4g9y.onrender.com/

## CI/CD (EC2)

This repo now includes:
- CI workflow: `.github/workflows/ci.yml`
- CD workflow: `.github/workflows/cd-ec2.yml`

CI runs on `main` and `dev`.
CD runs after CI succeeds on `main` or `dev` via `workflow_run` (or manually via `workflow_dispatch`).

Required GitHub repository secrets:
- `EC2_HOST`
- `EC2_PORT` (usually `22`)
- `EC2_USER`
- `EC2_SSH_PRIVATE_KEY`
- `EC2_APP_DIR` (example: `/home/ubuntu/career-prep-frontend`)
- `FRONTEND_PORT` (optional, default `3000`)

EC2 prerequisites:
- Node.js + npm installed
- PM2 installed
- Frontend repository already cloned at `EC2_APP_DIR`
