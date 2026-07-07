import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../../components/content'

export function DutchNationalFlag() {
  return (
    <LessonArticle>
      <Definition term="Dutch National Flag Algorithm">
        <p>
          Named after the Dutch flag&apos;s three colored stripes, this algorithm sorts an array containing only
          three distinct values (classically <code className="font-mono text-sm">0</code>,{' '}
          <code className="font-mono text-sm">1</code>, <code className="font-mono text-sm">2</code>) in a single
          pass with <strong className="text-white">O(n)</strong> time and <strong className="text-white">O(1)</strong>{' '}
          extra space. It is also called <strong className="text-white">three-way partitioning</strong> — the idea
          behind efficient 3-way quicksort.
        </p>
      </Definition>

      <ContentStep number={1} title="Three pointers">
        <Flowchart
          title="low | mid | high regions"
          chart={`
flowchart TB
  A["low — boundary of 0s"]
  B["mid — current scan"]
  C["high — boundary of 2s"]
  D["0s left of low, 1s between low and mid, 2s right of high"]

  A --> B
  B --> C
  C --> D
        `}
        />
        <p>
          Invariant: <code className="font-mono text-sm">[0..low-1]</code> = 0s,{' '}
          <code className="font-mono text-sm">[low..mid-1]</code> = 1s,{' '}
          <code className="font-mono text-sm">[high+1..end]</code> = 2s.{' '}
          <code className="font-mono text-sm">[mid..high]</code> is unclassified.
        </p>
      </ContentStep>

      <ContentStep number={2} title="Implementation">
        <Example
          title="dutch_national_flag"
          output={`[0, 0, 1, 1, 2, 2, 2]`}
        >{`def dutch_national_flag(nums):
    low, mid, high = 0, 0, len(nums) - 1
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:  # nums[mid] == 2
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
            # do not advance mid — swapped value needs inspection
    return nums

print(dutch_national_flag([2, 0, 2, 1, 1, 0, 2]))`}</Example>
        <p>
          On <code className="font-mono text-sm">0</code>: swap to the low region and advance both low and mid. On{' '}
          <code className="font-mono text-sm">1</code>: already in the middle — just advance mid. On{' '}
          <code className="font-mono text-sm">2</code>: swap to the high region and shrink high — mid stays to
          inspect the swapped-in value.
        </p>
      </ContentStep>

      <ContentStep number={3} title="Sort colors (LeetCode 75)">
        <Callout variant="info">
          The classic interview problem &quot;Sort Colors&quot; is exactly this algorithm. Do not use a counting sort
          with three buckets unless asked — the one-pass pointer solution is what interviewers expect.
        </Callout>
      </ContentStep>

      <ContentStep number={4} title="Link to quicksort">
        <p>
          3-way quicksort uses the same idea: partition into less than, equal to, and greater than pivot — efficient
          when many duplicate keys. Dutch national flag is the special case with three fixed values.
        </p>
        <Callout variant="insight">
          Time <strong className="text-white">O(n)</strong> — each element visited once. Space{' '}
          <strong className="text-white">O(1)</strong> — in-place swaps only.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Three pointers: low (0s), mid (scan), high (2s).',
          'On 2: swap with high and decrement high — do not move mid.',
          'On 0: swap with low, advance both low and mid.',
          'O(n) one-pass — foundation for 3-way quicksort.',
        ]}
      />
    </LessonArticle>
  )
}
