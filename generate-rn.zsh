#!/usr/bin/env zsh
# generate-rn.zsh — Transform ShadCN UI → React Native via OpenAI (gpt-4o-mini)

echo "🚀 Starting generate-rn.zsh..."

set -euo pipefail
setopt nullglob

# —— CONFIG ——
SRC_DIR="packages/ui/src/components"
TGT_DIR="packages/mobile-ui/src/components"
MODEL="${1:-gpt-4o-mini}"
LOG_DIR="./logs"

# —— HELP ——
if [[ "${1:-}" == "-h" ]]; then
  cat <<EOF
Usage: $0 [model]
  model: the OpenAI model to use (default: $MODEL)
  Logs: $LOG_DIR/raw-<component>.json, content-<component>.txt, gated-<component>.tsx
EOF
  exit 0
fi

# —— PREPARE DIRECTORIES ——
echo "🔍 Checking directories..."
[[ -d $SRC_DIR ]] || { echo "❌ Source dir not found: $SRC_DIR"; exit 1 }
mkdir -p "$TGT_DIR" "$LOG_DIR"
echo "✅ Directories ready: $SRC_DIR, $TGT_DIR, $LOG_DIR"

# —— REQUIREMENTS ——
echo "🔍 Verifying requirements..."
command -v curl >/dev/null 2>&1 || { echo "❌ curl is required"; exit 1 }
command -v jq   >/dev/null 2>&1 || { echo "❌ jq is required"; exit 1 }
echo "✅ curl and jq available"

# —— API KEY ——
echo "🔍 Checking API key..."
if [[ -z "${OPENAI_API_KEY:-}" ]]; then
  echo -n "Enter your OpenAI API key: "
  stty -echo; read API_KEY_INPUT; stty echo; echo
  [[ -n "$API_KEY_INPUT" ]] || { echo "❌ No key entered"; exit 1 }
  export OPENAI_API_KEY="$API_KEY_INPUT"
fi

echo "✅ API key is set"

# —— PROMPTS ——
echo "🔍 Preparing prompts..."
SYS_PROMPT=$(cat <<'EOF'
You are a code transformer that converts ShadCN UI React components (using Tailwind + CVA) into native React Native TSX components. Your output must:
- Use appropriate React Native core components (e.g., Pressable, Text, View, Image) to match functionality
- Create a StyleSheet object organizing base styles, variants, and sizes
- Pull design tokens from lightTokens/darkTokens
- Strip out all Tailwind utilities (no className or cn calls) and express styles only as RN StyleSheet objects
- Return only the TSX (no markdown, commentary, or extra text), wrapped between <<<TSX>>> and <<<END_TSX>>> markers.
EOF
)

# Mapping hints: common Tailwind→RN mappings and RN alternatives
MAP_PROMPT=$(cat <<'EOF'
Mapping hints:
- rounded-full            → { borderRadius: 9999 }
- overflow-hidden         → { overflow: 'hidden' }
- flex items-center justify-center → { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }
- px-4 py-2               → { paddingHorizontal: 16, paddingVertical: 8 }
- h-8 w-8                 → { height: 32, width: 32 }
- aspect-square           → { aspectRatio: 1 }
- bg-primary              → { backgroundColor: tokens.primary }
- text-primary-foreground → { color: tokens.primaryForeground }
- size-full               → { width: '100%', height: '100%' }
- Use <Image> for image slots and <View> for layout wrappers
EOF
)

EXAMPLE_PROMPT=$(cat <<'EOF'
/// Example Input:

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@workspace/ui/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

/// Example Output:

import React, { useMemo } from 'react';
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
  PressableStateCallbackType,
  useColorScheme
} from 'react-native';
import { lightTokens, darkTokens } from '../lib/tokens';

// Map tokens per theme
const Colors = { light: lightTokens, dark: darkTokens };

export type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps extends React.ComponentPropsWithoutRef<typeof Pressable> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

export const Button = React.forwardRef<View, ButtonProps>(
  (
    { variant = 'default', size = 'default', style, children, ...props },
    ref
  ) => {
    const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
    const tokens = Colors[scheme];
    const styles = useMemo(() => createStyles(tokens), [tokens]);

    const getButtonStyle = (
      state: PressableStateCallbackType
    ): StyleProp<ViewStyle> => {
      const baseStyles: StyleProp<ViewStyle>[] = [
        styles.baseButton,
        styles.variants[variant].container,
        styles.sizes[size].container,
        props.disabled && styles.disabled
      ];
      if (typeof style === 'function') {
        baseStyles.push(style(state));
      } else if (style) {
        baseStyles.push(style as StyleProp<ViewStyle>);
      }
      return baseStyles;
    };

    const getTextStyle = (): StyleProp<TextStyle> => [
      styles.sizes[size].text,
      styles.variants[variant].text
    ];

    return (
      <Pressable
        ref={ref}
        style={getButtonStyle}
        accessibilityRole="button"
        {...props}
      >
        <Text style={getTextStyle()}>{children}</Text>
      </Pressable>
    );
  }
);

Button.displayName = 'Button';

