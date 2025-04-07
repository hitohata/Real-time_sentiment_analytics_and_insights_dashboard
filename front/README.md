# Dashbord

## Requirement

* Node.js > 22

## Commands

Run local

```bash
npm run dev
```

Build frontend

```bash
npm run build
```

## Generate API Client

The API client is created by [Orval](https://orval.dev/).
To generate a schema, the folowing command:

```bash
npm run generateSchema
```

Before running this command, the test server must have been run.

## Environment Variable

| Name               | Description        |
|:-------------------|:-------------------|
| VITE_BACKEND_URL   | The backend URL    | 
| VITE_WEBSOCKET_URL | The websocket URL  |
