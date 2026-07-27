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

export function WhatIsBroadcasting() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Everyday idea">
        You already used broadcasting when you wrote <code className="font-mono text-xs">scores + 5</code>.
        NumPy stretched the single number 5 across every element. Broadcasting is that same “stretch to
        fit” idea for whole arrays — without writing loops.
      </Callout>

      <Definition term="Broadcasting">
        <p>
          <strong className="text-white">Broadcasting</strong> is how NumPy combines arrays of different
          shapes in arithmetic. When shapes are compatible, NumPy virtually repeats the smaller array
          along missing or size-1 axes so the operation can run element-wise.
        </p>
      </Definition>

      <LessonSection title="Why it feels magical (and useful)">
        <ContentStep number={1} title="Less code">
          <p className="text-slate-300">
            Add a bonus to every row, scale every column, or subtract a mean vector — often one line.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Still fast">
          <p className="text-slate-300">
            NumPy does not always build a giant repeated copy in memory. It applies the stretch
            efficiently during the operation.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Same idea you already know">
          <Example title="Scalar broadcast (you have seen this)">
{`import numpy as np
x = np.array([1, 2, 3])
print(x + 10)   # 10 is “stretched” to [10, 10, 10]
# [11 12 13]`}
          </Example>
        </ContentStep>
        <Flowchart
          title="Broadcasting in one picture"
          chart={`flowchart TB
  A[Two arrays, maybe different shapes] --> B{Shapes compatible?}
  B -- Yes --> C[Stretch size-1 / missing axes]
  C --> D[Element-wise +, -, *, /]
  B -- No --> E[ValueError — fix shapes]`}
        />
      </LessonSection>

      <LessonSection title="A table example">
        <p className="text-slate-300">
          Matrix of prices (2 shops × 3 products). You want to add a tax vector of length 3 — one tax
          per product, applied to every shop:
        </p>
        <Example title="Row vector applied to every row">
{`prices = np.array([
    [100, 200, 300],
    [110, 210, 310],
])
tax = np.array([5, 10, 15])

print(prices + tax)
# [[105 210 315]
#  [115 220 325]]`}
        </Example>
        <Callout variant="insight">
          You did not write a double loop. NumPy lined up the length-3 tax with each row of length 3.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Broadcasting = combine differently shaped arrays when shapes are compatible.',
          'Scalars and size-1 axes can stretch to match a larger array.',
          'It keeps code short and stays fast — a core NumPy superpower.',
        ]}
      />
    </LessonArticle>
  )
}
