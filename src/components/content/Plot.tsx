import { motion } from 'framer-motion'
import { useId } from 'react'
import type { ReactNode } from 'react'

export interface Point {
  x: number
  y: number
}

const WIDTH = 540
const HEIGHT = 360
const MARGIN = { top: 24, right: 24, bottom: 48, left: 56 }
const PLOT_W = WIDTH - MARGIN.left - MARGIN.right
const PLOT_H = HEIGHT - MARGIN.top - MARGIN.bottom

const COLORS = {
  axis: '#475569',
  grid: '#1e293b',
  text: '#94a3b8',
  point: '#38bdf8',
  line: '#34d399',
  residual: '#f43f5e',
  curve: '#38bdf8',
  path: '#f59e0b',
  min: '#34d399',
}

function niceNum(n: number): string {
  if (Number.isInteger(n)) return String(n)
  const abs = Math.abs(n)
  if (abs >= 100) return n.toFixed(0)
  if (abs >= 10) return n.toFixed(1)
  return n.toFixed(2)
}

function FigureFrame({
  title,
  caption,
  children,
}: {
  title?: string
  caption?: string
  children: ReactNode
}) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35 }}
      className="overflow-hidden rounded-xl border border-surface-600 bg-surface-900"
    >
      {title ? (
        <figcaption className="border-b border-surface-600 px-4 py-3 text-sm font-medium text-slate-300">
          {title}
        </figcaption>
      ) : null}
      <div className="flex justify-center overflow-x-auto p-4 md:p-5">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-auto w-full max-w-xl"
          role="img"
          aria-label={title ?? 'plot'}
        >
          {children}
        </svg>
      </div>
      {caption ? (
        <p className="border-t border-surface-600 px-4 py-3 text-sm leading-relaxed text-slate-400">
          {caption}
        </p>
      ) : null}
    </motion.figure>
  )
}

interface Axes {
  toPx: (x: number) => number
  toPy: (y: number) => number
  // padded drawing bounds
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  // true data bounds (used for readable tick labels)
  xDataMin: number
  xDataMax: number
  yDataMin: number
  yDataMax: number
}

function buildAxes(xs: number[], ys: number[]): Axes {
  const xDataMin = Math.min(...xs)
  const xDataMax = Math.max(...xs)
  const yDataMin = Math.min(...ys)
  const yDataMax = Math.max(...ys)

  // pad ranges a little so points aren't on the edge
  const xPad = (xDataMax - xDataMin || 1) * 0.08
  const yPad = (yDataMax - yDataMin || 1) * 0.12
  const xMin = xDataMin - xPad
  const xMax = xDataMax + xPad
  const yMin = yDataMin - yPad
  const yMax = yDataMax + yPad

  const toPx = (x: number) => MARGIN.left + ((x - xMin) / (xMax - xMin)) * PLOT_W
  const toPy = (y: number) => MARGIN.top + PLOT_H - ((y - yMin) / (yMax - yMin)) * PLOT_H

  return { toPx, toPy, xMin, xMax, yMin, yMax, xDataMin, xDataMax, yDataMin, yDataMax }
}

function AxisLayer({
  axes,
  xLabel,
  yLabel,
}: {
  axes: Axes
  xLabel?: string
  yLabel?: string
}) {
  const { toPx, toPy, xDataMin, xDataMax, yDataMin, yDataMax } = axes
  const xTicks = [xDataMin, (xDataMin + xDataMax) / 2, xDataMax]
  const yTicks = [yDataMin, (yDataMin + yDataMax) / 2, yDataMax]
  const baseY = MARGIN.top + PLOT_H
  const baseX = MARGIN.left

  return (
    <g>
      {/* gridlines */}
      {yTicks.map((t) => (
        <line
          key={`gy-${t}`}
          x1={MARGIN.left}
          x2={MARGIN.left + PLOT_W}
          y1={toPy(t)}
          y2={toPy(t)}
          stroke={COLORS.grid}
          strokeWidth={1}
        />
      ))}
      {/* axes */}
      <line x1={baseX} x2={baseX} y1={MARGIN.top} y2={baseY} stroke={COLORS.axis} strokeWidth={1.5} />
      <line
        x1={baseX}
        x2={MARGIN.left + PLOT_W}
        y1={baseY}
        y2={baseY}
        stroke={COLORS.axis}
        strokeWidth={1.5}
      />
      {/* x ticks */}
      {xTicks.map((t) => (
        <text
          key={`xt-${t}`}
          x={toPx(t)}
          y={baseY + 18}
          textAnchor="middle"
          fontSize={12}
          fill={COLORS.text}
        >
          {niceNum(t)}
        </text>
      ))}
      {/* y ticks */}
      {yTicks.map((t) => (
        <text
          key={`yt-${t}`}
          x={baseX - 8}
          y={toPy(t) + 4}
          textAnchor="end"
          fontSize={12}
          fill={COLORS.text}
        >
          {niceNum(t)}
        </text>
      ))}
      {xLabel ? (
        <text
          x={MARGIN.left + PLOT_W / 2}
          y={HEIGHT - 8}
          textAnchor="middle"
          fontSize={13}
          fill={COLORS.text}
        >
          {xLabel}
        </text>
      ) : null}
      {yLabel ? (
        <text
          x={16}
          y={MARGIN.top + PLOT_H / 2}
          textAnchor="middle"
          fontSize={13}
          fill={COLORS.text}
          transform={`rotate(-90 16 ${MARGIN.top + PLOT_H / 2})`}
        >
          {yLabel}
        </text>
      ) : null}
    </g>
  )
}

