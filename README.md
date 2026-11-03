# DocuMind AI

DocuMind AI is a SaaS platform for multimodal document, audio and video processing, analysis and content generation.

## Monorepo structure

- `frontend/`: React frontend application and its dedicated documentation.
- `backend/`: NestJS API foundation with Prisma, PostgreSQL and Docker support.
- `docs/`: Product specifications, target architecture and technical documentation.

All components are versioned together in this repository. The project no longer uses Git submodules.

## Clone

```bash
git clone https://github.com/ToavinaJr/documind-ai.git
```

## Getting started

The frontend remains mock-driven while the backend foundation exposes technical health and OpenAPI endpoints. See [`frontend/README.md`](frontend/README.md) and [`backend/README.md`](backend/README.md) for setup and development commands.

## Backend foundation

From the repository root, start the API and PostgreSQL with:

```bash
docker compose up --build
```

The frontend runs on port `3000` and the API on port `3001`.
