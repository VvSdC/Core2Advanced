import {
  Callout,
  ContentStep,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function BalancedParenthesis() {
  return (
    <LessonArticle>

      {/* ── Problem Statement ─────────────────────────────────────── */}
      <LessonSection title="Problem Statement">
        <p>
          Given a string <code className="font-mono text-sm">str</code> containing just the characters{' '}
          <code className="font-mono text-sm">(</code>, <code className="font-mono text-sm">)</code>,{' '}
          <code className="font-mono text-sm">{'{'}</code>, <code className="font-mono text-sm">{'}'}</code>,{' '}
          <code className="font-mono text-sm">[</code> and <code className="font-mono text-sm">]</code>, check if
          the input string is valid. Return <code className="font-mono text-sm">True</code> if the string is balanced,
          otherwise return <code className="font-mono text-sm">False</code>.
        </p>
        <p className="mt-3">
          A string is valid when every opening bracket has a matching closing bracket of the same type, and
          brackets close in the correct order.
        </p>

        <div className="mt-4 space-y-4">
          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Example 1</p>
            <p className="mt-2 text-sm text-slate-300">
              <span className="font-semibold text-white">Input:</span>{' '}
              <code className="font-mono text-sm">str = "()[{}()]"</code>
            </p>
            <p className="mt-2 text-sm text-slate-300">
              <span className="font-semibold text-white">Output:</span>{' '}
              <code className="font-mono text-sm">True</code>
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Every open bracket has its corresponding close bracket in the correct order.
            </p>
          </div>

          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Example 2</p>
            <p className="mt-2 text-sm text-slate-300">
              <span className="font-semibold text-white">Input:</span>{' '}
              <code className="font-mono text-sm">str = "[()"</code>
            </p>
            <p className="mt-2 text-sm text-slate-300">
              <span className="font-semibold text-white">Output:</span>{' '}
              <code className="font-mono text-sm">False</code>
            </p>
            <p className="mt-2 text-xs text-slate-400">
              <code className="font-mono text-xs">[</code> never gets closed — the stack is non-empty at the end.
            </p>
          </div>

          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Try it yourself</p>
            <p className="mt-2 text-sm text-slate-300">
              <span className="font-semibold text-white">Input:</span>{' '}
              <code className="font-mono text-sm">str = "&#123;[()]&#125;"</code>
            </p>
            <p className="mt-3 text-sm text-slate-300">
              <span className="font-semibold text-white">Output:</span>{' '}
              <code className="font-mono text-sm">True</code>
            </p>
            <p className="mt-2 text-xs text-slate-400">
              <code className="font-mono text-xs">{'{'}</code> wraps <code className="font-mono text-xs">[()]</code> which
              is itself balanced — nested brackets close in the right order.
            </p>
          </div>
        </div>
      </LessonSection>

      {/* ── Constraints ───────────────────────────────────────────── */}
      <LessonSection title="Constraints">
        <ul className="list-disc space-y-1 pl-5 text-slate-300">
          <li><strong className="text-white">1 ≤ str.length ≤ 10<sup>4</sup></strong></li>
          <li><code className="font-mono text-sm">str</code> consists of parentheses only: <code className="font-mono text-sm">()[]{'{}'}</code></li>
        </ul>
      </LessonSection>

      {/* ── Approach ──────────────────────────────────────────────── */}
      <LessonSection title="Approach">
        <p>
          Use a <strong className="text-white">stack</strong> to track unmatched opening brackets. When you see a
          closing bracket, it must match the most recent opening bracket — exactly what a stack gives you in O(1).
        </p>

        <ContentStep number={1} title="Scan each character">
          <ul className="list-disc space-y-1 pl-5 text-slate-300">
            <li><strong className="text-white">Opening bracket</strong> (<code className="font-mono text-sm">(</code>, <code className="font-mono text-sm">{'{'}</code>, <code className="font-mono text-sm">[</code>) → push onto the stack.</li>
            <li><strong className="text-white">Closing bracket</strong> (<code className="font-mono text-sm">)</code>, <code className="font-mono text-sm">{'}'}</code>, <code className="font-mono text-sm">]</code>) → check if it pairs with the stack top. If not, return <code className="font-mono text-sm">False</code>. If yes, pop.</li>
          </ul>
        </ContentStep>

        <ContentStep number={2} title="Pair matching">
          <p>Three valid pairs:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
            <li><code className="font-mono text-sm">(</code> ↔ <code className="font-mono text-sm">)</code></li>
            <li><code className="font-mono text-sm">{'{'}</code> ↔ <code className="font-mono text-sm">{'}'}</code></li>
            <li><code className="font-mono text-sm">[</code> ↔ <code className="font-mono text-sm">]</code></li>
          </ul>
          <Callout variant="insight">
            A closing bracket that does not match the stack top means wrong nesting — e.g.{' '}
            <code className="font-mono text-sm">([)]</code> fails because <code className="font-mono text-sm">)</code>{' '}
            meets <code className="font-mono text-sm">[</code> instead of <code className="font-mono text-sm">(</code>.
          </Callout>
        </ContentStep>

        <ContentStep number={3} title="Final check">
          <p>
            After processing the entire string, the stack must be empty. Any leftover opening brackets mean the string
            is unbalanced.
          </p>
          <Flowchart
            title="isValid flow"
            chart={`flowchart TB
  A([for each character]) --> B{opening?}
  B -- yes --> C[push onto stack]
  B -- no --> D{stack empty or no pair?}
  D -- yes --> E([return False])
  D -- no --> F[pop from stack]
  C --> G{more chars?}
  F --> G
  G -- yes --> A
  G -- no --> H{stack empty?}
  H -- yes --> I([return True])
  H -- no --> J([return False])`}
          />
        </ContentStep>

        <ContentStep number={4} title="Walkthrough — str = &quot;&#123;[()]&#125;&quot;">
          <Flowchart
            title="stack state step by step"
            chart={`flowchart TB
  A["'{' → push → stack: ['{']"] --> B["'[' → push → stack: ['{', '[']"]
  B --> C["'(' → push → stack: ['{', '[', '(']"]
  C --> D["')' → pop '(' → stack: ['{', '[']"]
  D --> E["']' → pop '[' → stack: ['{']"]
  E --> F["'}' → pop '{' → stack: [] → True"]`}
          />
        </ContentStep>
      </LessonSection>

      {/* ── Implementation ────────────────────────────────────────── */}
      <LessonSection title="Implementation">
        <Example title="Solution">{`from collections import deque


class Solution:
    def isOpen(self, character):
        return character in ('(', '{', '[')

    def isClosed(self, character):
        return character in (')', '}', ']')

    def isPair(self, open_character, closed_character):
        if self.isClosed(open_character) or self.isOpen(closed_character):
            return False
        if open_character == '(' and closed_character == ')':
            return True
        if open_character == '{' and closed_character == '}':
            return True
        if open_character == '[' and closed_character == ']':
            return True
        return False

    def isValid(self, str: str) -> bool:
        dq = deque()

        for character in str:
            if self.isOpen(character):
                dq.append(character)
            elif self.isClosed(character):
                if len(dq) == 0 or not self.isPair(dq[-1], character):
                    return False
                else:
                    dq.pop()

        if len(dq) > 0:
            return False
        return True`}</Example>

        <Example
          title="Usage"
          output={`True
False
True`}
        >{`sol = Solution()
print(sol.isValid("()[{}()]"))  # True
print(sol.isValid("[()"))       # False
print(sol.isValid("{[()]}"))    # True`}</Example>
      </LessonSection>

      {/* ── Complexity ────────────────────────────────────────────── */}
      <LessonSection title="Complexity Analysis">
        <p className="text-sm font-semibold text-white">Time Complexity</p>
        <p className="mt-2 text-sm text-slate-300">
          <strong className="text-white">O(n)</strong> where n is the length of the string. Each character is processed
          exactly once, and every stack operation (push, pop, peek) is O(1).
        </p>

        <p className="mt-6 text-sm font-semibold text-white">Space Complexity</p>
        <p className="mt-2 text-sm text-slate-300">
          <strong className="text-white">O(n)</strong> in the worst case — when the string consists entirely of opening
          brackets (e.g. <code className="font-mono text-sm">"((((("</code>), the stack stores all n characters.
          For a balanced string, the stack depth is at most n/2.
        </p>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Push opening brackets; on a closing bracket, match and pop the stack top.',
          'Return False immediately on mismatch or closing bracket with empty stack.',
          'Stack must be empty at the end — leftover opens mean unbalanced.',
          'O(n) time, O(n) space — classic stack application.',
        ]}
      />
    </LessonArticle>
  )
}
