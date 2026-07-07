import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function KmpAlgorithm() {
  return (
    <LessonArticle>
      <Definition term="KMP — Knuth-Morris-Pratt">
        <p>
          <strong className="text-white">KMP</strong> preprocesses the pattern into an{' '}
          <strong className="text-white">LPS array</strong> (longest proper prefix that is also a suffix) — also
          called the <strong className="text-white">prefix function</strong>. When a mismatch occurs, shift the
          pattern using LPS instead of restarting from the next text character.
        </p>
      </Definition>

      <ContentStep number={1} title="LPS idea">
        <Flowchart
          title="On mismatch at pattern[j]"
          chart={`
flowchart TB
  A["Characters matched so far"]
  B["Mismatch at pattern[j]"]
  C["j = lps[j-1] — fall back to longest border"]
  D["Continue comparing without moving text pointer"]

  A --> B
  B --> C
  C --> D
        `}
        />
        <p>
          For pattern <code className="font-mono text-sm">ababaca</code>, LPS ends with{' '}
          <code className="font-mono text-sm">[0,0,1,2,3,0,1]</code> — at a mismatch you know how much of the
          prefix already aligns.
        </p>
      </ContentStep>

      <ContentStep number={2} title="Build LPS">
        <Example
          title="build_lps"
          output={`[0, 0, 1, 2, 3, 0, 1]`}
        >{`def build_lps(pattern):
    m = len(pattern)
    lps = [0] * m
    length = 0
    i = 1
    while i < m:
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        elif length:
            length = lps[length - 1]
        else:
            lps[i] = 0
            i += 1
    return lps

print(build_lps("ababaca"))`}</Example>
      </ContentStep>

      <ContentStep number={3} title="Search">
        <Example
          title="kmp_search"
          output={`[0, 2, 4]`}
        >{`def kmp_search(text, pattern):
    if not pattern:
        return []
    lps = build_lps(pattern)
    matches = []
    i = j = 0
    while i < len(text):
        if text[i] == pattern[j]:
            i += 1
            j += 1
            if j == len(pattern):
                matches.append(i - j)
                j = lps[j - 1]
        elif j:
            j = lps[j - 1]
        else:
            i += 1
    return matches

print(kmp_search("abababaca", "aba"))`}</Example>
        <Callout variant="insight">
          Time <strong className="text-white">O(n + m)</strong> — text pointer i never moves backward. Space{' '}
          <strong className="text-white">O(m)</strong> for LPS.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'LPS[i] = length of longest proper prefix of pattern[0..i] that is also a suffix.',
          'On mismatch: j = lps[j-1], do not decrement text index i.',
          'On full match: record position, j = lps[j-1] for overlapping matches.',
          'O(n + m) — classic linear pattern matching.',
        ]}
      />
    </LessonArticle>
  )
}
