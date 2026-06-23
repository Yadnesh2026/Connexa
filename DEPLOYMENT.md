# Deployment Guide

This project is split into two deployments:

1. Frontend: Vercel
2. Backend: Render

## Frontend

Deploy the `frontend` folder to Vercel.

Set this environment variable in Vercel:

```env
NEXT_PUBLIC_API_URL=https://your-render-backend-url
```

## Backend

Deploy the `backend` folder to Render as a Web Service.

Required environment variables:

```env
MONGO_URL=your-mongodb-connection-string
CLIENT_URL=https://your-vercel-frontend-url
```

The backend starts with `npm start` and listens on `process.env.PORT`.

## Important note

Profile pictures are currently stored in the backend `uploads` folder. That works for local use, but for long-term production hosting you should move uploads to cloud storage.

## Repo files that already help deployment

- [backend/server.js](./backend/server.js)
- [backend/package.json](./backend/package.json)
- [frontend/app/config/index.jsx](./frontend/app/config/index.jsx)
- [render.yaml](./render.yaml)

