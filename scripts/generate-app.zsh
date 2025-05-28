#!/usr/bin/env zsh
# generate-app.zsh — Scaffold a new mobile or web app from templates with custom Metro port for mobile

set -euo pipefail
setopt nullglob

# —— HELP ——
function show_help() {
  cat <<EOF
Usage: $0 <mobile|web> <app-name>

  <mobile|web>   Type of app to generate (mobile or web)
  <app-name>     Base application name (without prefix)

Examples:
  $0 mobile ninja    # prompts for a free port and generates mobile-ninja
  $0 web ninja       # generates web-ninja
EOF
  exit 0
}

# —— ARGS ——
if [[ "${1:-}" == "-h" || $# -lt 2 ]]; then
  show_help
fi

TYPE=${1}
BASE_NAME=${2}

if [[ "$TYPE" != "mobile" && "$TYPE" != "web" ]]; then
  echo "❌ Invalid type: $TYPE"
  show_help
fi

# Always prefix with type-
APP_NAME="${TYPE}-${BASE_NAME}"

echo "🔍 Generating $TYPE app: $APP_NAME"

# —— PATHS ——
TEMPLATE_DIR="apps/$TYPE"
TARGET_DIR="apps/$APP_NAME"

# —— VERIFY REQUIREMENTS ——
echo "🔍 Verifying requirements..."
command -v jq >/dev/null 2>&1 || { echo "❌ jq is required"; exit 1 }
echo "✅ jq available"

# —— CHECK TEMPLATE ——
echo "🔍 Checking template directory: $TEMPLATE_DIR"
[[ -d "$TEMPLATE_DIR" ]] || { echo "❌ Template not found: $TEMPLATE_DIR"; exit 1 }
echo "✅ Template found"

# —— PORT PROMPT FOR MOBILE ——
if [[ "$TYPE" == "mobile" ]]; then
  echo "🔍 Please choose a Metro port (8081–8089) that is not in use."
  while true; do
    # Prompt user (zsh-compatible)
    echo -n "Port: "; read PORT

    if ! [[ $PORT =~ ^808[1-9]$ ]]; then
      echo "⚠️  Invalid port format. Must be 8081–8089."
      continue
    fi
    if command -v lsof >/dev/null 2>&1; then
      if lsof -iTCP:$PORT -sTCP:LISTEN >/dev/null 2>&1; then
        echo "⚠️  Port $PORT is already in use. Choose another."
        continue
      fi
    else
      echo "⚠️  Cannot verify port usage automatically (lsof not available)."
    fi
    break
  done
  echo "✅ Selected free Metro port: $PORT"
fi

# —— CREATE TARGET ——
echo "🔍 Creating: $TARGET_DIR"
[[ -e "$TARGET_DIR" ]] && { echo "❌ Target exists: $TARGET_DIR"; exit 1 }
mkdir -p "$TARGET_DIR"
echo "✅ Target ready"

# —— FILES TO COPY ——
if [[ "$TYPE" == "mobile" ]]; then
  files=(
    app components assets hooks
    app.json eas.json expo-env.d.ts metro.config.js
    package.json tsconfig.json
  )
else
  files=(
    app components lib hooks public
    components.json middleware.ts next-env-d.ts
    next.config.mjs eslint.config.js postcss.config.mjs
    package.json tsconfig.json
  )
fi

# —— COPY FILES ——
echo "🔍 Copying template files..."
for f in "${files[@]}"; do
  src="$TEMPLATE_DIR/$f"
  dest="$TARGET_DIR/$f"
  if [[ -e "$src" ]]; then
    cp -R "$src" "$dest"
    echo "  Copied: $f"
  else
    echo "  ⚠️ Missing: $f"
  fi
done

echo "✅ Files copied"

# —— UPDATE PACKAGE.JSON ——
PKG="$TARGET_DIR/package.json"
echo "🔍 Setting package name: $APP_NAME"
jq ".name = \"$APP_NAME\"" "$PKG" > "$PKG.tmp" && mv "$PKG.tmp" "$PKG"

# Adjust scripts for mobile port
if [[ "$TYPE" == "mobile" ]]; then
  echo "🔍 Adjusting mobile scripts to port $PORT"
  jq \
    ".scripts.dev = \"expo start --port $PORT\" | \
     .scripts.start = \"expo start --port $PORT\" | \
     .scripts.web = \"expo start --web --port $PORT\"" \
    "$PKG" > "$PKG.tmp" && mv "$PKG.tmp" "$PKG"
fi

echo "✅ package.json updated"

# —— MOBILE: UPDATE app.json ——
if [[ "$TYPE" == "mobile" ]]; then
  AJSON="$TARGET_DIR/app.json"
  echo "🔍 Updating app.json name & slug to $APP_NAME"
  jq \
    ".expo.name = \"$APP_NAME\" | .expo.slug = \"$APP_NAME\"" \
    "$AJSON" > "$AJSON.tmp" && mv "$AJSON.tmp" "$AJSON"
  echo "✅ app.json updated"
fi

# —— DONE ——
echo "🎉 Scaffolded $TYPE app: $TARGET_DIR"
echo "Next steps:"
echo "  cd $TARGET_DIR"
echo "  npm install"
if [[ "$TYPE" == "mobile" ]]; then
  echo "  npm run dev   # starts Metro on port $PORT"
else
  echo "  npm run dev   # starts Next.js"
fi