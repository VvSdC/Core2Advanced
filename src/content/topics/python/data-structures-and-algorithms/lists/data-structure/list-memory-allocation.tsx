import {

  Callout,

  ContentStep,

  Definition,

  Example,

  Flowchart,

  KeyTakeaways,

  LessonArticle,

} from '../../../../../../components/content'



export function ListMemoryAllocation() {

  return (

    <LessonArticle>

      <Definition term="List Memory Allocation">

        <p>

          When a Python list runs out of capacity, CPython allocates a <em>larger</em> pointer array and copies

          existing references over. It deliberately <strong className="text-white">overallocates</strong> —

          growing by roughly 12.5% for large lists — so repeated{' '}

          <code className="font-mono text-sm">append</code> calls stay{' '}

          <strong className="text-white">amortized O(1)</strong>.

        </p>

      </Definition>



      <ContentStep number={1} title="Growth strategy">

        <Flowchart

          title="append when capacity is full"

          chart={`

flowchart TB

  A["append(item)"]

  F{"size < allocated?"}

  W["Write pointer at ob_size"]

  G["New size ≈ old × 1.125 + const"]

  C["Copy all pointers to new array"]

  D["Write pointer at ob_size"]



  A --> F

  F -->|Yes| W

  F -->|No| G

  G --> C

  C --> D

        `}

        />

        <p>

          For lists with 50,000+ elements, CPython uses a growth factor of about{' '}

          <code className="font-mono text-sm">9/8 ≈ 1.125</code>. Smaller lists use a tuned over-allocation

          table. The extra slots mean the next several appends avoid another resize.

        </p>

        <Callout variant="info">

          <code className="font-mono text-sm">len(lst)</code> is the element count;{' '}

          <code className="font-mono text-sm">lst.__sizeof__()</code> includes unused allocated slots. After many

          appends and pops, <code className="font-mono text-sm">lst.clear()</code> or rebuilding may reclaim

          excess capacity.

        </Callout>

      </ContentStep>



      <ContentStep number={2} title="Amortized O(1) append">

        <Example

          title="Most appends are cheap"

        >{`# Each append is O(1) when capacity remains

items = []

for i in range(1_000_000):

    items.append(i)   # occasional O(n) resize, spread over n appends



# Average cost per append → O(1) amortized`}</Example>

        <p>

          One resize copies every existing pointer — O(n) for that single append. But because growth is

          multiplicative, resizes are rare. Spread over n appends, the average cost per append is constant —

          classic <strong className="text-white">amortized analysis</strong>.

        </p>

      </ContentStep>



      <ContentStep number={3} title="Why insert at middle is O(n)">

        <Example

          title="insert(0, x) shifts every element"

          output={`[0, 1, 2, 3, 4]`}

        >{`nums = [1, 2, 3, 4]

nums.insert(0, 0)    # every pointer moves one slot right

print(nums)`}</Example>

        <p>

          Inserting at index <code className="font-mono text-sm">i</code> requires shifting all pointers from

          index <code className="font-mono text-sm">i</code> onward — O(n − i) work. Worst case: insert at

          index 0 shifts the entire array.

        </p>

        <Callout variant="insight">

          Interview pattern: use <code className="font-mono text-sm">append</code> /{' '}

          <code className="font-mono text-sm">pop</code> at the end for O(1)*; avoid repeated{' '}

          <code className="font-mono text-sm">insert(0, ...)</code> on large lists — that is O(n) per call and

          degrades to O(n²) total. Use <code className="font-mono text-sm">collections.deque</code> for

          front inserts.

        </Callout>

      </ContentStep>



      <ContentStep number={4} title="Other O(n) operations">

        <Example

          title="delete and remove shift elements left"

        >{`data = ["a", "b", "c", "d"]

del data[1]          # O(n) — shift c, d left

data.remove("d")     # O(n) search + O(n) shift`}</Example>

        <p>

          <code className="font-mono text-sm">pop()</code> from the end is O(1).{' '}

          <code className="font-mono text-sm">pop(0)</code> is O(n) for the same shift reason as{' '}

          <code className="font-mono text-sm">insert(0, ...)</code>.

        </p>

      </ContentStep>



      <KeyTakeaways

        items={[

          'CPython overallocates (~1.125× growth) so append is amortized O(1).',

          'Occasional resize copies all pointers — O(n) — but happens rarely.',

          'insert, del, remove, pop(0) shift elements — O(n) in the worst case.',

          'Use deque when you need frequent inserts or deletes at both ends.',

        ]}

      />

    </LessonArticle>

  )

}


