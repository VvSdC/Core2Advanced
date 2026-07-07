import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function RabinKarp() {
  return (
    <LessonArticle>
      <Definition term="Rabin-Karp">
        <p>
          <strong className="text-white">Rabin-Karp</strong> hashes the pattern and each length-m substring of the
          text. Equal hashes suggest a match — confirm with a direct character comparison to handle collisions. A{' '}
          <strong className="text-white">rolling hash</strong> updates the hash in O(1) as the window slides.
        </p>
      </Definition>

      <ContentStep number={1} title="Rolling hash">
        <Flowchart
          title="Slide window by one character"
          chart={`
flowchart TB
  A["hash = hash of text[i..i+m-1]"]
  B["Slide: remove text[i], add text[i+m]"]
  C{"hash == pattern_hash?"}
  D["Verify characters — record match"]
  E["Next position"]

  A --> B
  B --> C
  C -->|Yes| D
  C -->|No| E
  D --> E
  E --> B
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="Implementation">
        <Example
          title="rabin_karp"
          output={`[0, 2, 4]`}
        >{`def rabin_karp(text, pattern):
    n, m = len(text), len(pattern)
    if m == 0 or m > n:
        return []
    base, mod = 256, 1_000_000_007
    h = pow(base, m - 1, mod)

    pat_hash = text_hash = 0
    for i in range(m):
        pat_hash = (pat_hash * base + ord(pattern[i])) % mod
        text_hash = (text_hash * base + ord(text[i])) % mod

    matches = []
    for i in range(n - m + 1):
        if pat_hash == text_hash and text[i : i + m] == pattern:
            matches.append(i)
        if i < n - m:
            text_hash = (text_hash - ord(text[i]) * h) % mod
            text_hash = (text_hash * base + ord(text[i + m])) % mod
            text_hash = (text_hash + mod) % mod
    return matches

print(rabin_karp("abababaca", "aba"))`}</Example>
      </ContentStep>

      <ContentStep number={3} title="When to use">
        <Callout variant="insight">
          Average <strong className="text-white">O(n + m)</strong> with few collisions. Worst case O(n × m) if many
          hash collisions. Excellent for <strong className="text-white">multiple pattern</strong> search — hash all
          patterns once and scan text once. Always verify hash matches with direct comparison.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Hash pattern and each window; rolling hash updates in O(1).',
          'Equal hashes → verify with == to avoid false positives.',
          'Use large mod and base to reduce collisions.',
          'Great for multi-pattern search; KMP/Z preferred for single pattern guarantees.',
        ]}
      />
    </LessonArticle>
  )
}
