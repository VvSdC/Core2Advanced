import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function IntroductionToStringAlgorithms() {
  return (
    <LessonArticle>
      <Definition term="String Algorithms">
        <p>
          A <strong className="text-white">string</strong> is a sequence of characters. Many problems ask whether a{' '}
          <strong className="text-white">pattern</strong> appears in a longer <strong className="text-white">text</strong>,
          how often, or what the longest repeating structure is. Naive substring search compares the pattern at every
          text position — <strong className="text-white">O(n × m)</strong> for text length n and pattern length m.
        </p>
      </Definition>

      <ContentStep number={1} title="The naive approach">
        <p>
          For each start index <code className="font-mono text-sm">i</code> in the text, check if{' '}
          <code className="font-mono text-sm">text[i:i+m] == pattern</code>. Simple but slow on repetitive strings
          like <code className="font-mono text-sm">text = &quot;aaaa...ab&quot;</code>,{' '}
          <code className="font-mono text-sm">pattern = &quot;aaaab&quot;</code>.
        </p>
      </ContentStep>

      <ContentStep number={2} title="Smarter algorithms">
        <ul className="list-disc space-y-2 pl-5 text-gray-300">
          <li>
            <strong className="text-white">Z-Algorithm</strong> — preprocess the string into a Z-array of longest
            prefix matches.
          </li>
          <li>
            <strong className="text-white">KMP</strong> — LPS (prefix function) avoids re-comparing known matching
            characters.
          </li>
          <li>
            <strong className="text-white">Rabin-Karp</strong> — hash substrings and compare in O(1) average time.
          </li>
          <li>
            <strong className="text-white">Manacher</strong> — longest palindromic substring in linear time.
          </li>
        </ul>
      </ContentStep>

      <ContentStep number={3} title="Python strings">
        <Callout variant="info">
          Python strings are immutable. Slicing <code className="font-mono text-sm">text[i:j]</code> creates a new
          string — O(k) for slice length k. Algorithm implementations often use indices instead of slices to stay
          linear.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Pattern matching: find pattern of length m in text of length n.',
          'Naive search is O(n × m); advanced methods preprocess for speed.',
          'Z and KMP achieve O(n + m); Rabin-Karp is average-case fast with hashing.',
          'Use index-based loops in Python to avoid hidden slice costs.',
        ]}
      />
    </LessonArticle>
  )
}
