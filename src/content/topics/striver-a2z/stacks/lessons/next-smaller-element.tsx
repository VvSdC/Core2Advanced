import {
  Callout,
  ContentStep,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function NextSmallerElement() {
  return (
    <LessonArticle>
      <LessonSection title="Problem Statement">
        <p>
          Given an array of integers <code className="font-mono text-sm">arr</code>, find the{' '}
          <strong className="text-white">Next Smaller Element (NSE)</strong> for every element.
        </p>
        <p className="mt-3">
          The NSE for an element <code className="font-mono text-sm">x</code> is the{' '}
          <strong className="text-white">first element to the right of x</strong> that is{' '}
          <strong className="text-white">strictly smaller</strong> than x. If none exists, use{' '}
          <code className="font-mono text-sm">-1</code>.
        </p>
        <Callout variant="beginner" title="Mirror of Next Greater">
          Same monotonic-stack idea as NGE-1, but you keep candidates that are{' '}
          <em>smaller</em> — pop while the stack top is ≥ current, not ≤.
        </Callout>

        <div className="mt-4 space-y-4">
          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Example 1</p>
            <p className="mt-2 text-sm text-slate-300">
              <span className="font-semibold text-white">Input:</span>{' '}
              <code className="font-mono text-sm">arr = [4, 8, 5, 2, 25]</code>
            </p>
            <p className="mt-2 text-sm text-slate-300">
              <span className="font-semibold text-white">Output:</span>{' '}
              <code className="font-mono text-sm">[2, 5, 2, -1, -1]</code>
            </p>
            <p className="mt-2 text-xs text-slate-400">
              4 → 2, 8 → 5, 5 → 2, 2 and 25 have nothing smaller on the right.
            </p>
          </div>

          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Example 2</p>
            <p className="mt-2 text-sm text-slate-300">
              <span className="font-semibold text-white">Input:</span>{' '}
              <code className="font-mono text-sm">arr = [10, 9, 8, 7]</code>
            </p>
            <p className="mt-2 text-sm text-slate-300">
              <span className="font-semibold text-white">Output:</span>{' '}
              <code className="font-mono text-sm">[9, 8, 7, -1]</code>
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Strictly decreasing — each value’s immediate right neighbor is smaller.
            </p>
          </div>

          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Now your turn
            </p>
            <p className="mt-2 text-sm text-slate-300">
              <span className="font-semibold text-white">Input:</span>{' '}
              <code className="font-mono text-sm">arr = [1, 2, 3, 4, 5]</code>
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-300">
              <li>
                <code className="font-mono text-xs">[-1, -1, -1, -1, -1]</code>
              </li>
              <li>
                <code className="font-mono text-xs">[5, 4, 3, 2, 1]</code>
              </li>
              <li>
                <code className="font-mono text-xs">[0, 0, 0, 0, 0]</code>
              </li>
              <li>
                <code className="font-mono text-xs">[1, 1, 1, 1, 1]</code>
              </li>
            </ul>
            <p className="mt-3 text-sm text-slate-300">
              <span className="font-semibold text-white">Answer:</span>{' '}
              <code className="font-mono text-sm">[-1, -1, -1, -1, -1]</code>
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Strictly increasing — every value on the right is larger, so no next smaller exists.
            </p>
          </div>
        </div>
      </LessonSection>

      <LessonSection title="Constraints">
        <ul className="list-disc space-y-1 pl-5 text-slate-300">
          <li>
            <strong className="text-white">
              1 ≤ arr.length ≤ 10<sup>5</sup>
            </strong>
          </li>
          <li>
            <strong className="text-white">
              −10<sup>9</sup> ≤ arr[i] ≤ 10<sup>9</sup>
            </strong>
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Approach">
        <p>
          Scan <strong className="text-white">right → left</strong> and keep a{' '}
          <strong className="text-white">monotonic increasing stack</strong> of candidates that can
          still be a next smaller for indices further left.
        </p>

        <ContentStep number={1} title="Initialize">
          <p>
            <code className="font-mono text-sm">result = [-1] * n</code>, empty stack. Default NSE
            is -1 until we find a smaller neighbor on the right.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Pop while top is not smaller">
          <ul className="list-disc space-y-1 pl-5 text-slate-300">
            <li>
              While stack top <strong className="text-white">≥ current</strong>, pop — it cannot be
              the next smaller for this index.
            </li>
            <li>
              If the stack still has a value, that top is the nearest smaller on the right.
            </li>
            <li>
              Push <code className="font-mono text-sm">arr[i]</code> as a candidate for the left.
            </li>
          </ul>
          <Callout variant="insight">
            NGE pops while <code className="font-mono text-xs">top ≤ current</code>. NSE pops while{' '}
            <code className="font-mono text-xs">top ≥ current</code>. Flip the comparison, keep the
            pattern.
          </Callout>
        </ContentStep>

        <ContentStep number={3} title="Flow">
          <Flowchart
            title="nextSmallerElements flow"
            chart={`flowchart TB
  A([i from n-1 down to 0]) --> B{stack and top ≥ arr[i]?}
  B -- yes --> C[pop]
  C --> B
  B -- no --> D{stack non-empty?}
  D -- yes --> E["result[i] = stack top"]
  D -- no --> F["result[i] stays -1"]
  E --> G["push arr[i]"]
  F --> G
  G --> H{more?}
  H -- yes --> A
  H -- no --> I([return result])`}
          />
        </ContentStep>

        <ContentStep number={4} title="Walkthrough — arr = [4, 8, 5, 2, 25]">
          <Flowchart
            title="stack & result step by step"
            chart={`flowchart TB
  A["i=4, val=25 → empty → -1 → push 25"] --> B["i=3, val=2 → pop 25 → empty → -1 → push 2"]
  B --> C["i=2, val=5 → top 2 < 5 → result=2 → push 5"]
  C --> D["i=1, val=8 → top 5 < 8 → result=5 → push 8"]
  D --> E["i=0, val=4 → pop 8,5 (≥4) → top 2 → result=2 → push 4"]
  E --> F["result = [2, 5, 2, -1, -1]"]`}
          />
        </ContentStep>
      </LessonSection>

      <LessonSection title="Implementation">
        <Example title="Solution">{`class Solution:
    def nextSmallerElements(self, arr):
        stack = []
        result = [-1] * len(arr)

        for i in range(len(arr) - 1, -1, -1):
            if stack:
                while stack and stack[-1] >= arr[i]:
                    stack.pop()
                if stack:
                    result[i] = stack[-1]
            stack.append(arr[i])

        return result`}</Example>

        <Example
          title="Usage"
          output={`[2, 5, 2, -1, -1]
[9, 8, 7, -1]
[-1, -1, -1, -1, -1]`}
        >{`sol = Solution()
print(sol.nextSmallerElements([4, 8, 5, 2, 25]))
print(sol.nextSmallerElements([10, 9, 8, 7]))
print(sol.nextSmallerElements([1, 2, 3, 4, 5]))`}</Example>
      </LessonSection>

      <LessonSection title="Complexity Analysis">
        <p className="text-sm font-semibold text-white">Time Complexity</p>
        <p className="mt-2 text-sm text-slate-300">
          <strong className="text-white">O(n)</strong> — each element is pushed once and popped at
          most once; initializing the result is also O(n).
        </p>

        <p className="mt-6 text-sm font-semibold text-white">Space Complexity</p>
        <p className="mt-2 text-sm text-slate-300">
          <strong className="text-white">O(n)</strong> for the result list and up to O(n) for the
          stack in the worst case (e.g. a strictly increasing array).
        </p>
      </LessonSection>

      <KeyTakeaways
        items={[
          'NSE = nearest strictly smaller value on the right, else -1.',
          'Scan right → left; pop while stack top ≥ current.',
          'Same skeleton as NGE — only the comparison flips.',
          'O(n) time amortized, O(n) space.',
        ]}
      />
    </LessonArticle>
  )
}
