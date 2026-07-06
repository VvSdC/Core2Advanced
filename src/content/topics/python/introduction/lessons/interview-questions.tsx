import {
  Callout,
  ContentStep,
  Definition,
  Example,
  InterviewQA,
  InterviewSection,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function InterviewQuestions() {
  return (
    <LessonArticle>
      <Definition term="Python Internals — Interview Questions">
        <p>
          These are the kinds of questions interviewers actually ask — including "what does this code print?",
          exception behavior, and traps that look simple but behave unexpectedly. Answers include runnable examples
          so you can verify in a REPL.
        </p>
        <p>
          Try solving each one before reading the answer. For deeper explanations, revisit the earlier lessons in
          this sub-topic.
        </p>
      </Definition>

      <Callout variant="info" title="How to use this lesson">
        Many questions show a code snippet first. Cover the answer, predict the output, then check. Understanding{' '}
        <em>why</em> matters more than memorizing output.
      </Callout>

      <ContentStep number={1} title="Tricky output — real interview favorites">
        <InterviewSection title="What does this code do?">
          <InterviewQA number={1} question="What is wrong with def add_item(item, bucket=[])?">
            <p>
              The default <code className="font-mono text-sm">[]</code> is created{' '}
              <strong className="text-white">once</strong> when the function is defined — not on each call. Every
              caller that omits <code className="font-mono text-sm">bucket</code> shares the same list.
            </p>
            <Example
              title="The trap"
              output={`[1]
[1, 2]   ← surprise! first call's item is still there`}
            >{`def add_item(item, bucket=[]):
    bucket.append(item)
    return bucket

print(add_item(1))
print(add_item(2))`}</Example>
            <p>
              Fix: use <code className="font-mono text-sm">bucket=None</code> and create{' '}
              <code className="font-mono text-sm">[]</code> inside the function body.
            </p>
          </InterviewQA>

          <InterviewQA number={2} question="What is [[1]] * 3? Why do interviewers ask this?">
            <p>
              It creates <strong className="text-white">three references to the same inner list</strong>, not three
              independent lists.
            </p>
            <Example
              output={`[[1, 99], [1, 99], [1, 99]]`}
            >{`row = [[1]]
grid = row * 3
grid[0].append(99)
print(grid)`}</Example>
            <p>
              Use a list comprehension for independent rows:{' '}
              <code className="font-mono text-sm">[[1] for _ in range(3)]</code>.
            </p>
          </InterviewQA>

          <InterviewQA number={3} question="b = a; b += [4] vs b = a + [4] — what is the difference?">
            <p>
              <code className="font-mono text-sm">+=</code> on a list calls <code className="font-mono text-sm">extend</code>{' '}
              <em>in place</em> when <code className="font-mono text-sm">b</code> references the same object as{' '}
              <code className="font-mono text-sm">a</code>. <code className="font-mono text-sm">+</code> always
              creates a new list.
            </p>
            <Example
              output={`[1, 2, 3, 4]   ← a changed
[1, 2, 3]        ← a unchanged`}
            >{`a = [1, 2, 3]
b = a
b += [4]
print(a)

a = [1, 2, 3]
b = a
b = a + [4]
print(a)`}</Example>
          </InterviewQA>

          <InterviewQA number={4} question="Is Python pass-by-value or pass-by-reference?">
            <p>
              Python is <strong className="text-white">pass-by-object-reference</strong> (often called "pass by
              assignment"). The function receives a reference to the same object. Reassigning the parameter inside
              the function does not affect the caller. Mutating a mutable object in place does.
            </p>
            <Example
              output={`[99, 2, 3]
10`}
            >{`def rebind(x):
    x = 10          # local rebinding only

def mutate(lst):
    lst[0] = 99     # mutates caller's object

nums = [1, 2, 3]
mutate(nums)
print(nums)

n = 5
rebind(n)
print(n)`}</Example>
          </InterviewQA>

          <InterviewQA number={5} question="Why does 1 is 1 return True but 1000 is 1000 is often False?">
            <p>
              CPython caches small integers (typically -5 through 256) as singletons.{' '}
              <code className="font-mono text-sm">is</code> checks identity (same object in memory), not equality.
              Large integers are separate objects each time.
            </p>
            <Example output={`True
False`}>{`print(1 is 1)
print(1000 is 1000)   # may be False in interactive shell`}</Example>
            <p>
              Always use <code className="font-mono text-sm">==</code> for value comparison. Use{' '}
              <code className="font-mono text-sm">is</code> only for singletons like <code className="font-mono text-sm">None</code>.
            </p>
          </InterviewQA>

          <InterviewQA number={6} question="What happens if you add items to a list while iterating over it?">
            <p>
              You can skip elements or get confusing behavior because the iterator does not see new items at positions
              already passed. Modifying size during iteration is a common bug.
            </p>
            <Example
              output={`[2, 3]   ← 2 was skipped after 1 was removed`}
            >{`nums = [1, 2, 3]
for n in nums:
    if n == 1:
        nums.remove(n)
print(nums)`}</Example>
            <p>
              Iterate over a copy: <code className="font-mono text-sm">for n in nums[:]:</code> or build a new list.
            </p>
          </InterviewQA>

          <InterviewQA number={7} question="What is the output? [x*2 for x in range(3)]">
            <p>
              <code className="font-mono text-sm">[0, 2, 4]</code> — a list comprehension that doubles each value
              from 0, 1, 2.
            </p>
          </InterviewQA>

          <InterviewQA number={8} question="What does (1) vs (1,) mean?">
            <p>
              <code className="font-mono text-sm">(1)</code> is just the integer 1 with parentheses (grouping).{' '}
              <code className="font-mono text-sm">(1,)</code> is a one-element tuple — the comma makes it a tuple.
            </p>
            <Example output={`<class 'int'>
<class 'tuple'>`}>{`print(type((1)))
print(type((1,)))`}</Example>
          </InterviewQA>
        </InterviewSection>
      </ContentStep>

      <ContentStep number={2} title="Exceptions — heavily tested in interviews">
        <InterviewSection title="try / except / else / finally">
          <InterviewQA number={9} question="In what order do try, except, else, and finally run?">
            <p>
              <strong className="text-white">try</strong> runs first. If an exception occurs, matching{' '}
              <strong className="text-white">except</strong> runs. If no exception,{' '}
              <strong className="text-white">else</strong> runs. <strong className="text-white">finally</strong>{' '}
              always runs last (even if return/break/exception).
            </p>
            <Example
              output={`try
except
finally`}
            >{`def demo():
    try:
        print("try")
        return
    except ValueError:
        print("except")
    else:
        print("else")
    finally:
        print("finally")

demo()`}</Example>
          </InterviewQA>

          <InterviewQA number={10} question="When does the else block run in try/except/else?">
            <p>
              Only when the <strong className="text-white">try block completes without raising any exception</strong>.
              It does not run if except handled an error. Use it for code that should run only on success (e.g.
              parsing succeeded, now process result).
            </p>
          </InterviewQA>

          <InterviewQA number={11} question="Does finally run if return is inside try?">
            <p>
              <strong className="text-white">Yes.</strong> <code className="font-mono text-sm">finally</code> runs
              before the function actually returns. This catches many candidates off guard.
            </p>
            <Example output={`finally
42`}>{`def f():
    try:
        return 42
    finally:
        print("finally")

print(f())`}</Example>
          </InterviewQA>

          <InterviewQA number={12} question="except: vs except Exception: — why does it matter?">
            <p>
              Bare <code className="font-mono text-sm">except:</code> catches{' '}
              <strong className="text-white">everything</strong>, including{' '}
              <code className="font-mono text-sm">KeyboardInterrupt</code> and{' '}
              <code className="font-mono text-sm">SystemExit</code> — making your program hard to stop.{' '}
              <code className="font-mono text-sm">except Exception:</code> catches normal errors but lets Ctrl+C
              through.
            </p>
            <p className="mt-2">
              In production code, catch specific exceptions:{' '}
              <code className="font-mono text-sm">except ValueError:</code>,{' '}
              <code className="font-mono text-sm">except OSError:</code>.
            </p>
          </InterviewQA>

          <InterviewQA number={13} question="What is the exception hierarchy? BaseException vs Exception?">
            <p>
              <code className="font-mono text-sm">BaseException</code> is the root — includes{' '}
              <code className="font-mono text-sm">SystemExit</code>,{' '}
              <code className="font-mono text-sm">KeyboardInterrupt</code>,{' '}
              <code className="font-mono text-sm">GeneratorExit</code>.{' '}
              <code className="font-mono text-sm">Exception</code> is the base for most errors you handle:{' '}
              <code className="font-mono text-sm">ValueError</code>,{' '}
              <code className="font-mono text-sm">TypeError</code>,{' '}
              <code className="font-mono text-sm">KeyError</code>, etc.
            </p>
            <p className="mt-2">
              Catch <code className="font-mono text-sm">Exception</code> in apps; rarely catch{' '}
              <code className="font-mono text-sm">BaseException</code>.
            </p>
          </InterviewQA>

          <InterviewQA number={14} question="What is EAFP vs LBYL? Which is more Pythonic?">
            <p>
              <strong className="text-white">LBYL</strong> (Look Before You Leap): check first with if —{' '}
              <code className="font-mono text-sm">if key in d:</code>.{' '}
              <strong className="text-white">EAFP</strong> (Easier to Ask Forgiveness than Permission): try the
              operation and handle the exception — <code className="font-mono text-sm">try: d[key]</code>.
            </p>
            <p className="mt-2">
              Python culture favors EAFP when the success path is common and exceptions are clear. Use LBYL when
              the check is cheap and readability wins.
            </p>
            <Example title="EAFP pattern">{`try:
    value = config["timeout"]
except KeyError:
    value = 30   # default`}</Example>
          </InterviewQA>

          <InterviewQA number={15} question="d[key] vs d.get(key) — what exception can d[key] raise?">
            <p>
              <code className="font-mono text-sm">d[key]</code> raises <strong className="text-white">KeyError</strong>{' '}
              if the key is missing. <code className="font-mono text-sm">d.get(key)</code> returns{' '}
              <code className="font-mono text-sm">None</code> (or a default you provide) without raising.
            </p>
            <Example output={`KeyError
None
99`}>{`d = {"a": 1}
# d["missing"]      # KeyError
print(d.get("missing"))
print(d.get("missing", 99))`}</Example>
          </InterviewQA>

          <InterviewQA number={16} question="What is raise from used for?">
            <p>
              Chains exceptions when wrapping a lower-level error. Preserves the original traceback for debugging
              while raising a domain-specific error.
            </p>
            <Example title="Exception chaining">{`try:
    int("not a number")
except ValueError as exc:
    raise RuntimeError("Invalid user input") from exc`}</Example>
            <p>
              Without <code className="font-mono text-sm">from exc</code>, the original cause can be lost or shown
              less clearly.
            </p>
          </InterviewQA>

          <InterviewQA number={17} question="When should you create a custom exception class?">
            <p>
              When your library or API has specific failure modes callers should catch separately — e.g.{' '}
              <code className="font-mono text-sm">PaymentDeclinedError</code> subclassing{' '}
              <code className="font-mono text-sm">Exception</code>. Keep a shallow hierarchy; inherit from{' '}
              <code className="font-mono text-sm">Exception</code>, not <code className="font-mono text-sm">BaseException</code>.
            </p>
            <Example title="Custom exception">{`class InsufficientFundsError(Exception):
    def __init__(self, balance, amount):
        self.balance = balance
        self.amount = amount
        super().__init__(f"Need {amount}, have {balance}")`}</Example>
          </InterviewQA>

          <InterviewQA number={18} question="What happens if an exception occurs inside a with block?">
            <p>
              The context manager's <code className="font-mono text-sm">__exit__</code> method is still called —
              that is how files get closed even when an error occurs. If <code className="font-mono text-sm">__exit__</code>{' '}
              returns False, the exception propagates; if True, it is suppressed.
            </p>
            <Example title="File always closed">{`with open("data.txt") as f:
    data = f.read()
    raise ValueError("oops")
# file is closed before exception propagates`}</Example>
          </InterviewQA>

          <InterviewQA number={19} question="What raises StopIteration?">
            <p>
              Calling <code className="font-mono text-sm">next()</code> on an exhausted iterator. A{' '}
              <code className="font-mono text-sm">for</code> loop catches this internally to end the loop — you
              normally do not handle it yourself.
            </p>
            <Example output={`StopIteration`}>{`it = iter([1])
next(it)
next(it)   # StopIteration`}</Example>
          </InterviewQA>

          <InterviewQA number={20} question="How do you avoid AttributeError when an attribute might not exist?">
            <p>
              Use <code className="font-mono text-sm">getattr(obj, "attr", default)</code> or{' '}
              <code className="font-mono text-sm">hasattr()</code> (EAFP: try/except AttributeError is often
              cleaner in hot paths).
            </p>
            <Example output={`unknown
42`}>{`class User:
    name = "Ada"

u = User()
print(getattr(u, "email", "unknown"))
print(getattr(u, "name", "unknown"))`}</Example>
          </InterviewQA>
        </InterviewSection>
      </ContentStep>

      <ContentStep number={3} title="Internals — concise revision">
        <InterviewSection title="Under the hood (from earlier lessons)">
          <InterviewQA number={21} question="Is Python compiled or interpreted?">
            <p>
              CPython compiles to <strong className="text-white">bytecode</strong>, then the VM executes it at
              runtime. Not pure interpretation; not direct machine code like C++.
            </p>
          </InterviewQA>

          <InterviewQA number={22} question="What is the GIL and when does it hurt you?">
            <p>
              Global Interpreter Lock — one thread runs Python bytecode at a time per process. Hurts{' '}
              <strong className="text-white">CPU-bound</strong> threading; less impact on{' '}
              <strong className="text-white">I/O-bound</strong> work. Use multiprocessing for CPU parallelism.
            </p>
          </InterviewQA>

          <InterviewQA number={23} question="How does Python free memory?">
            <p>
              Primarily <strong className="text-white">reference counting</strong> (immediate at refcount 0).
              Generational GC cleans <strong className="text-white">circular references</strong> the counter cannot
              handle.
            </p>
          </InterviewQA>

          <InterviewQA number={24} question="Why does sys.getsizeof(42) show ~28 bytes?">
            <p>
              PyObject header overhead — every int is a full object with refcount and type pointer, not a raw 4-byte
              integer.
            </p>
          </InterviewQA>

          <InterviewQA number={25} question="What does 'everything is an object' mean practically?">
            <p>
              Functions, classes, modules, and numbers are objects with type metadata. You can pass functions as
              arguments, inspect types at runtime, and use duck typing.
            </p>
          </InterviewQA>
        </InterviewSection>
      </ContentStep>

      <ContentStep number={4} title="Collections & language mechanics">
        <InterviewSection title="dict, list, set, and more">
          <InterviewQA number={26} question="Can you use a list as a dictionary key? Why or why not?">
            <p>
              <strong className="text-white">No.</strong> Dict keys must be hashable (immutable, fixed hash). Lists
              are mutable → unhashable → <code className="font-mono text-sm">TypeError</code>. Use tuples instead if
              you need a composite key.
            </p>
          </InterviewQA>

          <InterviewQA number={27} question="What is the difference between remove, pop, and discard on a set?">
            <p>
              <code className="font-mono text-sm">remove(x)</code> — deletes x, raises{' '}
              <code className="font-mono text-sm">KeyError</code> if missing.{' '}
              <code className="font-mono text-sm">discard(x)</code> — deletes x, no error if missing.{' '}
              <code className="font-mono text-sm">pop()</code> — removes and returns an arbitrary element; raises{' '}
              <code className="font-mono text-sm">KeyError</code> on empty set.
            </p>
          </InterviewQA>

          <InterviewQA number={28} question="What is *args and **kwargs?">
            <p>
              <code className="font-mono text-sm">*args</code> collects extra positional arguments into a tuple.{' '}
              <code className="font-mono text-sm">**kwargs</code> collects extra keyword arguments into a dict.
              Common in wrappers and APIs that forward arguments.
            </p>
            <Example output={`(1, 2, 3) {'z': 9}`}>{`def log_call(*args, **kwargs):
    print(args, kwargs)

log_call(1, 2, 3, z=9)`}</Example>
          </InterviewQA>

          <InterviewQA number={29} question="What does if __name__ == '__main__': do?">
            <p>
              Runs code only when the file is executed directly, not when imported. Lets a file be both a reusable
              module and a runnable script.
            </p>
          </InterviewQA>

          <InterviewQA number={30} question="== vs is — when must you use is None?">
            <p>
              <code className="font-mono text-sm">==</code> compares values.{' '}
              <code className="font-mono text-sm">is</code> compares identity.{' '}
              <code className="font-mono text-sm">None</code> is a singleton — always use{' '}
              <code className="font-mono text-sm">x is None</code>, never{' '}
              <code className="font-mono text-sm">x == None</code>.
            </p>
          </InterviewQA>
        </InterviewSection>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Mutable default arguments and [[1]]*3 are classic traps — know why they fail.',
          'finally always runs; else runs only when try succeeds without exception.',
          'Catch specific exceptions; avoid bare except.',
          'EAFP (try/except) vs LBYL (if checks) — both have their place.',
          'Use earlier lessons for bytecode, memory, GIL, and object model depth.',
        ]}
      />
    </LessonArticle>
  )
}
