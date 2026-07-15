# Storm Atlas

An offline-first Risk of Rain 2 run companion built with React, Vinext, and Cloudflare Workers.

## Current foundation

- Versioned, validated local catalog data in `src/data/items.json`
- Shared repository for catalog search, saved items, builds, and guides
- One device-local active run with item IDs, quantities, checklist, reset, and undo
- Responsive mobile UI and PWA shell that caches the app and bundled item art
- No account, sync, database, D1, or Drizzle dependency

## Development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run validate:catalog
npm run lint
npm test
```

The catalog validator runs as part of every production build. New content must include a unique stable ID, valid scope/status, aliases, a resolvable local icon, and source metadata.
