import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function IntroductionToBitManipulation() {
  return (
    <LessonArticle>
      <Definition term="Bit Manipulation">
        <p>
          Computers store integers as <strong className="text-white">binary</strong> — sequences of 0s and 1s.{' '}
          <strong className="text-white">Bit manipulation</strong> means reading and changing individual bits with
          bitwise operators instead of arithmetic. It shows up in flags, permissions, compression, hashing, and
          compact set representations.
        </p>
      </Definition>

      <ContentStep number={1} title="Binary refresher">
        <Example
          title="binary"
          output={`0b1010
10
0b1111`}
        >{`n = 10
print(bin(n))        # '0b1010'
print(int("1010", 2))  # 10
print(0b1111)        # 15 — literal in Python`}</Example>
        <p>
          In <code className="font-mono text-sm">1010</code>, the rightmost bit is position 0 (least significant). Each
          position is a power of two: 8 + 0 + 2 + 0 = 10.
        </p>
      </ContentStep>

      <ContentStep number={2} title="Two's complement (signed integers)">
        <Callout variant="info">
          Negative integers use <strong className="text-white">two&apos;s complement</strong>: flip bits and add 1.
          In Python 3, integers have arbitrary precision —{' '}
          <code className="font-mono text-sm">-1</code> is conceptually all 1-bits extending left. This matters for{' '}
          <code className="font-mono text-sm">~x</code> and right shifts on negative numbers.
        </Callout>
      </ContentStep>

      <ContentStep number={3} title="Why learn this">
        <ul className="list-disc space-y-2 pl-5 text-gray-300">
          <li>
            <strong className="text-white">Compact state</strong> — pack 32 on/off flags in one int.
          </li>
          <li>
            <strong className="text-white">Fast math</strong> — multiply/divide by powers of 2 with shifts.
          </li>
          <li>
            <strong className="text-white">Elegant logic</strong> — XOR cancels pairs; masks select bit ranges.
          </li>
          <li>
            <strong className="text-white">Subset enumeration</strong> — loop masks from 0 to 2ⁿ − 1.
          </li>
        </ul>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Integers are binary; Python supports 0b literals and bin().',
          'Bit position 0 is the least significant (rightmost).',
          'Signed negatives use two\'s complement — mind ~ and >> on negatives.',
          'Bits pack flags, speed up certain math, and encode subsets.',
        ]}
      />
    </LessonArticle>
  )
}
