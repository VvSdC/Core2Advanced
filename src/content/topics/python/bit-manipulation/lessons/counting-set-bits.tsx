import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function CountingSetBits() {
  return (
    <LessonArticle>
      <Definition term="Counting Set Bits">
        <p>
          The <strong className="text-white">population count</strong> (popcount) is how many 1-bits an integer has.
          Useful for parity checks, hamming distance, and problems that ask &quot;how many subsets of size k.&quot;
        </p>
      </Definition>

      <ContentStep number={1} title="Built-in and loop">
        <Example
          title="popcount"
          output={`4
4`}
        >{`n = 0b10110100   # 180

print(n.bit_count())   # Python 3.10+

def popcount_loop(n):
    count = 0
    while n:
        count += n & 1
        n >>= 1
    return count

print(popcount_loop(180))`}</Example>
      </ContentStep>

      <ContentStep number={2} title="Brian Kernighan's algorithm">
        <Example
          title="popcount_kernighan"
          output={`4`}
        >{`def popcount_kernighan(n):
    count = 0
    while n:
        n &= n - 1   # clear lowest set bit
        count += 1
    return count

print(popcount_kernighan(0b10110100))`}</Example>
        <p>
          Each iteration removes one set bit — loop runs once per 1-bit, not once per bit position. Efficient when
          numbers are sparse.
        </p>
      </ContentStep>

      <ContentStep number={3} title="Hamming distance">
        <Example
          title="hamming_distance"
          output={`3`}
          caption="Bits that differ between 1 and 4 (0b001 vs 0b100)"
        >{`def hamming_distance(a, b):
    return (a ^ b).bit_count()

print(hamming_distance(1, 4))`}</Example>
        <Callout variant="insight">
          XOR leaves 1s where bits differ — popcount of <code className="font-mono text-sm">a ^ b</code> is the
          hamming distance. Same pattern for counting bit flips to transform one number into another.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'popcount = number of 1-bits.',
          'bit_count() in Python 3.10+, or loop / Kernighan.',
          'Kernighan: n &= n-1 clears lowest set bit each iteration.',
          'Hamming distance: (a ^ b).bit_count().',
        ]}
      />
    </LessonArticle>
  )
}
