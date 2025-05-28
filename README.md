# Monorepo: Expo & Next.js (Separate Web & Mobile UIs)

A Turborepo-powered monorepo using pnpm workspaces to host two frontends—each with its own UI package—to avoid cross-platform dependency conflicts and maintain focused development workflows:

* **`apps/web`**: Next.js App Router with Tailwind CSS v4 and shadcn/ui (already configured).
* **`apps/mobile`**: Expo React Native app (no Tailwind)—components bootstrapped from shadcn/ui via script, then refined manually.
* **`packages/ui`**: Web-only UI components (Tailwind CSS v4 + shadcn/ui).
* **`packages/mobile-ui`**: Mobile-only UI components (React Native StyleSheet via `generate-app.zsh`).

*Keeping mobile and web UI packages separate avoids dependency bloat while aligning design tokens through shared scripts.*

---

## 🗂 Directory Overview

```txt
/apps
  ├── mobile       # Expo app consuming packages/mobile-ui templates
  └── web          # Next.js app consuming packages/ui templates
/packages
  ├── ui           # Web-only UI components (ready to use)
  ├── mobile-ui    # Mobile-only UI components (scaffolded and refined)
  ├── feature-home # Cross-platform code examples
  ├── eslint-config
  └── typescript-config
pnpm-workspace.yaml
turbo.json
package.json
```

---

## 🚀 Benefits of Our Approach

* **Web with Tailwind CSS v4**

  * On-demand JIT, arbitrary value support, tree-shaking, and rich plugin ecosystem.

* **Native React Native StyleSheets**

  * Zero runtime overhead, predictable performance, and memory use.
  * Script-driven scaffolding for design parity, with manual refinement.

* **pnpm & Turborepo**

  * Strict, deduped dependency graph and incremental caching across workspaces.

---

## 🔧 Development Workflow

1. **Install all dependencies**

   ```bash
   pnpm install
   ```

2. **Scaffold a New App**

   Use the `generate-app.zsh` script in the `scripts/` directory to create a fresh mobile or web app from the built‑in templates:

   ```bash
   # Make the script executable if needed
   chmod +x ./scripts/generate-app.zsh

   # For mobile: you'll be prompted to choose a free Metro port (8080–8089)
   ./scripts/generate-app.zsh mobile ninja
   # Produces a new folder `apps/mobile-ninja` from the `apps/mobile` template.

   # For web: no port selection needed
   ./scripts/generate-app.zsh web ninja
   # Produces a new folder `apps/web-ninja` from the `apps/web` template.
   ```

   **Note:** these templates include only the files and configuration common to *all* apps. For app‑specific changes, update the template in this repository or apply them after scaffolding; you can always re‑scaffold from upstream.

3. **Bootstrap Mobile UI components**

   ```bash
   ./scripts/generate-rn.zsh gpt-4o-mini
   ```

   * Scaffolds `.tsx` files in `packages/mobile-ui/src/components` based on your web components.
   * We plan to train our own transformation model over time—starting with shadcn/ui and extending to other libraries—so treat these outputs as drafts to refine manually with your IDE and Copilot.

4. **Run your apps**

   You can run both apps simultaneously using Turborepo's parallel task execution:

   ```bash
   pnpm run dev   # runs both web and mobile in parallel (turbo run dev --parallel)
   ```

   Or run each individually:

   * **Web**: `pnpm --filter=apps/web dev`
   * **Mobile**: `pnpm --filter=apps/mobile start`

5. **Lint & Type-Check**

   ```bash
   pnpm run lint
   pnpm run check-types
   ```

---

## ⏭ Next Steps: CI/CD & Builds

### Web (Next.js → Vercel)

* Build & Deploy via GitHub Actions or Vercel integration.

### Mobile (Expo → App Stores)

* Configure `eas build`, automate via GitHub Actions, and release via TestFlight/Play Store.
