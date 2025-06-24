# Monorepo Workflow: Expo & Next.js

A Turborepo + pnpm monorepo hosting two frontends—Next.js for web and Expo for mobile—with separate UI packages to avoid cross‑platform dependency conflicts.

---

## Directory Layout

```txt
/ (repo root)
├── apps
│   ├── web         # Next.js App Router (uses packages/ui)
│   └── mobile      # Expo React Native (uses packages/mobile-ui)
├── packages
│   ├── ui          # Web-only UI components (Tailwind v4 + shadcn/ui)
│   ├── mobile-ui   # Mobile-only UI components (React Native StyleSheet)
│   ├── feature-... # Shared feature code (optional)
│   ├── eslint-config
│   └── typescript-config
├── pnpm-workspace.yaml
├── turbo.json
└── package.json    # root, defines workspace scripts
```

---

## Key Benefits

* **Next.js Web (apps/web)**

  * Tailwind CSS v4 JIT, arbitrary values, plugin ecosystem
  * shadcn/ui components in `packages/ui`
* **Expo Mobile (apps/mobile)**

  * React Native StyleSheets for zero-runtime-overhead
  * Scaffolded UI in `packages/mobile-ui`, refined manually
* **Monorepo Tooling**

  * `pnpm` workspaces with strict, deduped deps
  * `turbo` caching & parallelism for fast builds

---

## Root Scripts

* **build**: Run `turbo build` for all packages
* **build\:web**: Build only the Next.js app (`apps/web`)
* **build\:mobile**: Trigger EAS production build in `apps/mobile`
* **dev** / **dev\:web**: Start the Next.js dev server via Turbo
* **dev\:mobile\:android**: Launch Expo on Android (`--android --tunnel`)
* **dev\:mobile\:ios**: Launch Expo on iOS (`--ios --tunnel`)
* **dev\:mobile**: Run both Android and iOS Expo targets in parallel
* **lint**: Run `turbo lint` across workspaces
* **format**: Format code with Prettier

## App-level Scripts

* **Web (`apps/web`)**: default Next.js commands (`dev`, `build`, `start`, `lint`)
* **Mobile (`apps/mobile`)**: Expo commands (`start`, `start:android`, `start:ios`, `lint`)

## Development Workflow

Follow these steps to start working:

1. **Install dependencies**: Run `pnpm install` at the repo root.
2. **Scaffold apps (optional)**: Use `./scripts/generate-app.zsh` to create new web or mobile apps from templates.
3. **Generate mobile UI**: Execute `./scripts/generate-rn.zsh` to scaffold React Native components based on web UI.
4. **Start dev servers** in separate terminals:

   * **Web only**: `pnpm dev:web` in one terminal
   * **Mobile only**: `pnpm dev:mobile` in another terminal
   * **Both platforms**: open two terminals and run `pnpm dev:web` and `pnpm dev:mobile` respectively
5. **Lint and type-check**: Run `pnpm lint` and `pnpm turbo run check-types` to validate code quality.

## CI/CD & Deployment

* **Web**: Deploy Next.js via Vercel or GitHub Actions.
* **Mobile**: Use EAS (`apps/mobile/eas.json`) in your CI pipeline to build & submit to stores.

---

*End of workflow guide.*
