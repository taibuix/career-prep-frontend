# Career Prep Frontend

Production-ready frontend for the Career Prep platform, built with Next.js App Router. This application helps users prepare for job search success through guided interview practice, resume building, and progress tracking.

## Links

- Live app: `http://3.144.30.109:3000`
- Backend repository: `https://github.com/buitai97/career-prep-backend`

## Core Features

- Authentication flow: register, login, session-aware protected routes
- Dashboard overview with prep progress and weekly tasks
- AI interview practice with session analytics
- Resume builder with structured sections and save/load workflow
- Profile management for personal details

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui components
- Axios for API communication

## Prerequisites

- Node.js 20+
- npm 10+
- A running backend API service

## Getting Started

1. Clone the repository.
2. Install dependencies.
3. Configure environment variables.
4. Start the development server.

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000` by default.

## Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

`NEXT_PUBLIC_API_URL` is used by `src/lib/axios.ts` as the base URL for all frontend API requests.

## Available Scripts

- `npm run dev`: start local development server
- `npm run build`: create production build
- `npm run start`: run production server
- `npm run lint`: run ESLint checks

## Project Structure

```text
src/
	app/
		(auth)/         # login/register flows
		(protected)/    # authenticated app areas
			dashboard/
			interview/
			profile/
			resume/
	components/
		ui/             # shared shadcn-based UI primitives
		layout/         # app shell and sidebar layout
	lib/
		axios.ts        # API client configured with NEXT_PUBLIC_API_URL
```

## Deployment Notes

- CI workflow: `.github/workflows/ci.yml`
- EC2 CD workflow: `.github/workflows/cd-ec2.yml`

Required repository secrets for EC2 deployment:

- `EC2_HOST`
- `EC2_PORT`
- `EC2_USER`
- `EC2_SSH_PRIVATE_KEY`
- `EC2_APP_DIR`
- `FRONTEND_PORT` (optional, default `3000`)

Server prerequisites:

- Node.js and npm installed
- PM2 installed
- Repository cloned at `EC2_APP_DIR`

## License

This project is for portfolio and educational use unless otherwise specified.
