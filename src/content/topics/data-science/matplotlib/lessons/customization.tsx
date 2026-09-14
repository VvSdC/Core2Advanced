import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function CustomizationLesson() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Make plots easy to read">
        A default Matplotlib line works — but small tweaks (color, labels, grid) turn a rough sketch
        into something you would put in a report. This lesson covers the styling knobs you will reach
        for most often.
      </Callout>

      <Definition term="Plot customization">
        <p>
          <strong className="text-white">Customization</strong> means controlling how data looks on
          the axes: line color and thickness, marker shapes, legends, annotations, and layout. You can
          set these when you call <code className="font-mono text-xs">plot()</code>, or adjust the
          axes object afterward.
        </p>
      </Definition>

      <LessonSection title="Colors, markers, and line styles">
        <ContentStep number={1} title="color and marker">
          <p className="text-slate-300">
            Pass <code className="font-mono text-xs">color=</code> (or shorthand{' '}
            <code className="font-mono text-xs">c=</code>) and{' '}
            <code className="font-mono text-xs">marker=</code> to highlight points. Common markers:{' '}
            <code className="font-mono text-xs">o</code> circles,{' '}
            <code className="font-mono text-xs">s</code> squares,{' '}
            <code className="font-mono text-xs">^</code> triangles.
          </p>
        </ContentStep>
        <ContentStep number={2} title="linestyle and linewidth">
          <p className="text-slate-300">
            <code className="font-mono text-xs">linestyle</code> (or{' '}
            <code className="font-mono text-xs">ls</code>) controls dashes: solid{' '}
            <code className="font-mono text-xs">-</code>, dashed{' '}
            <code className="font-mono text-xs">--</code>, dotted{' '}
            <code className="font-mono text-xs">:</code>.{' '}
            <code className="font-mono text-xs">linewidth</code> (or{' '}
            <code className="font-mono text-xs">lw</code>) makes lines thicker or thinner.
          </p>
        </ContentStep>
        <Example
          title="Style two series on one axes"
          output={`[Figure opens: blue solid line with circle markers; orange dashed line with square markers]`}
        >{`import matplotlib.pyplot as plt

x = [1, 2, 3, 4]
y1 = [2, 4, 3, 5]
y2 = [1, 3, 2, 4]

plt.plot(x, y1, color="steelblue", marker="o", linestyle="-", linewidth=2, label="Series A")
plt.plot(x, y2, color="darkorange", marker="s", linestyle="--", linewidth=2, label="Series B")
plt.legend()
plt.show()`}</Example>
      </LessonSection>

      <LessonSection title="Legends and annotations">
        <ContentStep number={1} title="legend">
          <p className="text-slate-300">
            Give each line a <code className="font-mono text-xs">label=</code>, then call{' '}
            <code className="font-mono text-xs">plt.legend()</code> or{' '}
            <code className="font-mono text-xs">ax.legend()</code>. The legend maps colors and styles
            to series names.
          </p>
        </ContentStep>
        <ContentStep number={2} title="annotate and text">
          <p className="text-slate-300">
            <code className="font-mono text-xs">ax.annotate()</code> draws an arrow or label pointing
            at a data point. <code className="font-mono text-xs">plt.text()</code> or{' '}
            <code className="font-mono text-xs">ax.text()</code> places plain text at x/y coordinates
            on the axes.
          </p>
        </ContentStep>
        <Example
          title="Mark the peak with an annotation"
          output={`[Figure opens: line with a labeled arrow pointing at the highest point near x=4]`}
        >{`import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y = [2, 3, 4, 6, 5]

fig, ax = plt.subplots()
ax.plot(x, y, marker="o", label="sales")
ax.legend()

peak_x, peak_y = 4, 6
ax.annotate("peak", xy=(peak_x, peak_y), xytext=(3, 6.5),
            arrowprops=dict(arrowstyle="->", color="gray"))
plt.show()`}</Example>
      </LessonSection>

      <LessonSection title="Readability: grid, ticks, size, layout">
        <ContentStep number={1} title="grid">
          <p className="text-slate-300">
            <code className="font-mono text-xs">ax.grid(True, alpha=0.3)</code> adds faint horizontal
            and vertical lines so values are easier to trace.
          </p>
        </ContentStep>
        <ContentStep number={2} title="ticks and labels">
          <p className="text-slate-300">
            Use <code className="font-mono text-xs">ax.set_xlabel</code>,{' '}
            <code className="font-mono text-xs">set_ylabel</code>, and{' '}
            <code className="font-mono text-xs">set_title</code> for human-readable axis names. Rotate
            crowded tick labels with <code className="font-mono text-xs">plt.xticks(rotation=45)</code>{' '}
            when needed.
          </p>
        </ContentStep>
        <ContentStep number={3} title="figsize and tight_layout">
          <p className="text-slate-300">
            <code className="font-mono text-xs">figsize=(width, height)</code> in inches sets canvas
            size. <code className="font-mono text-xs">plt.tight_layout()</code> reduces clipped labels
            before you save or show the figure.
          </p>
        </ContentStep>
        <Example
          title="Polish a simple chart"
          output={`[Figure opens: wider figure with title, axis labels, light grid, no clipped text]`}
        >{`import matplotlib.pyplot as plt

months = ["Jan", "Feb", "Mar", "Apr"]
values = [12, 18, 15, 22]

fig, ax = plt.subplots(figsize=(8, 4))
ax.bar(months, values, color="seagreen")
ax.set_title("Monthly sign-ups")
ax.set_xlabel("Month")
ax.set_ylabel("Count")
ax.grid(True, axis="y", alpha=0.3)
plt.tight_layout()
plt.show()`}</Example>
      </LessonSection>

      <LessonSection title="Style checklist">
        <Flowchart
          title="Before you share a plot"
          chart={`flowchart TB
  A[Pick colors that contrast] --> B[Add labels and title]
  B --> C[Legend if multiple series]
  C --> D[Grid or annotations if helpful]
  D --> E[figsize + tight_layout]
  E --> F[Save or show]`}
        />
        <Callout variant="tip">
          Set styles on the axes object (<code className="font-mono text-xs">ax.plot</code>,{' '}
          <code className="font-mono text-xs">ax.set_title</code>) when you have subplots — each axes
          stays independent.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Use color, marker, linestyle, and linewidth to distinguish series at a glance.',
          'label + legend names each line; annotate or text highlights specific points.',
          'Grid, axis labels, figsize, and tight_layout make plots readable in reports and slides.',
        ]}
      />
    </LessonArticle>
  )
}
