# React Template for testing

A minimal white dashboard built with React and Vite for testing Git repository integration and DevOps CI/CD.

## Requirements
- Node.js 18 or later
- npm


## Run locally
```bash
npm install
npm run dev
```
Open the localhost URL shown by Vite (normally http://localhost:5174).

## Build for CI/CD
```bash
npm ci
npm run build
```
The production output is generated in `dist/`.

## Push to your DevOps repository
Create an empty repository in your Git hosting service, extract this ZIP, open a terminal in this folder, and run:

```bash
git init
git add .
git commit -m "Initial React sample application"
git branch -M main
git remote add origin <YOUR_REPOSITORY_URL>
git push -u origin main
```

Replace the placeholder with your repository's clone URL. Do not share or commit passwords, access tokens, or other secrets.

## Suggested pipeline
Use a Node.js 18+ agent and run `npm ci` followed by `npm run build`. Configure a later deployment stage to publish the `dist/` folder if required only.
