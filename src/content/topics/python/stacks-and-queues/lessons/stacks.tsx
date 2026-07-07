import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function Stacks() {
  return (
    <LessonArticle>
      <Definition term="Stacks">
        <p>
          A <strong className="text-white">stack</strong> is a Last-In, First-Out (LIFO) structure — the last item
          pushed is the first one popped. Think of a stack of plates: you add and remove from the top only.
        </p>
        <p>
          In Python there is no built-in <code className="font-mono text-sm">Stack</code> class. The idiomatic
          approach is a <strong className="text-white">list</strong> with <code className="font-mono text-sm">append</code>{' '}
          and <code className="font-mono text-sm">pop</code>.
        </p>
      </Definition>

      <ContentStep number={1} title="The flow">
        <Flowchart
          title="LIFO operations"
          chart={`
flowchart TB
  A["push(item) — add to top"]
  B["stack grows"]
  C["pop() — remove from top"]
  D["returns most recent item"]

  A --> B
  B --> C
  C --> D
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="List as a stack">
        <Example
          title="append and pop from the end"
          output={`3
[10, 20]`}
        >{`stack = []

stack.append(10)   # push
stack.append(20)
stack.append(30)

print(stack.pop())   # 30 — pop
print(stack)`}</Example>
        <p>
          Both operations are <strong className="text-white">O(1)</strong> amortized at the end of a list — that is
          why Python lists work well as stacks.
        </p>
      </ContentStep>

      <ContentStep number={3} title="Peek without removing">
        <Example
          title="Inspect the top"
          output={`30`}
        >{`stack = [10, 20, 30]

top = stack[-1]        # peek — does not pop
print(top)`}</Example>
        <Callout variant="info">
          <code className="font-mono text-sm">pop()</code> on an empty stack raises{' '}
          <code className="font-mono text-sm">IndexError</code>. Check <code className="font-mono text-sm">if stack</code>{' '}
          first, or use <code className="font-mono text-sm">stack.pop()</code> inside try/except in robust code.
        </Callout>
      </ContentStep>

      <ContentStep number={4} title="Classic use cases">
        <Example
          title="Balanced brackets"
          output={`True
False`}
        >{`def is_balanced(s):
    stack = []
    pairs = {")": "(", "]": "[", "}": "{"}
    for ch in s:
        if ch in "([{":
            stack.append(ch)
        elif ch in ")]}":
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack

print(is_balanced("{[()]}"))
print(is_balanced("(]"))`}</Example>
        <ul className="mt-4 space-y-2 text-slate-300">
          <li>Undo / back navigation — push states, pop to revert</li>
          <li>DFS on graphs and trees — stack replaces recursion</li>
          <li>Expression evaluation and syntax checking</li>
        </ul>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Stack = LIFO — last in, first out.',
          'Use list.append() to push and list.pop() to pop — O(1) at the end.',
          'Peek with stack[-1] without removing.',
          'Common in bracket matching, DFS, and undo stacks.',
        ]}
      />
    </LessonArticle>
  )
}
