import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function CopyAndAliasing() {
  return (
    <LessonArticle>
      <Definition term="Copy & Aliasing Traps">
        <p>
          Collections in Python are references. Interview questions exploit shared mutable state — list multiplication,
          default arguments, and shallow copies of nested structures.
        </p>
      </Definition>

      <ContentStep number={1} title="List multiplication trap">
        <Example
          title="[[1]] * 3 shares inner lists"
          output={`[[1, 99], [1, 99], [1, 99]]`}
        >{`row = [[1]]
grid = row * 3
grid[0].append(99)
print(grid)`}</Example>
        <p>Fix: <code className="font-mono text-sm">[[1] for _ in range(3)]</code></p>
      </ContentStep>

      <ContentStep number={2} title="+= vs + on lists">
        <Example
          title="In-place vs new object"
          output={`[1, 2, 3, 4]
[1, 2, 3]`}
        >{`a = [1, 2, 3]
b = a
b += [4]       # mutates a
print(a)

a = [1, 2, 3]
b = a
b = a + [4]    # new list, a unchanged
print(a)`}</Example>
      </ContentStep>

      <ContentStep number={3} title="Dict and set aliasing">
        <Example
          title="Shared references"
        >{`config = {"debug": False}
backup = config
backup["debug"] = True
print(config["debug"])   # True — same dict`}</Example>
        <p>Use <code className="font-mono text-sm">copy.copy()</code> or <code className="font-mono text-sm">copy.deepcopy()</code> — see Introduction → Shallow vs Deep Copy.</p>
      </ContentStep>

      <ContentStep number={4} title="Mutating while iterating">
        <Callout variant="insight">
          Never add/remove from a list while iterating it with for — use a copy, list comprehension, or iterate
          backwards. Classic interview bug.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          '[[x]] * n creates n references to the same inner list.',
          '+= mutates in place when variables share an object; + creates new.',
          'Assignment shares references — copy when you need independence.',
          'Do not mutate a collection during iteration.',
        ]}
      />
    </LessonArticle>
  )
}
