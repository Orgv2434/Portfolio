import { useEffect, useRef } from 'react'
import { lerpHex } from '../sectionPalettes'

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

const DEFAULT_FROM: Palette4 = ['#87ceeb', '#5bb8e8', '#1565c0', '#0a1628']
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

    const PARTICLE_COUNT = 120
    const COLS = 12
    const minRadius = 8
    const maxRadius = 45
    const ACCEL = 0.015

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
        const jitter = (Math.random() - 0.5) * colW * 0.55
        Bubbles.push({
          x: (col + 0.5) * colW + jitter,
          y: Math.random() * height,
          r: minRadius + Math.random() * (maxRadius - minRadius),
          speed: 4 + Math.random() * 14,
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

      for (let i = 0; i < Bubbles.length; i++) {
        const b = Bubbles[i]

        // alpha：靠近起始端透明，越往运动方向越不透明，融合背景蓝色
        if (reversed) {
          b.alpha = 0.55 * ((height - b.y) / height)
        } else {
          b.alpha = 0.55 * (b.y / height)
        }
        b.alpha = Math.max(0, Math.min(0.55, b.alpha))

        // 加速上升/下降，参考海绵宝宝水中气泡效果
        b.speed += ACCEL

        // 玻璃质感气泡：径向渐变 + 光晕效果
        const gradient = d2.createRadialGradient(
          b.x - b.r * 0.3, b.y - b.r * 0.3, 0,
          b.x, b.y, b.r
        )
        gradient.addColorStop(0, `hsla(203, 85%, 80%, ${b.alpha * 0.85})`)
        gradient.addColorStop(0.4, `hsla(203, 75%, 69%, ${b.alpha * 0.9})`)
        gradient.addColorStop(1, `hsla(203, 70%, 60%, ${b.alpha * 0.5})`)

        d2.fillStyle = gradient
        d2.beginPath()
        d2.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        d2.fill()

        // 外层光圈（模拟高光边框）
        d2.strokeStyle = `rgba(255, 255, 255, ${b.alpha * 0.6})`
        d2.lineWidth = Math.max(1, b.r * 0.15)
        d2.stroke()

        // 内部高光点
        const highlightGrad = d2.createRadialGradient(
          b.x - b.r * 0.25, b.y - b.r * 0.25, 0,
          b.x - b.r * 0.25, b.y - b.r * 0.25, b.r * 0.3
        )
        highlightGrad.addColorStop(0, `rgba(255, 255, 255, ${b.alpha * 0.8})`)
        highlightGrad.addColorStop(1, `rgba(255, 255, 255, 0)`)
        d2.fillStyle = highlightGrad
        d2.beginPath()
        d2.arc(b.x - b.r * 0.25, b.y - b.r * 0.25, b.r * 0.3, 0, Math.PI * 2)
        d2.fill()

        if (reversed) {
          b.y += b.speed
        } else {
          b.y -= b.speed
        }

        // 超出屏幕时重置到起始端
        const colW = width / COLS
        if (!reversed && b.y < -b.r) {
          b.y = height + b.r
          b.speed = 4 + Math.random() * 14
          b.x = (Math.floor(Math.random() * COLS) + 0.5) * colW + (Math.random() - 0.5) * colW * 0.55
        } else if (reversed && b.y > height + b.r) {
          b.y = -b.r
          b.speed = 4 + Math.random() * 14
          b.x = (Math.floor(Math.random() * COLS) + 0.5) * colW + (Math.random() - 0.5) * colW * 0.55
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
