import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function BitwiseOperators() {
  return (
    <LessonArticle>
      <Definition term="Bitwise Operators">
        <p>
          Python applies these operators <em>bit by bit</em> on the binary representation of integers.
        </p>
      </Definition>

      <ContentStep number={1} title="The six operators">
        <Example
          title="operators"
          output={`8
14
6
-13
24
3`}
        >{`a, b = 0b1100, 0b1010   # 12 and 10

print(a & b)    # AND  — 1 where BOTH bits are 1     → 0b1000 = 8
print(a | b)    # OR   — 1 where EITHER bit is 1     → 0b1110 = 14
print(a ^ b)    # XOR  — 1 where bits DIFFER          → 0b0110 = 6
print(~a)       # NOT  — flip every bit               → -(a+1) for finite-width style
print(a << 1)   # left shift  — multiply by 2         → 24
print(a >> 2)   # right shift — floor divide by 4       → 3`}</Example>
      </ContentStep>

      <ContentStep number={2} title="Truth table snapshot">
        <ul className="list-disc space-y-1 pl-5 font-mono text-sm text-gray-300">
          <li>0 & 0 = 0, 0 & 1 = 0, 1 & 1 = 1</li>
          <li>0 | 0 = 0, 0 | 1 = 1, 1 | 1 = 1</li>
          <li>0 ^ 0 = 0, 1 ^ 1 = 0, 0 ^ 1 = 1 — XOR is 0 when bits match</li>
        </ul>
      </ContentStep>

      <ContentStep number={3} title="Python helpers">
        <Example
          title="helpers"
          output={`4
3
2`}
        >{`n = 13          # 0b1101
print(n.bit_length())   # 4 bits needed (excluding sign)
print(n.bit_count())    # 3 ones (Python 3.10+)
print((n >> 1) & 1)     # bit at position 1 → 0`}</Example>
      </ContentStep>

      <ContentStep number={4} title="Pitfalls">
        <Callout variant="insight">
          <code className="font-mono text-sm">&amp;</code> and <code className="font-mono text-sm">|</code> are{' '}
          <em>bitwise</em>, not logical — use <code className="font-mono text-sm">and</code> /{' '}
          <code className="font-mono text-sm">or</code> for boolean logic. Right shift on negatives floors toward
          negative infinity in Python. For fixed-width semantics (e.g. 32-bit), mask with{' '}
          <code className="font-mono text-sm">0xFFFFFFFF</code> when needed.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          '& AND, | OR, ^ XOR, ~ NOT, << left shift, >> right shift.',
          'XOR gives 0 when bits are equal — foundation for many tricks.',
          'Shifts multiply/divide by powers of 2.',
          'bit_count() and bit_length() are handy built-ins.',
        ]}
      />
    </LessonArticle>
  )
}
