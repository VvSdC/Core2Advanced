import {
  Callout,
  ContentStep,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function NextGreaterElement() {
  return (
    <LessonArticle>
      <LessonSection title="Problem Statement">
        <p>
          Given an array <code className="font-mono text-sm">arr</code> of size{' '}
          <code className="font-mono text-sm">n</code>, find the{' '}
          <strong className="text-white">next greater element</strong> for each element in order of
          appearance.
        </p>
        <p className="mt-3">
          The next greater element of an element is the{' '}
          <strong className="text-white">nearest element on the right</strong> that is strictly
          greater than the current value. If none exists, use{' '}
          <code className="font-mono text-sm">-1</code>.
        </p>

        <div className="mt-4 space-y-4">
          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Example 1</p>
            <p className="mt-2 text-sm text-slate-300">
              <span className="font-semibold text-white">Input:</span>{' '}
              <code className="font-mono text-sm">arr = [1, 3, 2, 4]</code>
            </p>
            <p className="mt-2 text-sm text-slate-300">
              <span className="font-semibold text-white">Output:</span>{' '}
              <code className="font-mono text-sm">[3, 4, 4, -1]</code>
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Next larger after 1 is 3, after 3 is 4, after 2 is 4, and 4 has nothing greater on the
              right.
            </p>
          </div>

          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Example 2</p>
            <p className="mt-2 text-sm text-slate-300">
              <span className="font-semibold text-white">Input:</span>{' '}
              <code className="font-mono text-sm">arr = [6, 8, 0, 1, 3]</code>
            </p>
            <p className="mt-2 text-sm text-slate-300">
              <span className="font-semibold text-white">Output:</span>{' '}
              <code className="font-mono text-sm">[8, -1, 1, 3, -1]</code>
            </p>
            <p className="mt-2 text-xs text-slate-400">
              6 → 8, 8 has no greater on the right, 0 → 1, 1 → 3, 3 → -1.
            </p>
          </div>

          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Now your turn
            </p>
            <p className="mt-2 text-sm text-slate-300">
              <span className="font-semibold text-white">Input:</span>{' '}
              <code className="font-mono text-sm">arr = [1, 3, 2]</code>
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-300">
              <li>
                <code className="font-mono text-xs">[3, -1, 3]</code>
              </li>
              <li>
                <code className="font-mono text-xs">[3, 2, -1]</code>
              </li>
              <li>
                <code className="font-mono text-xs">[3, -1, -1]</code>
              </li>
              <li>
                <code className="font-mono text-xs">[3, 3, -1]</code>
              </li>
            </ul>
            <p className="mt-3 text-sm text-slate-300">
              <span className="font-semibold text-white">Answer:</span>{' '}
              <code className="font-mono text-sm">[3, -1, -1]</code>
            </p>
            <p className="mt-2 text-xs text-slate-400">
              1 looks right to 3. 3 has nothing larger on the right. 2 also has nothing larger on the
              right — nearest greater must be to the right, not the left.
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
        <Callout variant="tip" title="Why the stack matters">
          n can be 10<sup>5</sup>, so a nested scan for each index is O(n²) and too slow. We need
          amortized O(n).
        </Callout>
      </LessonSection>

      <LessonSection title="Approach">
        <p>
          Scan the array <strong className="text-white">from right to left</strong> and keep a{' '}
          <strong className="text-white">monotonic decreasing stack</strong> of candidates that
          could still be a next greater for elements further left.
        </p>

        <ContentStep number={1} title="Initialize">
          <p>
            Build <code className="font-mono text-sm">result = [-1] * n</code>. Default answer is
            -1 until we find a greater neighbor on the right. Start with an empty stack.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Walk right → left">
          <ul className="list-disc space-y-1 pl-5 text-slate-300">
            <li>
              While the stack top is <strong className="text-white">≤ current</strong>, pop — it
              can never be the next greater for this index (or anyone further left that needs
              something bigger than current).
            </li>
            <li>
              If the stack still has a value, that top is the nearest greater on the right → write
              it into <code className="font-mono text-sm">result[i]</code>.
            </li>
            <li>
              Push <code className="font-mono text-sm">arr[i]</code> onto the stack as a candidate
              for elements to the left.
            </li>
          </ul>
          <Callout variant="insight">
            Each value is pushed once and popped at most once, so the nested while loop is still
            O(n) overall.
          </Callout>
        </ContentStep>

        <ContentStep number={3} title="Why right-to-left?">
          <p>
            When you stand at index i, everything already on the stack came from indices{' '}
            <code className="font-mono text-sm">&gt; i</code> — exactly the right side. The stack
            top is the nearest remaining candidate after stripping smaller-or-equal values.
          </p>
          <Flowchart
            title="nextLargerElement flow"
            chart={`flowchart TB
  A([i from n-1 down to 0]) --> B{stack and top ≤ arr[i]?}
  B -- yes --> C[pop]
  C --> B
  B -- no --> D{stack non-empty?}
  D -- yes --> E["result[i] = stack top"]
  D -- no --> F["result[i] stays -1"]
  E --> G["push arr[i]"]
  F --> G
  G --> H{more indices?}
  H -- yes --> A
  H -- no --> I([return result])`}
          />
        </ContentStep>

        <ContentStep number={4} title="Walkthrough — arr = [1, 3, 2, 4]">
          <Flowchart
            title="stack & result step by step"
            chart={`flowchart TB
  A["i=3, val=4 → stack empty → result[3]=-1 → push 4"] --> B["i=2, val=2 → top 4 > 2 → result[2]=4 → push 2"]
  B --> C["i=1, val=3 → pop 2 (≤3) → top 4 → result[1]=4 → push 3"]
  C --> D["i=0, val=1 → top 3 > 1 → result[0]=3 → push 1"]
  D --> E["result = [3, 4, 4, -1]"]`}
          />
        </ContentStep>
      </LessonSection>

      <LessonSection title="Implementation">
        <Example title="Solution">{`class Solution:
    def nextLargerElement(self, arr):
        result = [-1] * len(arr)
        stack = []

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
          output={`[3, 4, 4, -1]
[8, -1, 1, 3, -1]
[3, -1, -1]`}
        >{`sol = Solution()
print(sol.nextLargerElement([1, 3, 2, 4]))
print(sol.nextLargerElement([6, 8, 0, 1, 3]))
print(sol.nextLargerElement([1, 3, 2]))`}</Example>
      </LessonSection>

      <LessonSection title="Complexity Analysis">
        <p className="text-sm font-semibold text-white">Time Complexity</p>
        <p className="mt-2 text-sm text-slate-300">
          <strong className="text-white">O(n)</strong> where n is the number of elements.
          Initializing <code className="font-mono text-sm">result</code> takes O(n). The main loop
          runs n times. The nested while loop still costs amortized O(1) per index because each
          element is pushed once and popped at most once.
        </p>

        <p className="mt-6 text-sm font-semibold text-white">Space Complexity</p>
        <p className="mt-2 text-sm text-slate-300">
          <strong className="text-white">O(n)</strong> for the result list, plus O(n) for the stack
          in the worst case (e.g. a strictly decreasing array, where nothing ever pops until the
          end).
        </p>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Next greater = nearest strictly larger value on the right, else -1.',
          'Scan right → left with a monotonic stack of candidates.',
          'Pop while stack top ≤ current; then top (if any) is the answer.',
          'O(n) time amortized, O(n) space — classic monotonic stack pattern.',
        ]}
      />
    </LessonArticle>
  )
}
