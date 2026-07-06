import mermaid from 'mermaid'
import { useEffect, useId, useState } from 'react'
import { motion } from 'framer-motion'

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: {
    darkMode: true,
    background: '#0c1222',
    primaryColor: '#1a2540',
    primaryTextColor: '#f8fafc',
    primaryBorderColor: '#38bdf8',
    secondaryColor: '#121a2e',
    tertiaryColor: '#0c1222',
    lineColor: '#94a3b8',
    textColor: '#f8fafc',
    mainBkg: '#1a2540',
    nodeBorder: '#38bdf8',
    clusterBkg: '#121a2e',
    titleColor: '#f8fafc',
    edgeLabelBackground: '#1a2540',
    fontFamily: 'DM Sans, system-ui, sans-serif',
    fontSize: '14px',
  },
  flowchart: {
    htmlLabels: true,
    curve: 'basis',
    padding: 16,
    nodeSpacing: 32,
    rankSpacing: 56,
    useMaxWidth: true,
    defaultRenderer: 'dagre-wrapper',
  },
})

function normalizeChart(chart: string): string {
  return chart
    .trim()
    .replace(/^flowchart\s+LR/mi, 'flowchart TB')
    .replace(/^flowchart\s+RL/mi, 'flowchart TB')
    .replace(/^graph\s+LR/mi, 'flowchart TB')
}

interface FlowchartProps {
  title?: string
  chart: string
}

export function Flowchart({ title, chart }: FlowchartProps) {
  const id = useId().replace(/:/g, '')
  const [svg, setSvg] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function renderChart() {
      try {
        const { svg: rendered } = await mermaid.render(`mermaid-${id}`, normalizeChart(chart))
        if (!cancelled) {
          setSvg(rendered)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to render diagram')
        }
      }
    }

    renderChart()

    return () => {
      cancelled = true
    }
  }, [chart, id])

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
      <div className="mermaid flex justify-center overflow-x-auto p-4 md:p-5">
        {error ? (
          <p className="text-sm text-red-400">{error}</p>
        ) : svg ? (
          <div
            className="mx-auto w-full max-w-lg"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : (
          <p className="text-sm text-slate-500">Rendering diagram…</p>
        )}
      </div>
    </motion.figure>
  )
}
