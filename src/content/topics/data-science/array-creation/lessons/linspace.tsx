import {
  Callout,
  Definition,
  KeyTakeaways,
  LessonArticle,
  NotebookCell,
} from '../../../../../components/content'

export function LinspaceLesson() {
  return (
    <LessonArticle>
      <Definition term="np.linspace">
        <p>
          <code className="font-mono text-sm text-data-science-400">np.linspace</code> builds evenly
          spaced values when you know <strong className="text-white">how many points</strong> you
          want between a start and a stop (stop is included by default).
        </p>
      </Definition>

      <Callout variant="tip">
        Use <strong className="text-white">arange</strong> when you think in steps. Use{' '}
        <strong className="text-white">linspace</strong> when you think “give me N points from A to B.”
      </Callout>

      <div className="mt-6 space-y-6">
        <NotebookCell
          cell={1}
          title="Five points from 0 to 1"
          code={`import numpy as np
print(np.linspace(0, 1, 5))`}
          output={`[0.   0.25 0.5  0.75 1.  ]`}
        />
        <NotebookCell
          cell={2}
          title="Endpoint control"
          code={`print(np.linspace(0, 1, 5, endpoint=True))
print(np.linspace(0, 1, 5, endpoint=False))`}
          output={`[0.   0.25 0.5  0.75 1.  ]
[0.  0.2 0.4 0.6 0.8]`}
        />
        <NotebookCell
          cell={3}
          title="Great for plotting x-axis"
          code={`x = np.linspace(-np.pi, np.pi, 5)
print(np.round(x, 3))`}
          output={`[-3.142 -1.571  0.     1.571  3.142]`}
        />
      </div>

      <KeyTakeaways
        items={[
          'linspace(start, stop, num) — stop included unless endpoint=False.',
          'Ideal when you need a fixed number of samples.',
          'Common for charts and numerical grids.',
        ]}
      />
    </LessonArticle>
  )
}
