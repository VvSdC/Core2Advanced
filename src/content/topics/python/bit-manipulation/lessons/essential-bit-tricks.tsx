import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function EssentialBitTricks() {
  return (
    <LessonArticle>
      <Definition term="Essential Bit Tricks">
        <p>
          A small toolkit of mask-and-shift patterns covers most bit manipulation tasks: test, set, clear, and toggle
          a single bit, detect powers of two, and isolate the lowest set bit.
        </p>
      </Definition>

      <ContentStep number={1} title="Get, set, clear, toggle">
        <Example
          title="bit_ops"
          output={`True
28
16
16`}
          caption="n = 20 (0b10100), position 2"
        >{`def get_bit(n, i):
    return (n >> i) & 1 == 1

def set_bit(n, i):
    return n | (1 << i)

def clear_bit(n, i):
    return n & ~(1 << i)

def toggle_bit(n, i):
    return n ^ (1 << i)


n = 20
i = 2
print(get_bit(n, i))       # True — bit 2 is 1
print(set_bit(n, 3))       # 0b11100 = 28
print(clear_bit(n, 2))     # 0b10000 = 16
print(toggle_bit(n, 2))    # 0b10000 = 16`}</Example>
        <p>
          <code className="font-mono text-sm">1 &lt;&lt; i</code> is a mask with only bit i set.{' '}
          <code className="font-mono text-sm">~(1 &lt;&lt; i)</code> has every bit 1 except i.
        </p>
      </ContentStep>

      <ContentStep number={2} title="Power of two">
        <Example
          title="is_power_of_two"
          output={`True
False`}
        >{`def is_power_of_two(n):
    return n > 0 and (n & (n - 1)) == 0

print(is_power_of_two(16))
print(is_power_of_two(18))`}</Example>
        <p>
          Powers of two have a single 1-bit. <code className="font-mono text-sm">n &amp; (n - 1)</code> clears that
          lowest set bit — result is 0 only for exact powers of two.
        </p>
      </ContentStep>

      <ContentStep number={3} title="Isolate lowest set bit">
        <Example
          title="lowbit"
          output={`4`}
        >{`n = 20   # 0b10100
lowest = n & -n
print(lowest)   # 0b00100 = 4`}</Example>
        <Callout variant="info">
          Same trick as Fenwick trees: <code className="font-mono text-sm">n &amp; -n</code> returns the value of the
          rightmost 1-bit. Also written as <code className="font-mono text-sm">n &amp; (~n + 1)</code>.
        </Callout>
      </ContentStep>

      <ContentStep number={4} title="Swap without a temp variable">
        <Example
          title="xor_swap"
          output={`5 3
3 5`}
        >{`a, b = 5, 3
a ^= b
b ^= a
a ^= b
print(a, b)   # 3 5`}</Example>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Mask with (1 << i); clear with & ~(1 << i); toggle with ^.',
          'Power of two: n > 0 and (n & (n-1)) == 0.',
          'Lowest set bit: n & -n.',
          'XOR swap exchanges two values without extra storage.',
        ]}
      />
    </LessonArticle>
  )
}
