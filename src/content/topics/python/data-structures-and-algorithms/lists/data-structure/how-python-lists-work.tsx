import {

  Callout,

  ContentStep,

  Definition,

  Example,

  Flowchart,

  KeyTakeaways,

  LessonArticle,

  StepSequence,

} from '../../../../../../components/content'



export function HowPythonListsWork() {

  return (

    <LessonArticle>

      <Definition term="How Python Lists Work">

        <p>

          A Python <strong className="text-white">list</strong> is not a linked list. In CPython it is a{' '}

          <strong className="text-white">dynamic array of pointers</strong> — a contiguous block of memory

          holding references to Python objects, wrapped in a <code className="font-mono text-sm">PyListObject</code>.

        </p>

        <p>

          Interviewers ask this to test whether you understand why indexing is O(1) but inserting in the middle

          is O(n), and why lists store references — not the objects themselves.

        </p>

      </Definition>



      <ContentStep number={1} title="PyListObject layout">

        <Flowchart

          title="CPython list internals"

          chart={`

flowchart TB

  OB["ob_size (length)"]

  AL["allocated (capacity)"]

  ARR["ob_item → pointer array"]

  O0["object at index 0"]

  O1["object at index 1"]

  O2["object at index 2"]



  OB --> AL

  AL --> ARR

  ARR --> O0

  O0 --> O1

  O1 --> O2

        `}

        />

        <StepSequence

          steps={[

            {

              title: 'ob_size',

              description: 'Current number of elements (what len() returns).',

            },

            {

              title: 'allocated',

              description: 'Capacity of the pointer array — often larger than ob_size after growth.',

            },

            {

              title: 'ob_item',

              description: 'C array of PyObject* — each slot is a pointer (reference) to a Python object elsewhere in memory.',

            },

          ]}

        />

        <Callout variant="insight">

          The list container stores <em>pointers</em>, not embedded object data. A list of three integers

          holds three references; the actual int objects live separately on the heap.

        </Callout>

      </ContentStep>



      <ContentStep number={2} title="Why indexing is O(1)">

        <Example

          title="Direct offset into the pointer array"

          output={`20

cherry`}

        >{`nums = [10, 20, 30]

fruits = ["apple", "banana", "cherry"]



print(nums[1])       # pointer at offset 1 → int 20

print(fruits[-1])    # offset computed from length → str "cherry"`}</Example>

        <p>

          To fetch <code className="font-mono text-sm">lst[i]</code>, CPython computes{' '}

          <code className="font-mono text-sm">base + i * sizeof(pointer)</code> and dereferences once. No scan,

          no traversal — constant time regardless of list length.

        </p>

      </ContentStep>



      <ContentStep number={3} title="Dynamic, not linked">

        <Example

          title="Lists grow and shrink in place"

          output={`3

4`}

        >{`data = [1, 2, 3]

data.append(4)       # may resize the pointer array

print(len(data))



data.pop()           # ob_size decreases; capacity may stay

print(len(data))`}</Example>

        <p>

          Unlike a linked list (O(n) random access), Python lists trade insertion cost for fast reads. This is

          why <code className="font-mono text-sm">collections.deque</code> exists when you need O(1) inserts at

          both ends.

        </p>

        <Callout variant="beginner">

          Think of a Python list as a <strong className="text-white">resizable array of references</strong> —

          similar to Java&apos;s <code className="font-mono text-sm">ArrayList</code> or C++{' '}

          <code className="font-mono text-sm">std::vector</code>, not a chain of nodes.

        </Callout>

      </ContentStep>



      <KeyTakeaways

        items={[

          'CPython lists are PyListObject — a dynamic array of PyObject* pointers.',

          'Index access is O(1) via pointer arithmetic on a contiguous array.',

          'The list holds references; actual objects live elsewhere on the heap.',

          'Dynamic array design favors fast reads over cheap middle insertions.',

        ]}

      />

    </LessonArticle>

  )

}


