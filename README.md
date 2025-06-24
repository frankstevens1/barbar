# 🚀 Monorepo Workflow: Expo & Next.js

Welcome to our Turborepo-powered monorepo! Here you’ll find:

- **Web**: Next.js app in `apps/web`
- **Mobile**: Expo React Native app in `apps/mobile`
- **UI Packages**: Shared components in `packages/ui` (web) and `packages/mobile-ui` (mobile)

---

## 📂 Directory Structure

```txt
/ (root)
├── apps
│   ├── web         # Next.js App Router (uses packages/ui)
│   └── mobile      # Expo React Native (uses packages/mobile-ui)
├── packages
│   ├── ui          # Web UI (Tailwind + shadcn/ui)
│   ├── mobile-ui   # Mobile UI (RN StyleSheet)
│   ├── feature-…   # Shared code (optional)
│   ├── eslint-config
│   └── typescript-config
├── pnpm-workspace.yaml
├── turbo.json
└── package.json    # Root scripts & workspace settings
````

---

## ⚙️ Setup & Development

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **(Optional) Scaffold new apps**

   ```bash
   ./scripts/generate-app.zsh [web|mobile]
   ```

3. **(Optional) Generate mobile UI components**

   ```bash
   ./scripts/generate-rn.zsh
   ```

4. **Start development servers**

    **Web** (from root or `apps/web`):

     ```bash
     pnpm run dev:web
     ```

    **Mobile** (from root):

     ```bash
     # iOS
     pnpm run dev:mobile:ios
     # Android
     pnpm run dev:mobile:android
     ```

     Or **inside** `apps/mobile`:

     ```bash
     pnpm start:ios
     pnpm start:android
     ```

5. **Lint & Type-check**

   ```bash
   pnpm lint
   pnpm turbo run check-types
   ```

---

## 🛠️ Root Scripts

- `pnpm build`
  Run `turbo build` for **all** workspaces.
- `pnpm build:web`
  Build the Next.js app (`apps/web`).
- `pnpm build:mobile`
  Trigger EAS production build for Expo (`apps/mobile`).
- `pnpm run dev:web`
  Start Next.js development server (web).
- `pnpm run dev:mobile:android` / `pnpm run dev:mobile:ios`
  Launch Expo on Android or iOS, respectively.
- `pnpm lint`
  Lint all packages (via Turbo).
- `pnpm format`
  Format code with Prettier.

---

## 📱 App-level Scripts

### Web (`apps/web`)

- `pnpm run dev`
- `pnpm run build`
- `pnpm run start`
- `pnpm run lint`

### Mobile (`apps/mobile`)

- `pnpm run start` (Metro bundler UI)
- `pnpm run start:android`
- `pnpm run start:ios`
- `pnpm run lint`

---

## 🚀 CI/CD & Deployment

- **Web**: Deploy via Vercel or GitHub Actions.
- **Mobile**: Use EAS (config in `apps/mobile/eas.json`) in CI for building and submitting to stores.

Happy coding! 🎉
