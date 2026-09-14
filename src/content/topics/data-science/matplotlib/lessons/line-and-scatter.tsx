import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function LineAndScatter() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Everyday idea">
        Line charts show how something changes in order — time, dose, rank. Scatter plots show
        whether two measurements move together — height vs weight, ad spend vs clicks. Pick the one
        that matches your question.
      </Callout>

      <Definition term="Line vs scatter">
        <p>
          A <strong className="text-white">line plot</strong> connects ordered x values — ideal for
          trends and continuous sequences. A <strong className="text-white">scatter plot</strong>{' '}
          places dots at (x, y) pairs — ideal for relationships without implying a path between
          points.
        </p>
      </Definition>

      <LessonSection title="When to use each">
        <ContentStep number={1} title="Line chart">
          <p className="text-slate-300">
            Stock price by day, temperature by hour, model loss by training epoch — x has a natural
            order and you care about the path.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Scatter plot">
          <p className="text-slate-300">
            House size vs price, study hours vs exam score — two numeric variables; each point is one
            observation; order does not matter.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Line chart example">
        <Example
          title="Monthly website visits"
          output={`[Figure opens: line sloping up from Jan (~1200) to Jun (~2100)
  x-axis: month names, y-axis: visits, title "Monthly visits"]`}
        >{`import matplotlib.pyplot as plt

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
visits = [1200, 1350, 1480, 1620, 1850, 2100]

plt.plot(months, visits, marker="o")
plt.title("Monthly visits")
plt.xlabel("Month")
plt.ylabel("Visits")
plt.show()`}</Example>
        <p className="mt-3 text-sm text-slate-300">
          The line rises steadily — traffic grew every month in this toy dataset.
        </p>
      </LessonSection>

      <LessonSection title="Scatter plot example">
        <Example
          title="Study hours vs exam score"
          output={`[Figure opens: dots trending up-right from (~1 hr, 55 pts) to (~6 hr, 88 pts)
  x-axis: hours studied, y-axis: score, no connecting lines]`}
        >{`import matplotlib.pyplot as plt

hours = [1, 2, 3, 4, 5, 6]
scores = [55, 62, 68, 74, 81, 88]

plt.scatter(hours, scores)
plt.title("Hours vs score")
plt.xlabel("Hours studied")
plt.ylabel("Score")
plt.show()`}</Example>
        <p className="mt-3 text-sm text-slate-300">
          More hours correlate with higher scores here — a classic positive relationship visible as
          a cloud sloping upward.
        </p>
      </LessonSection>

      <Callout variant="tip">
        Use <code className="font-mono text-xs">plt.plot(x, y, &quot;o&quot;)</code> (markers only,
        no line) when x is numeric but you still want dots without connecting them — similar to
        scatter for small datasets.
      </Callout>

      <KeyTakeaways
        items={[
          'Line plots: ordered x, show trends over time or sequence.',
          'Scatter plots: two numeric variables, show correlation or clusters.',
          'Always label axes and add a title so the chart stands alone in a notebook or report.',
        ]}
      />
    </LessonArticle>
  )
}
