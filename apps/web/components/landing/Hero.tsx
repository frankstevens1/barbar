// app/components/Hero.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useMotionValue } from "framer-motion"
import { v4 as uuidv4 } from "uuid"
import { Line, NamedSilhouette, PRESET_SILHOUETTES } from "../../lib/silhouettes"

// helper to stringify coords
const lineKey = (l: Omit<Line, "id">) => `${l.x1},${l.y1}-${l.x2},${l.y2}`

// pick a random preset (not equal to `excludeName`)
function pickPreset(excludeName?: string): NamedSilhouette {
  const pool = PRESET_SILHOUETTES.filter(p => p.name !== excludeName)
  return pool[Math.floor(Math.random() * pool.length)]!
}

export function Hero() {
  const [mounted, setMounted] = useState(false)

  // mark “hydrated” so we don’t get an SSR mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // ── CUSTOM CURSOR TRACKING ───────────────────────────────
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener("mousemove", handle)
    return () => window.removeEventListener("mousemove", handle)
  }, [mouseX, mouseY])
  // ─────────────────────────────────────────────────────────

  // → current preset
  const [presetName, setPresetName] = useState(() => pickPreset().name)
  const currentRef = useRef<NamedSilhouette>(
    PRESET_SILHOUETTES.find(p => p.name === presetName)!
  )
  // → next preset buffer
  const nextRef = useRef<NamedSilhouette>(pickPreset(presetName))
  const nextDone = useRef<Set<string>>(new Set())

  // the lines we actually draw for “current”
  const [lines, setLines] = useState<Line[]>(() =>
    currentRef.current.lines.map(l => ({ ...l, id: uuidv4() }))
  )

  useEffect(() => {
    const iv = window.setInterval(() => {
      setLines(current => {
        if (current.length === 0) return current

        // 1) remove one random line from current
        const removeIdx = Math.floor(Math.random() * current.length)
        const afterRemoval = current
          .slice(0, removeIdx)
          .concat(current.slice(removeIdx + 1))

        // 2) pick next line from nextRef that's not yet added
        const candidate = nextRef.current.lines.find(
          l => !nextDone.current.has(lineKey(l))
        )
        if (candidate) {
          nextDone.current.add(lineKey(candidate))
          const added = { ...candidate, id: uuidv4() }
          return [...afterRemoval, added]  // still building next silhouette
        } else {
          // next is complete! swap in
          const completed = nextRef.current
          currentRef.current = completed
          setPresetName(completed.name)
          nextRef.current = pickPreset(completed.name)
          nextDone.current.clear()
          return completed.lines.map(l => ({ ...l, id: uuidv4() }))  // full new silhouette
        }
      })
    }, 1500)

    return () => void window.clearInterval(iv)
  }, [])

  // after all hooks have been called, bail until mounted
  if (!mounted) {
    return (
      <section className="relative w-full h-screen overflow-hidden bg-[var(--color-background)]" />
    )
  }

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[var(--color-secondary)] flex justify-center">
      <div className="w-full h-full relative mx-20">
        <motion.svg
          className="absolute inset-0 w-full h-full"
          style={{ paddingRight: "10px", paddingLeft: "10px" }}
          initial="hidden"
          animate="visible"
          viewBox="0 0 1100 800"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path
                d="M 50 0 L 0 0 0 50"
                stroke="var(--color-muted)"
                strokeWidth="0.5"
              />
            </pattern>
            <filter id="corner-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow
                dx="2"
                dy="2"
                stdDeviation="1"
                floodColor="rgba(0,0,0,0.3)"
              />
            </filter>
            <linearGradient id="fadeX" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="var(--color-secondary)" />
              <stop offset="10%" stopColor="var(--color-secondary)" stopOpacity="0" />
              <stop offset="90%" stopColor="var(--color-secondary)" stopOpacity="0" />
              <stop offset="100%" stopColor="var(--color-secondary)" />
            </linearGradient>
            <linearGradient id="fadeY" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--color-secondary)" />
              <stop offset="10%" stopColor="var(--color-secondary)" stopOpacity="0" />
              <stop offset="90%" stopColor="var(--color-secondary)" stopOpacity="0" />
              <stop offset="100%" stopColor="var(--color-secondary)" />
            </linearGradient>
          </defs>

          <rect
            x={50}
            y={50}
            width="1000"
            height="700"
            fill="url(#grid)"
            opacity="0.1"
          />

          <rect x={50} y={50} width="1000" height="700" fill="url(#fadeX)" />
          <rect x={50} y={50} width="1000" height="700" fill="url(#fadeY)" />

          <AnimatePresence>
            {lines.map((l, i) => (
              <g key={l.id} filter="url(#corner-shadow)">
                <motion.line
                  x1={l.x1}
                  y1={l.y1}
                  x2={l.x2}
                  y2={l.y2}
                  stroke="var(--color-foreground)"
                  strokeWidth={1}
                  variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ delay: i * 0.1, duration: 0.8, ease: "easeInOut" }}
                />
                {[[l.x1, l.y1], [l.x2, l.y2]].map(([x, y], idx) => (
                  <circle key={idx} cx={x} cy={y} r={2} fill="var(--color-foreground)" />
                ))}
              </g>
            ))}
          </AnimatePresence>
        </motion.svg>
      </div>

      <div className="absolute top-24 translate-y-50 select-none text-xl font-mono text-primary/60">
        datafluent.one
      </div>

      <div className="absolute bottom-12 right-48 select-none text-xs font-mono text-primary/40">
        {presetName}
      </div>
    </section>
  )
}
