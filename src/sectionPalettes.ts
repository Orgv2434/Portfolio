/** 各区块主色锚点（与 App 背景、WaterDroplets 一致，供转场等复用） */
export const SECTION_IDS = ['home', 'info', 'featured', 'planning', 'technology', 'ta', 'ai'] as const
export type SectionType = (typeof SECTION_IDS)[number]

export const SECTION_PALETTES: Record<
  SectionType,
  [string, string, string, string]
> = {
  home: ['#0a1628', '#0d2137', '#134b6e', '#1a6f9a'],
  info: ['#0a1628', '#124a6e', '#1a6f9a', '#2ec4b6'],
  featured: ['#0d2137', '#1a3f6e', '#6b4c9a', '#d4a574'],
  planning: ['#0a1e2e', '#16506e', '#2a8f8f', '#3dd6c6'],
  technology: ['#081828', '#0f3a5c', '#1a6f9a', '#4a9fff'],
  ta: ['#12081c', '#2a1050', '#4a1a6e', '#9b6dcc'],
  ai: ['#060a14', '#142a4a', '#2e6aa0', '#6ee7b7'],
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim())
  if (!m) return { r: 20, g: 40, b: 80 }
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
}

export function rgbToHex(r: number, g: number, b: number): string {
  const c = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, '0')
  return `#${c(r)}${c(g)}${c(b)}`
}

export function lerpHex(a: string, b: string, t: number): string {
  const u = Math.max(0, Math.min(1, t))
  const A = hexToRgb(a)
  const B = hexToRgb(b)
  return rgbToHex(
    A.r + (B.r - A.r) * u,
    A.g + (B.g - A.g) * u,
    A.b + (B.b - A.b) * u,
  )
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  const d = max - min
  if (d > 1e-6) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      default:
        h = (r - g) / d + 4
    }
    h /= 6
  }
  return { h, s, l }
}

export function getTargetPaletteFromScroll(scrollY: number): string[] {
  const tops = SECTION_IDS.map((id) => document.getElementById(id)?.offsetTop ?? 0)
  const last = SECTION_IDS.length - 1

  if (tops[last] <= tops[0]) return [...SECTION_PALETTES.home]

  if (scrollY <= tops[0]) return [...SECTION_PALETTES[SECTION_IDS[0]]]
  if (scrollY >= tops[last]) return [...SECTION_PALETTES[SECTION_IDS[last]]]

  let i = 0
  for (let k = 0; k < last; k++) {
    if (scrollY >= tops[k] && scrollY < tops[k + 1]) {
      i = k
      break
    }
  }

  const span = Math.max(1, tops[i + 1] - tops[i])
  let t = (scrollY - tops[i]) / span
  t = Math.max(0, Math.min(1, t))
  t = t * t * (3 - 2 * t)

  const A = SECTION_PALETTES[SECTION_IDS[i]]
  const B = SECTION_PALETTES[SECTION_IDS[i + 1]]
  return [0, 1, 2, 3].map((idx) => lerpHex(A[idx], B[idx], t))
}
