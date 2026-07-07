import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function ManachersAlgorithm() {
  return (
    <LessonArticle>
      <Definition term="Manacher's Algorithm">
        <p>
          <strong className="text-white">Manacher&apos;s algorithm</strong> finds the{' '}
          <strong className="text-white">longest palindromic substring</strong> in O(n) time. It transforms the
          string with sentinels (e.g. <code className="font-mono text-sm">#a#b#a#</code>) and reuses palindrome
          radius information from the mirror position inside the current rightmost palindrome.
        </p>
      </Definition>

      <ContentStep number={1} title="Transformed string">
        <p>
          Insert <code className="font-mono text-sm">#</code> between every character and at both ends so every
          palindrome has a center at some index. Example: <code className="font-mono text-sm">aba</code> →{' '}
          <code className="font-mono text-sm">#a#b#a#</code>.
        </p>
        <Flowchart
          title="Mirror within rightmost palindrome"
          chart={`
flowchart TB
  A["Track center C and right boundary R"]
  B["Mirror i across C → j"]
  C["p[i] = min(p[j], R - i) as lower bound"]
  D["Expand while characters match"]
  E["Update C, R if palindrome extends past R"]

  A --> B
  B --> C
  C --> D
  D --> E
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="Implementation">
        <Example
          title="longest_palindrome"
          output={`bab`}
          caption="Longest palindrome in babad"
        >{`def longest_palindrome(s):
    if not s:
        return ""
    t = "#" + "#".join(s) + "#"
    n = len(t)
    p = [0] * n
    center = right = 0
    best_len = best_center = 0

    for i in range(n):
        mirror = 2 * center - i
        if i < right:
            p[i] = min(right - i, p[mirror])
        while i - p[i] - 1 >= 0 and i + p[i] + 1 < n and t[i - p[i] - 1] == t[i + p[i] + 1]:
            p[i] += 1
        if i + p[i] > right:
            center, right = i, i + p[i]
        if p[i] > best_len:
            best_len, best_center = p[i], i

    start = (best_center - best_len) // 2
    return s[start : start + best_len]

print(longest_palindrome("babad"))`}</Example>
        <p>
          <code className="font-mono text-sm">p[i]</code> is the palindrome radius at index i in the transformed
          string. Map back to original indices with <code className="font-mono text-sm">start = (center - radius) // 2</code>.
        </p>
      </ContentStep>

      <ContentStep number={3} title="Complexity">
        <Callout variant="insight">
          Time <strong className="text-white">O(n)</strong> — each character causes at most one extension past the
          right boundary. Space <strong className="text-white">O(n)</strong> for the transformed string and radius
          array. Beats the O(n²) expand-around-center approach on long strings.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Transform s → #s# with # between chars for unified odd/even centers.',
          'p[i] = palindrome radius; mirror within [C-R, C+R] for O(1) seed.',
          'Expand outward while chars match; update global right boundary.',
          'O(n) longest palindromic substring.',
        ]}
      />
    </LessonArticle>
  )
}
