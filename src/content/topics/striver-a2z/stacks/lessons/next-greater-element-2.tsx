import {
  Callout,
  ContentStep,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function NextGreaterElement2() {
  return (
    <LessonArticle>
      <LessonSection title="Problem Statement">
        <p>
          Given a <strong className="text-white">circular</strong> integer array{' '}
          <code className="font-mono text-sm">arr</code>, return the next greater element for every
          element.
        </p>
        <p className="mt-3">
          For an element <code className="font-mono text-sm">x</code>, the next greater element is
          the <strong className="text-white">first value greater than x</strong> you meet while
          walking the array <strong className="text-white">clockwise</strong> (you may wrap past the
          end back to the start). If none exists, use{' '}
          <code className="font-mono text-sm">-1</code>.
        </p>
        <Callout variant="beginner" title="How this differs from NGE-1">
          In Next Greater Element I you only look to the right and stop at the last index. Here the
          array is a circle — after the last element, search continues from index 0 until you get
          back to where you started.
        </Callout>

        <div className="mt-4 space-y-4">
          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Example 1</p>
            <p className="mt-2 text-sm text-slate-300">
              <span className="font-semibold text-white">Input:</span>{' '}
              <code className="font-mono text-sm">arr = [3, 10, 4, 2, 1, 2, 6, 1, 7, 2, 9]</code>
            </p>
            <p className="mt-2 text-sm text-slate-300">
              <span className="font-semibold text-white">Output:</span>{' '}
              <code className="font-mono text-sm">[10, -1, 6, 6, 2, 6, 7, 7, 9, 9, 10]</code>
            </p>
            <p className="mt-2 text-xs text-slate-400">
              3 → 10; 10 has no greater anywhere in the circle → -1; later values wrap when needed
              (e.g. the last 9 finds 10 after wrapping).
            </p>
          </div>

          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Example 2</p>
            <p className="mt-2 text-sm text-slate-300">
              <span className="font-semibold text-white">Input:</span>{' '}
              <code className="font-mono text-sm">arr = [5, 7, 1, 7, 6, 0]</code>
            </p>
            <p className="mt-2 text-sm text-slate-300">
              <span className="font-semibold text-white">Output:</span>{' '}
              <code className="font-mono text-sm">[7, -1, 7, -1, 7, 5]</code>
            </p>
            <p className="mt-2 text-xs text-slate-400">
              5 → 7; both 7s have no greater in the circle → -1; 0 wraps and finds 5.
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
                <code className="font-mono text-xs">[2, 3, 4, 5, 5]</code>
              </li>
              <li>
                <code className="font-mono text-xs">[5, 5, 5, 5, -1]</code>
              </li>
              <li>
                <code className="font-mono text-xs">[2, 3, 4, 5, 2]</code>
              </li>
              <li>
                <code className="font-mono text-xs">[2, 3, 4, 5, -1]</code>
              </li>
            </ul>
            <p className="mt-3 text-sm text-slate-300">
              <span className="font-semibold text-white">Answer:</span>{' '}
              <code className="font-mono text-sm">[2, 3, 4, 5, -1]</code>
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Each value finds the next larger immediately to its right. For 5, wrapping gives 1, 2,
              3, 4 — nothing greater — so -1 (not 5, and not wrapping to a smaller “fake” answer).
            </p>
          </div>
        </div>
      </LessonSection>

      <LessonSection title="Constraints">
        <ul className="list-disc space-y-1 pl-5 text-slate-300">
          <li>
            <strong className="text-white">
              1 ≤ n ≤ 10<sup>5</sup>
            </strong>
          </li>
          <li>
            <strong className="text-white">
              0 ≤ arr[i] ≤ 10<sup>9</sup>
            </strong>
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Approach">
        <p>
          Reuse the <strong className="text-white">right-to-left monotonic stack</strong> idea from
          NGE-1, but <strong className="text-white">seed the stack</strong> with a reversed copy of
          the array first. That pretends you already walked one full clockwise lap — so when you
          process the real right-to-left pass, wrap-around candidates are already available.
        </p>

        <ContentStep number={1} title="Seed the stack">
          <p>
            Start with <code className="font-mono text-sm">stack = arr[::-1]</code>. Top of the
            stack is <code className="font-mono text-sm">arr[0]</code>, then{' '}
            <code className="font-mono text-sm">arr[1]</code>, … — the order you would meet values
            if you wrapped past the end and kept going.
          </p>
          <Callout variant="insight">
            Another common pattern is to loop <code className="font-mono text-xs">2n</code> indices
            with <code className="font-mono text-xs">i % n</code>. Seeding the stack is the same idea
            with one linear pass afterward.
          </Callout>
        </ContentStep>

        <ContentStep number={2} title="Same pop / peek / push as NGE-1">
          <ul className="list-disc space-y-1 pl-5 text-slate-300">
            <li>
              For <code className="font-mono text-sm">i</code> from{' '}
              <code className="font-mono text-sm">n - 1</code> down to{' '}
              <code className="font-mono text-sm">0</code>:
            </li>
            <li>
              Pop while stack top ≤ <code className="font-mono text-sm">arr[i]</code>
            </li>
            <li>
              If stack remains, <code className="font-mono text-sm">result[i] = stack[-1]</code>
            </li>
            <li>
              Push <code className="font-mono text-sm">arr[i]</code>
            </li>
          </ul>
        </ContentStep>

        <ContentStep number={3} title="Why seeding works">
          <p>
            When you are at the last index, the seeded stack already holds earlier elements as
            “to the right via wrap.” After you process each index you push it again, so leftward
            indices still see the correct nearer candidates from the true right side first.
          </p>
          <Flowchart
            title="circular NGE flow"
            chart={`flowchart TB
  A["stack = reverse(arr)"] --> B([i from n-1 down to 0])
  B --> C{stack and top ≤ arr[i]?}
  C -- yes --> D[pop]
  D --> C
  C -- no --> E{stack non-empty?}
  E -- yes --> F["result[i] = stack top"]
  E -- no --> G["result[i] = -1"]
  F --> H["push arr[i]"]
  G --> H
  H --> I{more?}
  I -- yes --> B
  I -- no --> J([return result])`}
          />
        </ContentStep>

        <ContentStep number={4} title="Walkthrough — arr = [5, 7, 1, 7, 6, 0]">
          <p className="text-slate-300">
            Seed <code className="font-mono text-sm">stack = [0, 6, 7, 1, 7, 5]</code> (reverse).
            After the right-to-left pass you get{' '}
            <code className="font-mono text-sm">[7, -1, 7, -1, 7, 5]</code> — notice 0 wraps to 5,
            and the maximum 7s correctly stay -1.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Implementation">
        <Example title="Solution">{`class Solution:
    def nextGreaterElements(self, arr):
        stack = arr[::-1]
        result = [-1] * len(arr)

        for i in range(len(arr) - 1, -1, -1):
            if stack:
                while stack and stack[-1] <= arr[i]:
                    stack.pop()
                if stack:
                    result[i] = stack[-1]
            stack.append(arr[i])

        return result`}</Example>

        <Example
          title="Usage"
          output={`[10, -1, 6, 6, 2, 6, 7, 7, 9, 9, 10]
[7, -1, 7, -1, 7, 5]
[2, 3, 4, 5, -1]`}
        >{`sol = Solution()
print(sol.nextGreaterElements([3, 10, 4, 2, 1, 2, 6, 1, 7, 2, 9]))
print(sol.nextGreaterElements([5, 7, 1, 7, 6, 0]))
print(sol.nextGreaterElements([1, 2, 3, 4, 5]))`}</Example>
      </LessonSection>

      <LessonSection title="Complexity Analysis">
        <p className="text-sm font-semibold text-white">Time Complexity</p>
        <p className="mt-2 text-sm text-slate-300">
          <strong className="text-white">O(n)</strong> where n is the length of the array.
          Building the reversed stack is O(n). The main loop runs n times; each value is pushed and
          popped at most a constant number of times across the whole run, so the while loop is
          amortized O(1) per index.
        </p>

        <p className="mt-6 text-sm font-semibold text-white">Space Complexity</p>
        <p className="mt-2 text-sm text-slate-300">
          <strong className="text-white">O(n)</strong> for the result array and for the stack
          (seeded with a reverse copy, then grown/shrunk during the scan — still linear).
        </p>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Circular NGE: search clockwise and wrap around; else -1.',
          'Seed the monotonic stack with arr[::-1], then run the usual right-to-left pass.',
          'Same pop-while-≤-current rule as NGE-1 — wrapping is handled by the seed.',
          'O(n) time amortized, O(n) space.',
        ]}
      />
    </LessonArticle>
  )
}
