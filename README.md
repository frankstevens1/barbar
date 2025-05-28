# Monorepo: Expo & Next.js (Separate Web & Mobile UIs)

A Turborepo-powered monorepo using pnpm workspaces to host two frontends—each with its own UI package—to avoid cross-platform dependency conflicts and maintain focused development workflows:

* **`apps/web`**: Next.js App Router with Tailwind CSS v4 and shadcn/ui.
* **`apps/mobile`**: Expo React Native app (no Tailwind)—components bootstrapped from shadcn/ui via script, then refined manually.
* **`packages/ui`**: Web-only UI components (Tailwind CSS v4 + shadcn/ui).
* **`packages/mobile-ui`**: Mobile-only UI components (React Native StyleSheet via generate-rn.zsh).

*Keeping mobile and web UI packages separate is, in my opinion, the best choice: mobile stays mobile, web stays web—avoiding dependency bloat while keeping style tokens aligned through shared scripts.*

---

## 🗂 Directory Overview

```txt
/apps
  ├── mobile       # Expo app consuming packages/mobile-ui
  └── web          # Next.js app consuming packages/ui
/packages
  ├── ui           # Web-only UI components
  ├── mobile-ui    # Mobile-only UI components
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

  * On-demand JIT engine produces only used CSS, plus arbitrary value support for rapid prototyping.
  * Enhanced tree-shaking and reduced bundle size for faster production builds.
  * Rich plugin ecosystem and first‑class dark mode influence generate consistent, themeable designs.

* **Native React Native StyleSheets**

  * Zero runtime overhead: styles compiled to native objects at build time.
  * Predictable performance and memory use on mobile devices.
  * Script-driven scaffolding from shadcn/ui ensures design parity; you then manually polish with VSCode Copilot or your IDE.

* **pnpm & Turborepo**

  * Strict, deduped dependency graph avoids version conflicts across platforms.
  * Incremental caching speeds up installs and builds across all workspaces.

---

## 🔧 Development Workflow

1. **Install all dependencies**

   ```bash
   pnpm install
   ```

2. **Initialize shadcn in Web**

   ```bash
   pnpm --filter=apps/web exec npx shadcn@latest init
   pnpm --filter=apps/web exec npx shadcn add button input alert
   ```

3. **Bootstrap Mobile UI components**

   ```bash
   ./scripts/generate-rn.zsh gpt-4o-mini
   ```

   * Scaffolds `.tsx` in `packages/mobile-ui/src/components` from your web components.
   * **Manually refine**: open in VSCode, use Copilot or your IDE to adjust styles and ensure correctness.

4. **Run your apps**

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

* **Build & Deploy**: configure a GitHub Actions workflow:

  1. Checkout & cache pnpm modules.
  2. Install (`pnpm install`), lint, type-check.
  3. Run `pnpm --filter=apps/web build`.
  4. Use the official `vercel` action or Vercel integration to deploy.

* **Preview URLs**: enable pull request previews for staging feedback.

### Mobile (Expo → App Stores)

* **EAS Build**:

  1. Install `expo-cli` and configure `eas.json` with iOS/Android credentials.
  2. In GitHub Actions:

     * Setup Node & pnpm.
     * Install dependencies.
     * Run `eas build --platform ios --non-interactive` and/or Android.
  3. Upload iOS builds to TestFlight and Android APK/AAB to Google Play using `expo upload` or Fastlane.

* **Versioning & Releases**: bump versions in `app.json`, tag Git commits, and use semantic-release or a custom script to trigger builds.

---