const createStyles = (tokens: typeof lightTokens) => {
  // Base styles
  const base = StyleSheet.create({
    baseButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: parseFloat(tokens.radius) * 16,
      overflow: 'hidden'
    } as ViewStyle,
    disabled: {
      opacity: 0.5
    } as ViewStyle
  });

  // Variant containers & text
  const variants: Record<ButtonVariant, { container: ViewStyle; text: TextStyle }> = {
    default: {
      container: { backgroundColor: tokens.primary } as ViewStyle,
      text: { color: tokens.primaryForeground } as TextStyle
    },
    destructive: {
      container: { backgroundColor: tokens.destructive } as ViewStyle,
      text: { color: tokens.destructiveForeground } as TextStyle
    },
    outline: {
      container: {
        backgroundColor: tokens.background,
        borderWidth: 1,
        borderColor: tokens.border
      } as ViewStyle,
      text: { color: tokens.accentForeground } as TextStyle
    },
    secondary: {
      container: { backgroundColor: tokens.secondary } as ViewStyle,
      text: { color: tokens.secondaryForeground } as TextStyle
    },
    ghost: {
      container: { backgroundColor: 'transparent' } as ViewStyle,
      text: { color: tokens.accentForeground } as TextStyle
    },
    link: {
      container: { backgroundColor: 'transparent' } as ViewStyle,
      text: {
        color: tokens.primary,
        textDecorationLine: 'underline'
      } as TextStyle
    }
  };

  // Size containers & text
  const sizes: Record<ButtonSize, { container: ViewStyle; text: TextStyle }> = {
    default: {
      container: {
        height: 40,
        paddingHorizontal: 16,
        paddingVertical: 8
      } as ViewStyle,
      text: {
        fontSize: 14,
        fontWeight: '500'
      } as TextStyle
    },
    sm: {
      container: {
        height: 36,
        paddingHorizontal: 12,
        paddingVertical: 6
      } as ViewStyle,
      text: {
        fontSize: 14,
        fontWeight: '500'
      } as TextStyle
    },
    lg: {
      container: {
        height: 44,
        paddingHorizontal: 32,
        paddingVertical: 10
      } as ViewStyle,
      text: {
        fontSize: 18,
        fontWeight: '500'
      } as TextStyle
    },
    icon: {
      container: {
        height: 40,
        width: 40,
        padding: 0
      } as ViewStyle,
      text: {
        fontSize: 0
      } as TextStyle
    }
  };

  return {
    baseButton: base.baseButton,
    disabled: base.disabled,
    variants,
    sizes
  };
};
EOF
)
echo "✅ Example prompt prepared"

# —— SELECT COMPONENT ——
echo "\n📋 Available ShadCN components:"
typeset -a files targets
files=("$SRC_DIR"/*.tsx)
num_files=${#files[@]}
for (( i=1; i<=num_files; i++ )); do
  printf "  %2d) %s\n" $i "${files[i]}"
done
printf "   a) All  q) Quit\n"

while true; do
  echo -n "Choice (number,a,q): "
  read choice
  if [[ $choice =~ ^[0-9]+$ ]] && (( choice>=1 && choice<=num_files )); then
    targets=("${files[choice]}")
    break
  elif [[ $choice == a ]]; then
    targets=("${files[@]}")
    break
  elif [[ $choice == q ]]; then
    echo "Goodbye"; exit 0
  else
    echo "Invalid choice";
  fi
done

echo "✅ Selected ${#targets[@]} component(s)"

# —— TRANSFORM LOOP ——
for file in "${targets[@]}"; do
  base=$(basename "$file" .tsx)
  out="$TGT_DIR/${base}.tsx"
  raw="$LOG_DIR/raw-${base}.json"
  content="$LOG_DIR/content-${base}.txt"
  gated="$LOG_DIR/gated-${base}.tsx"

  echo "\n🔄 Converting ${base}.tsx..."
    # Load the component file as raw text, preserving newlines
  # Use jq --rawfile to include it safely
  payload=$(jq -n \
    --arg model "$MODEL" \
    --arg sys "$SYS_PROMPT" \
    --arg map "$MAP_PROMPT" \
    --arg ex "$EXAMPLE_PROMPT" \
    --rawfile input "$file" \
    '{model:$model,messages:[
      {role:"system",content:$sys},
      {role:"user",content:$ex},
      {role:"user",content:$input}
    ]}')
  # Send the request
  curl -s https://api.openai.com/v1/chat/completions \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -H "Content-Type: application/json" \
    -d "$payload" > "$raw"

  echo "🔎 Raw response logged to $raw"
  jq -r '.choices[0].message.content' "$raw" > "$content"
  echo "🔎 Chat content logged to $content"

  # extract TSX between gates or fallback
  if grep -q '^<<<TSX>>>' "$content"; then
    sed -n '/^<<<TSX>>>$/,/^<<<END_TSX>>>$/p' "$content" | sed '1d;$d' > "$gated"
  else
    cp "$content" "$gated"
  fi

  if [[ ! -s "$gated" ]]; then
    echo "❌ No TSX output found"; cat "$content"; continue
  fi

  echo "--- Preview of ${base}.tsx ---"
  { head -n3 "$gated"; echo "   ..."; tail -n3 "$gated"; } | sed 's/^/    /'
  echo "--- End Preview ---"

  echo -n "Write to $out? [y/N]: "
  read ans
  if [[ $ans =~ ^[Yy]$ ]]; then mv "$gated" "$out" && echo "✅ Wrote $out"; else echo "⚠️ Skipped"; fi
done

echo "
🎉 All done!"
echo "🧹 Cleaning up logs directory..."
rm -rf "$LOG_DIR"/*
echo "✅ Logs cleared."