interface ScatterPlotProps {
  title?: string
  caption?: string
  points: Point[]
  /** Optional straight line y = intercept + slope·x */
  line?: { slope: number; intercept: number }
  /** Draw vertical residual segments from each point to the line */
  showResiduals?: boolean
  /** Emphasise a single point (e.g. a prediction) */
  highlight?: Point
  xLabel?: string
  yLabel?: string
}

export function ScatterPlot({
  title,
  caption,
  points,
  line,
  showResiduals,
  highlight,
  xLabel,
  yLabel,
}: ScatterPlotProps) {
  const xs = points.map((p) => p.x)
  const ys = points.map((p) => p.y)
  if (highlight) {
    xs.push(highlight.x)
    ys.push(highlight.y)
  }
  if (line) {
    // include line endpoints in the y-range
    const lx = [Math.min(...xs), Math.max(...xs)]
    lx.forEach((x) => ys.push(line.intercept + line.slope * x))
  }
  const axes = buildAxes(xs, ys)
  const { toPx, toPy } = axes

  const lineY = (x: number) => (line ? line.intercept + line.slope * x : 0)

  return (
    <FigureFrame title={title} caption={caption}>
      <AxisLayer axes={axes} xLabel={xLabel} yLabel={yLabel} />

      {showResiduals && line
        ? points.map((p, i) => (
            <line
              key={`res-${i}`}
              x1={toPx(p.x)}
              x2={toPx(p.x)}
              y1={toPy(p.y)}
              y2={toPy(lineY(p.x))}
              stroke={COLORS.residual}
              strokeWidth={1.5}
              strokeDasharray="4 3"
            />
          ))
        : null}

      {line ? (
        <line
          x1={toPx(axes.xMin)}
          x2={toPx(axes.xMax)}
          y1={toPy(lineY(axes.xMin))}
          y2={toPy(lineY(axes.xMax))}
          stroke={COLORS.line}
          strokeWidth={2.5}
        />
      ) : null}

      {points.map((p, i) => (
        <circle key={`pt-${i}`} cx={toPx(p.x)} cy={toPy(p.y)} r={5} fill={COLORS.point} />
      ))}

      {highlight ? (
        <g>
          <circle
            cx={toPx(highlight.x)}
            cy={toPy(highlight.y)}
            r={7}
            fill="none"
            stroke={COLORS.path}
            strokeWidth={2.5}
          />
          <circle cx={toPx(highlight.x)} cy={toPy(highlight.y)} r={4} fill={COLORS.path} />
        </g>
      ) : null}
    </FigureFrame>
  )
}

interface CurvePlotProps {
  title?: string
  caption?: string
  /** The curve to draw, e.g. cost as a function of a parameter */
  fn: (x: number) => number
  domain: [number, number]
  samples?: number
  /** Optional sequence of points to draw as a path (e.g. gradient-descent steps) */
  path?: Point[]
  /** Optional marker for the minimum / target */
  markMin?: Point
  xLabel?: string
  yLabel?: string
}

export function CurvePlot({
  title,
  caption,
  fn,
  domain,
  samples = 64,
  path,
  markMin,
  xLabel,
  yLabel,
}: CurvePlotProps) {
  const [d0, d1] = domain
  const curve: Point[] = []
  for (let i = 0; i <= samples; i += 1) {
    const x = d0 + ((d1 - d0) * i) / samples
    curve.push({ x, y: fn(x) })
  }

  const xs = curve.map((p) => p.x)
  const ys = curve.map((p) => p.y)
  if (path) path.forEach((p) => { xs.push(p.x); ys.push(p.y) })
  if (markMin) { xs.push(markMin.x); ys.push(markMin.y) }

  const axes = buildAxes(xs, ys)
  const { toPx, toPy } = axes
  const rawId = useId().replace(/:/g, '')

  const curvePath = curve
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${toPx(p.x).toFixed(1)} ${toPy(p.y).toFixed(1)}`)
    .join(' ')

  return (
    <FigureFrame title={title} caption={caption}>
      <defs>
        <marker
          id={`arrow-${rawId}`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={COLORS.path} />
        </marker>
      </defs>

      <AxisLayer axes={axes} xLabel={xLabel} yLabel={yLabel} />

      <path d={curvePath} fill="none" stroke={COLORS.curve} strokeWidth={2.5} />

      {path && path.length > 1
        ? path.slice(0, -1).map((p, i) => {
            const next = path[i + 1]
            return (
              <line
                key={`step-${i}`}
                x1={toPx(p.x)}
                y1={toPy(p.y)}
                x2={toPx(next.x)}
                y2={toPy(next.y)}
                stroke={COLORS.path}
                strokeWidth={2}
                markerEnd={`url(#arrow-${rawId})`}
              />
            )
          })
        : null}

      {path
        ? path.map((p, i) => (
            <circle key={`pp-${i}`} cx={toPx(p.x)} cy={toPy(p.y)} r={4} fill={COLORS.path} />
          ))
        : null}

      {markMin ? (
        <g>
          <circle
            cx={toPx(markMin.x)}
            cy={toPy(markMin.y)}
            r={7}
            fill="none"
            stroke={COLORS.min}
            strokeWidth={2.5}
          />
          <circle cx={toPx(markMin.x)} cy={toPy(markMin.y)} r={4} fill={COLORS.min} />
        </g>
      ) : null}
    </FigureFrame>
  )
}
