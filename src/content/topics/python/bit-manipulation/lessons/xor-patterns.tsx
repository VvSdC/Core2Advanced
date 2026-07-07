import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function XorPatterns() {
  return (
    <LessonArticle>
      <Definition term="XOR Patterns">
        <p>
          XOR has clean algebraic rules: <code className="font-mono text-sm">a ^ a = 0</code>,{' '}
          <code className="font-mono text-sm">a ^ 0 = a</code>, and it is commutative/associative. Pairs cancel —
          leaving the one value that appears an odd number of times.
        </p>
      </Definition>

      <ContentStep number={1} title="Single unique number">
        <Flowchart
          title="XOR all elements"
          chart={`
flowchart TB
  A["result = 0"]
  B["XOR each number into result"]
  C["Duplicates cancel — result is the unique value"]

  A --> B
  B --> C
        `}
        />
        <Example
          title="single_number"
          output={`7`}
        >{`def single_number(nums):
    result = 0
    for x in nums:
        result ^= x
    return result

print(single_number([4, 1, 2, 1, 2, 4, 7]))`}</Example>
      </ContentStep>

      <ContentStep number={2} title="Missing number in 0..n">
        <Example
          title="missing_number"
          output={`2`}
          caption="Array has n numbers from 0..n, one missing"
        >{`def missing_number(nums):
    n = len(nums)
    result = n
    for i, x in enumerate(nums):
        result ^= i ^ x
    return result

print(missing_number([3, 0, 1]))`}</Example>
        <p>
          XOR indices 0…n with all array values — present pairs cancel, leaving the missing index/value.
        </p>
      </ContentStep>

      <ContentStep number={3} title="Two unique numbers">
        <Example
          title="two_single_numbers"
          output={`[3, 5]`}
          caption="Every element appears twice except 3 and 5"
        >{`def two_single_numbers(nums):
    xor_all = 0
    for x in nums:
        xor_all ^= x
    # xor_all = a ^ b — pick a set bit where they differ
    diff_bit = xor_all & -xor_all
    a = 0
    for x in nums:
        if x & diff_bit:
            a ^= x
    b = xor_all ^ a
    return [a, b]

print(sorted(two_single_numbers([1, 2, 1, 3, 2, 5])))`}</Example>
        <Callout variant="insight">
          Split the array by whether <code className="font-mono text-sm">diff_bit</code> is set — each half XORs to
          one of the two unique values. Classic extension of the single-number pattern.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'XOR pairs cancel: a ^ a = 0, a ^ 0 = a.',
          'Single odd-occurrence element: XOR entire array.',
          'Missing 0..n: XOR indices and values together.',
          'Two uniques: xor_all, split by diff_bit, XOR each group.',
        ]}
      />
    </LessonArticle>
  )
}
