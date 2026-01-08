# EthicProctor - Real-time Student Activity Monitoring

## Project Overview

EthicProctor is a privacy-focused proctoring solution that monitors student activity during exams without compromising their privacy. This application provides real-time monitoring of student activities with risk assessment capabilities.

## Project info

**URL**: https://lovable.dev/projects/44fdf8ce-0475-4b04-af4d-719f2efcf191

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/44fdf8ce-0475-4b04-af4d-719f2efcf191) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Real-time Student Activity Monitoring

This application now includes real-time student activity monitoring with the following features:

- Student data is stored locally instead of in a remote database
- Real-time activity events are captured and stored for each student
- Admin dashboard displays live activity from all students
- Students are "offline" by default until they start a session
- Risk scores are reduced by half to prevent false positives

## How can I deploy this project?

### Prerequisites

1. A cloud server (AWS, Google Cloud, Azure, DigitalOcean, etc.) or hosting platform

### Deployment Steps

1. Deploy using one of the following methods:

**Option 1: Docker Deployment (Recommended)**
```bash
docker-compose up -d
```

**Option 2: Manual Deployment**
```bash
npm ci
npm run build
# Serve the dist folder with your preferred web server
```

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)# APPCOM-main
