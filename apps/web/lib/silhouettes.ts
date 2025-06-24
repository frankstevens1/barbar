// app/components/silhouettes.ts

export interface Line {
  id: string
  x1: number
  y1: number
  x2: number
  y2: number
}

export interface NamedSilhouette {
  name: string
  lines: Omit<Line, "id">[]
}

export const PRESET_SILHOUETTES: NamedSilhouette[] = [
  // 3. Historic skyline (church steeples & domes)
  {
    name: "Historic skyline (church steeples & domes)",
    lines: [
      { x1: 0,   y1: 700, x2: 100, y2: 700 },
      { x1: 100, y1: 700, x2: 100, y2: 550 },
      { x1: 100, y1: 550, x2: 200, y2: 550 },
      { x1: 200, y1: 550, x2: 200, y2: 600 }, // dome base at multiple of 50
      { x1: 200, y1: 600, x2: 350, y2: 600 },
      { x1: 350, y1: 600, x2: 350, y2: 700 },
      { x1: 350, y1: 700, x2: 600, y2: 700 },
      { x1: 600, y1: 700, x2: 600, y2: 500 },
      { x1: 600, y1: 500, x2: 700, y2: 500 },
      { x1: 700, y1: 500, x2: 700, y2: 700 },
      { x1: 700, y1: 700, x2: 1200, y2: 700 },
    ],
  },

  // 4. Industrial complex (smokestacks & warehouses)
  {
    name: "Industrial complex (smokestacks & warehouses)",
    lines: [
      { x1:   0, y1: 700, x2: 150, y2: 700 },
      { x1: 150, y1: 700, x2: 150, y2: 450 },
      { x1: 150, y1: 450, x2: 250, y2: 450 },
      { x1: 250, y1: 450, x2: 250, y2: 700 },
      { x1: 250, y1: 700, x2: 400, y2: 700 },
      { x1: 400, y1: 700, x2: 400, y2: 500 },
      { x1: 400, y1: 500, x2: 500, y2: 500 },
      { x1: 500, y1: 500, x2: 500, y2: 700 },
      { x1: 500, y1: 700, x2: 1200, y2: 700 },
    ],
  },

  // 5. Futuristic spires (pointed, irregular heights)
  {
    name: "Futuristic spires (pointed, irregular heights)",
    lines: [
      { x1:   0, y1: 700, x2: 100, y2: 700 },
      { x1: 100, y1: 700, x2: 100, y2: 400 },
      { x1: 100, y1: 400, x2: 200, y2: 400 },
      { x1: 200, y1: 400, x2: 200, y2: 550 },
      { x1: 200, y1: 550, x2: 300, y2: 550 },
      { x1: 300, y1: 550, x2: 300, y2: 300 },
      { x1: 300, y1: 300, x2: 400, y2: 300 },
      { x1: 400, y1: 300, x2: 400, y2: 650 },
      { x1: 400, y1: 650, x2: 600, y2: 650 },
      { x1: 600, y1: 650, x2: 600, y2: 350 },
      { x1: 600, y1: 350, x2: 1200, y2: 350 },
      { x1: 1200, y1: 350, x2: 1200, y2: 700 },
    ],
  },

  // 6. Mountain range (jagged peaks)
  {
    name: "Mountain range (jagged peaks)",
    lines: [
      { x1:   0, y1: 700, x2: 150, y2: 700 },
      { x1: 150, y1: 700, x2: 200, y2: 550 },
      { x1: 200, y1: 550, x2: 300, y2: 650 },
      { x1: 300, y1: 650, x2: 350, y2: 500 },
      { x1: 350, y1: 500, x2: 450, y2: 600 },
      { x1: 450, y1: 600, x2: 550, y2: 450 },
      { x1: 550, y1: 450, x2: 650, y2: 700 },
      { x1: 650, y1: 700, x2: 800, y2: 500 },
      { x1: 800, y1: 500, x2: 950, y2: 650 },
      { x1: 950, y1: 650, x2: 1200, y2: 700 },
    ],
  },

  // 7. Forest edge (pointed tree tops)
  {
    name: "Forest edge (pointed tree tops)",
    lines: [
      { x1:   0, y1: 700, x2: 100, y2: 700 },
      { x1: 100, y1: 700, x2: 150, y2: 600 },
      { x1: 150, y1: 600, x2: 200, y2: 700 },
      { x1: 200, y1: 700, x2: 300, y2: 700 },
      { x1: 300, y1: 700, x2: 350, y2: 600 },
      { x1: 350, y1: 600, x2: 400, y2: 700 },
      { x1: 400, y1: 700, x2: 500, y2: 700 },
      { x1: 500, y1: 700, x2: 550, y2: 550 },
      { x1: 550, y1: 550, x2: 650, y2: 700 },
      { x1: 650, y1: 700, x2: 1200, y2: 700 },
    ],
  },

  // 8. Seascape waves
  {
    name: "Seascape waves",
    lines: [
      { x1:   0, y1: 700, x2: 200, y2: 700 },
      { x1: 200, y1: 700, x2: 300, y2: 650 },
      { x1: 300, y1: 650, x2: 400, y2: 700 },
      { x1: 400, y1: 700, x2: 550, y2: 650 },
      { x1: 550, y1: 650, x2: 650, y2: 700 },
      { x1: 650, y1: 700, x2: 800, y2: 650 },
      { x1: 800, y1: 650, x2: 900, y2: 700 },
      { x1: 900, y1: 700, x2: 1200, y2: 700 },
    ],
  },

  // 9. Desert dunes
  {
    name: "Desert dunes",
    lines: [
      { x1:   0, y1: 700, x2: 150, y2: 700 },
      { x1: 150, y1: 700, x2: 300, y2: 650 },
      { x1: 300, y1: 650, x2: 450, y2: 700 },
      { x1: 450, y1: 700, x2: 600, y2: 650 },
      { x1: 600, y1: 650, x2: 750, y2: 700 },
      { x1: 750, y1: 700, x2: 900, y2: 700 },
      { x1: 900, y1: 700, x2: 1200, y2: 700 },
    ],
  },

  // 10. Medieval castle (turrets & battlements)
  {
    name: "Medieval castle (turrets & battlements)",
    lines: [
      { x1:   0, y1: 700, x2: 200, y2: 700 },
      { x1: 200, y1: 700, x2: 200, y2: 550 },
      { x1: 200, y1: 550, x2: 300, y2: 550 },
      { x1: 300, y1: 550, x2: 300, y2: 650 },
      { x1: 300, y1: 650, x2: 400, y2: 650 },
      { x1: 400, y1: 650, x2: 400, y2: 500 },
      { x1: 400, y1: 500, x2: 600, y2: 500 },
      { x1: 600, y1: 500, x2: 600, y2: 700 },
      { x1: 600, y1: 700, x2: 1200, y2: 700 },
    ],
  },

  // 11. Sci-fi dome colony
  {
    name: "Sci-fi dome colony",
    lines: [
      { x1:   0, y1: 700, x2: 250, y2: 700 },
      { x1: 250, y1: 700, x2: 250, y2: 600 },
      { x1: 250, y1: 600, x2: 350, y2: 600 },
      { x1: 350, y1: 600, x2: 350, y2: 650 },
      { x1: 350, y1: 650, x2: 500, y2: 650 },
      { x1: 500, y1: 650, x2: 500, y2: 550 },
      { x1: 500, y1: 550, x2: 650, y2: 550 },
      { x1: 650, y1: 550, x2: 650, y2: 700 },
      { x1: 650, y1: 700, x2: 1200, y2: 700 },
    ],
  },

  // 12. Mixed skyline (residential blocks & water tower)
  {
    name: "Mixed skyline (residential blocks & water tower)",
    lines: [
      { x1:   0, y1: 700, x2: 200, y2: 700 },
      { x1: 200, y1: 700, x2: 200, y2: 600 },
      { x1: 200, y1: 600, x2: 300, y2: 600 },
      { x1: 300, y1: 600, x2: 300, y2: 550 },
      { x1: 300, y1: 550, x2: 400, y2: 550 },
      { x1: 400, y1: 550, x2: 400, y2: 650 },
      { x1: 400, y1: 650, x2: 500, y2: 650 },
      { x1: 500, y1: 650, x2: 500, y2: 700 },
      { x1: 500, y1: 700, x2: 1200, y2: 700 },
    ],
  },
]
