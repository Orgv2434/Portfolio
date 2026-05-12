import { useEffect, useRef } from 'react'
import { lerpHex, hexToRgb, rgbToHsl } from '../sectionPalettes'

type Palette4 = [string, string, string, string]

interface SparklingWaterProps {
  className?: string
  reversed?: boolean
  visible?: boolean
  /** 转场起点页配色（四档渐变锚点） */
  paletteFrom?: Palette4
  /** 转场终点页配色 */
  paletteTo?: Palette4
  /** 插值动画时长，与 App 转场一致 */
  durationMs?: number
}

const DEFAULT_FROM: Palette4 = ['#0a1628', '#0d2137', '#134b6e', '#1a6f9a']
const DEFAULT_TO: Palette4 = ['#0a1628', '#124a6e', '#1a6f9a', '#2ec4b6']

function smoothstep(t: number): number {
  const x = Math.max(0, Math.min(1, t))
  return x * x * (3 - 2 * x)
}

export const SparklingWater = ({
  className = '',
  reversed = false,
  visible = true,
  paletteFrom = DEFAULT_FROM,
  paletteTo = DEFAULT_TO,
  durationMs = 1200,
}: SparklingWaterProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !visible) return

    const container = containerRef.current
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const d2 = ctx

    const from = paletteFrom
    const to = paletteTo

    let width = window.innerWidth
    let height = window.innerHeight
    canvas.width = width
    canvas.height = height
    canvas.style.position = 'absolute'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.zIndex = '0'
    container.appendChild(canvas)

    const PARTICLE_COUNT = 150
    const COLS = 12
    const minRadius = 10
    const maxRadius = 30
    const accel = 0.0075

    type Bubble = {
      x: number
      y: number
      r: number
      speed: number
      phase: number
      alpha: number
    }

    const Bubbles: Bubble[] = []

    function initBubbles() {
      Bubbles.length = 0
      const colW = width / COLS
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const col = i % COLS
        const jitter = (Math.random() - 0.5) * colW * 0.42
        Bubbles.push({
          x: (col + 0.5) * colW + jitter,
          y: reversed ? Math.random() * height : Math.random() * height,
          r: minRadius + Math.random() * (maxRadius - minRadius),
          speed: 2.2 + Math.random() * 5.5,
          phase: Math.random() * Math.PI * 2,
          alpha: 0,
        })
      }
    }

    initBubbles()

    const startTime = performance.now()
    let disposed = false
    let rafId = 0

    function resizeCanvas() {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
      initBubbles()
    }

    window.addEventListener('resize', resizeCanvas, false)

    function drawFrame(now: number) {
      if (disposed) return

      const elapsed = now - startTime
      const rawT = Math.min(1, elapsed / Math.max(200, durationMs))
      const t = smoothstep(rawT)

      const c0 = lerpHex(from[0], to[0], t)
      const c1 = lerpHex(from[1], to[1], t)
      const c2 = lerpHex(from[2], to[2], t)
      const c3 = lerpHex(from[3], to[3], t)

      d2.clearRect(0, 0, width, height)

      const g = reversed
        ? d2.createLinearGradient(0, height, 0, 0)
        : d2.createLinearGradient(0, 0, 0, height)
      g.addColorStop(0, c0)
      g.addColorStop(0.34, c1)
      g.addColorStop(0.62, c2)
      g.addColorStop(1, c3)
      d2.fillStyle = g
      d2.fillRect(0, 0, width, height)

      const mixA = lerpHex(from[1], to[1], t)
      const mixB = lerpHex(from[2], to[2], t)
      const mixHi = lerpHex(from[3], to[3], t)

      const strokeAlpha = 0.22 + 0.32 * (1 - t * 0.85)

      for (let i = 0; i < Bubbles.length; i++) {
        const b = Bubbles[i]
        const wobble = 0.5 + 0.5 * Math.sin(now * 0.0018 + b.phase)
        const localBlend = Math.max(0, Math.min(1, t * 0.82 + wobble * 0.18 * (i % 7) * 0.07))
        const bodyHex = lerpHex(lerpHex(mixA, mixB, localBlend), mixHi, 0.12 + (i % 5) * 0.04)
        const { r: R, g: G, b: B } = hexToRgb(bodyHex)
        const hsl = rgbToHsl(R, G, B)
        const hue = hsl.h * 360 + Math.sin(b.phase + i * 0.31) * 6
        const sat = 52 + hsl.s * 28 + t * 8
        const light = 58 + (1 - hsl.l) * 14 + (b.y / height) * 8 * (reversed ? 1 - b.y / height : b.y / height)

        if (reversed) {
          b.alpha = 0.12 + 0.42 * ((height - b.y) / height)
        } else {
          b.alpha = 0.12 + 0.42 * (b.y / height)
        }

        b.speed += accel

        d2.beginPath()
        d2.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        d2.fillStyle = `hsla(${hue}, ${sat}%, ${light}%, ${b.alpha * 0.92})`
        d2.fill()
        d2.strokeStyle = `rgba(255, 255, 255, ${strokeAlpha * (0.5 + b.alpha)})`
        d2.lineWidth = 1.1
        d2.stroke()

        if (reversed) {
          b.y += b.speed * 0.22
        } else {
          b.y -= b.speed * 0.22
        }

        if (reversed) {
          if (b.y > height + b.r) {
            b.y = -b.r
            b.speed = 2 + Math.random() * 5
          }
        } else {
          if (b.y < -b.r) {
            b.y = height + b.r
            b.speed = 2 + Math.random() * 5
          }
        }
      }

      rafId = requestAnimationFrame(drawFrame)
    }

    rafId = requestAnimationFrame(drawFrame)

    return () => {
      disposed = true
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resizeCanvas)
      if (canvas.parentNode === container) {
        container.removeChild(canvas)
      }
    }
  }, [visible, reversed, durationMs, paletteFrom.join('|'), paletteTo.join('|')])

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 ${className}`}
      style={{
        background: 'transparent',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}
    />
  )
}
