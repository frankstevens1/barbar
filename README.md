# Monorepo: Expo + Next.js with Shared UI Library

This Turborepo-powered monorepo uses pnpm workspaces to host multiple frontend apps and shared packages:

* **`apps/mobile`**: Expo React Native app using Expo Router and Metro monorepo config.
* **`apps/web`**: Next.js App Router app with shadcn/ui for web components.
* **`packages/ui`**: Web-only UI library (shadcn/ui + Tailwind CSS).
* **`packages/mobile-ui`**: Mobile-only UI library (Nativewind + React Native).
* **`packages/feature-home`**: Example feature package illustrating cross-platform code usage.
* **`packages/eslint-config`, `packages/typescript-config`**: Shared linting and TS configs.

Currently, **UI is split into two packages**—one for web and one for mobile—because a unified Tailwind/Nativenwind solution isn't yet in place. Below are steps to maintain the current setup and guidance toward a single shared UI library in the future.

---

## 📂 Workspace Configuration

> **Note:** No root `tailwind.config.js` is present; each UI package or app configures its own.

---

## 🗂 Directory Overview

```txt
/apps
  ├── mobile       # Expo app (mobile-ui pkg consumed)
  └── web          # Next.js app (ui pkg consumed)
/packages
  ├── ui           # Web-only UI components (shadcn + Tailwind)
  ├── mobile-ui    # Mobile-only UI components (Nativewind)
  ├── feature-home # Cross-platform feature example
  ├── eslint-config
  └── typescript-config
pnpm-workspace.yaml
turbo.json
package.json
```

---

## 🔗 Current UI Packages

### `packages/ui` (Web)

* **package.json** excerpts:

  ```json
  {
    "name": "@workspace/ui",
    "private": true,
    "dependencies": {
      "lucide-react": "^0.475.0",
      "clsx": "^2.1.1",
      "tw-animate-css": "^1.2.4",
      "class-variance-authority": "^0.7.1",
      "zod": "^3.24.2"
    },
    "devDependencies": {
      "tailwindcss": "^4.0.8",
      "@tailwindcss/postcss": "^4.0.8",
      "postcss": "^8.x"
    },
    "exports": {
      "./components/*": "./src/components/*.tsx",
      "./styles/globals.css": "./src/styles/globals.css"
    }
  }
  ```

* **postcss.config.mjs**:

  ```js
  /** @type {import('postcss-load-config').Config} */
  export default { plugins: { '@tailwindcss/postcss': {} } };
  ```

* **components.json** feeds the shadcn CLI:

  ```json
  {
    "tailwind": { "css": "src/styles/globals.css" },
    "aliases": { "@workspace/ui/components": "components" }
  }
  ```

### `packages/mobile-ui` (Mobile)

* **package.json** excerpts:

  ```json
  {
    "name": "@workspace/mobile-ui",
    "private": true,
    "peerDependencies": {
      "react": "*",
      "react-native": "*"
    },
    "devDependencies": {
      "babel-preset-expo": "~13.1.11",
      "nativewind": "^2.x"
    }
  }
  ```

* **babel.config.js** (enables Nativewind plugin later):

  ```js
  module.exports = function(api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      // plugin 'nativewind/babel' will be added
    };
  };
  ```

---

## 🚀 Development Workflow

1. **Install all dependencies**

   ```bash
   pnpm install
   ```

2. **Run locally**

   * **All services**: `pnpm run dev`
   * **Web only**: `pnpm --filter=apps/web dev`
   * **Mobile only**: `pnpm --filter=apps/mobile start`

3. **Lint & type-check**

   ```bash
   pnpm run lint
   pnpm run check-types
   ```

---

## 🎯 Path to a Single Shared UI Library (ai generated)

To converge **`packages/ui`** and **`packages/mobile-ui`** into one cross-platform `packages/ui`, you’ll need to:

1. **Unify Tailwind config** at the root:

   * Create `tailwind.config.js` listing all content paths across web, mobile, and packages.
2. **Install both Tailwind CSS and Nativewind** in `packages/ui`:

   ```bash
   pnpm add -F packages/ui tailwindcss postcss autoprefixer nativewind
   ```

3. **Configure Babel for Nativewind** in both apps and UI package:

   ```js
   // babel.config.js
   plugins: ['nativewind/babel']
   ```

4. **Update Metro** (in `apps/mobile/metro.config.js`) to watch the unified UI package.
5. **Ensure Next.js transpiles the unified package** via `transpilePackages` in `next.config.mjs`.
6. **Migrate existing web-only and mobile-only components** into `packages/ui/src/components`, using platform checks or `.native.tsx` extensions.
7. **Adjust exports and path aliases** to reference the single `@workspace/ui` package everywhere.

Once complete, you can remove `packages/mobile-ui` and consume only `@workspace/ui` in both apps.

---
