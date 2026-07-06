import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../../components/content'

export function ReferencesInLists() {
  return (
    <LessonArticle>
      <Definition term="References in Lists">
        <p>
          Each slot in a Python list stores a <strong className="text-white">reference</strong> (pointer) to an
          object — not a copy of the object. The same object can appear in multiple slots or multiple lists; mutating
          that shared object is visible through every reference.
        </p>
        <p>
          This is one of the most common sources of interview bugs and &quot;surprising&quot; Python behavior.
        </p>
      </Definition>

      <ContentStep number={1} title="Lists hold references, not values">
        <Example
          title="Rebinding a slot vs mutating the object"
          output={`[10, 2, 3]
[1, 2, 3]`}
        >{`nums = [1, 2, 3]
nums[0] = 10          # rebind slot 0 to a new int object
print(nums)

nums[0] += 1          # still rebinds — ints are immutable
print(nums)`}</Example>
        <p>
          Assigning to <code className="font-mono text-sm">nums[0]</code> changes which object that slot points
          to. For immutable types (int, str, tuple), &quot;mutation&quot; always means rebinding.
        </p>
      </ContentStep>

      <ContentStep number={2} title="Same object, multiple slots">
        <Example
          title="One list object referenced twice"
          output={`[[99], [99]]
True`}
        >{`inner = [1]
pair = [inner, inner]   # two slots, same list object

pair[0].append(99)
print(pair)
print(pair[0] is pair[1])   # True — identical object`}</Example>
        <Callout variant="insight">
          <code className="font-mono text-sm">[[1]] * 3</code> creates three references to the{' '}
          <em>same</em> inner list — the classic interview trap. Covered in detail in Shallow &amp; Deep Copy.
        </Callout>
      </ContentStep>

      <ContentStep number={3} title="Mutating shared mutable objects">
        <Example
          title="Append through one variable, see through another"
          output={`['a', 'b', 'c']
['a', 'b', 'c']`}
        >{`shared = ["a", "b"]
alias = shared

alias.append("c")
print(shared)
print(alias)`}</Example>
        <p>
          <code className="font-mono text-sm">alias</code> and <code className="font-mono text-sm">shared</code>{' '}
          are two names for the same list object.{' '}
          <code className="font-mono text-sm">.append()</code> mutates the object in place — both names see the
          change.
        </p>
      </ContentStep>

      <ContentStep number={4} title="Proving identity with id()">
        <Example
          title="id() returns the object address (conceptually)"
          output={`True
True
4481234560
4481234560`}
        >{`a = [1, 2, 3]
b = a
c = [1, 2, 3]

print(a is b)         # True — same object
print(a is c)         # False — equal value, different objects
print(id(a) == id(b)) # True`}</Example>
        <p>
          <code className="font-mono text-sm">is</code> checks object identity (same memory).{' '}
          <code className="font-mono text-sm">==</code> checks value equality. Two lists with identical contents
          are <code className="font-mono text-sm">==</code> but not necessarily <code className="font-mono text-sm">is</code>.
        </p>
        <Callout variant="beginner">
          Interview shorthand: <code className="font-mono text-sm">is</code> for identity,{' '}
          <code className="font-mono text-sm">==</code> for equality. Never use <code className="font-mono text-sm">is</code> to
          compare strings or numbers (except <code className="font-mono text-sm">is None</code>).
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'List slots store references (pointers) to objects on the heap.',
          'The same mutable object can appear in multiple slots or variables.',
          'Mutating a shared object affects every reference to it.',
          'Use is / id() for identity; == for value equality.',
        ]}
      />
    </LessonArticle>
  )
}
