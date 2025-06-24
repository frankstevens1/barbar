#!/usr/bin/env bash
# --- scripts/cleanup.sh ---
set -euo pipefail

# Items to clean
CLEAN_ITEMS=(node_modules .expo .next .turbo .cache dist build pnpm-lock.yaml)

# ANSI colors
GREEN=$'\e[32m'
RED=$'\e[31m'
RESET=$'\e[0m'

echo "${GREEN}🚨 Cleanup Helper${RESET}"

# Prompt and capture Y/N
ask() {
  local prompt="$1" ans
  read -r -p "$prompt [y/N]: " ans
  [[ $ans =~ ^[Yy]$ ]]
}

# 1️⃣ Dry-run?
if ask "🔍 Dry run only?"; then
  dry_run=true
  echo "${GREEN}Dry-run mode${RESET}"
else
  dry_run=false
fi

# 2️⃣ Remove build/dev dirs & lockfile?
if ask "🧹 Remove build/dev dirs & lockfile?"; then
  for item in "${CLEAN_ITEMS[@]}"; do
    if [[ -e $item ]]; then
      if $dry_run; then
        echo "${GREEN}[DRY] Would remove $item${RESET}"
      else
        rm -rf -- "$item"
        echo "${GREEN}Removed $item${RESET}"
      fi
    fi
  done
else
  echo "${RED}Skipped cleaning artifacts${RESET}"
fi

# 3️⃣ Prune pnpm store?
if ask "🧹 Prune pnpm store?"; then
  if $dry_run; then
    echo "${GREEN}[DRY] Would prune pnpm store${RESET}"
  else
    pnpm store prune
    echo "${GREEN}Pruned pnpm store${RESET}"
  fi
else
  echo "${RED}Skipped pnpm store prune${RESET}"
fi

# 4️⃣ Reinstall dependencies?
if ask "📦 Reinstall dependencies?"; then
  if $dry_run; then
    echo "${GREEN}[DRY] Would run pnpm install${RESET}"
  else
    pnpm install
    echo "${GREEN}Dependencies reinstalled${RESET}"
  fi
else
  echo "${RED}Skipped installing dependencies${RESET}"
fi

echo
echo "${GREEN}✅ Cleanup complete!${RESET}"
