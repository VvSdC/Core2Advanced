import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function ZAlgorithm() {
  return (
    <LessonArticle>
      <Definition term="Z-Algorithm">
        <p>
          The <strong className="text-white">Z-algorithm</strong> builds a <strong className="text-white">Z-array</strong>{' '}
          where <code className="font-mono text-sm">Z[i]</code> is the length of the longest substring starting at
          index <code className="font-mono text-sm">i</code> that matches a prefix of the string. Computed in{' '}
          <strong className="text-white">O(n)</strong> using a sliding &quot;Z-box&quot; [L, R].
        </p>
      </Definition>

      <ContentStep number={1} title="Z-box intuition">
        <Flowchart
          title="Reuse prior Z values"
          chart={`
flowchart TB
  A["Maintain rightmost Z-box L..R"]
  B["For index i inside box: copy from Z[i-L]"]
  C["Otherwise extend match from i"]
  D["Update L, R if new box is farther right"]

  A --> B
  B --> C
  C --> D
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="Build Z-array">
        <Example
          title="build_z"
          output={`[0, 0, 0, 0, 0, 3, 0, 0, 2]`}
          caption="Z for aabxaabx"
        >{`def build_z(s):
    n = len(s)
    z = [0] * n
    l = r = 0
    for i in range(1, n):
        if i <= r:
            z[i] = min(r - i + 1, z[i - l])
        while i + z[i] < n and s[z[i]] == s[i + z[i]]:
            z[i] += 1
        if i + z[i] - 1 > r:
            l, r = i, i + z[i] - 1
    return z

print(build_z("aabxaabx"))`}</Example>
      </ContentStep>

      <ContentStep number={3} title="Pattern matching">
        <Example
          title="z_search"
          output={`[2, 6]`}
          caption="Pattern aba in text abababa"
        >{`def z_search(text, pattern):
    combined = pattern + "$" + text
    z = build_z(combined)
    m = len(pattern)
    matches = []
    for i in range(m + 1, len(combined)):
        if z[i] == m:
            matches.append(i - m - 1)
    return matches

print(z_search("abababa", "aba"))`}</Example>
        <p>
          Concatenate <code className="font-mono text-sm">pattern + &quot;$&quot; + text</code>. A Z-value equal to{' '}
          <code className="font-mono text-sm">len(pattern)</code> means the pattern aligns at that position in the
          text.
        </p>
        <Callout variant="insight">
          Time <strong className="text-white">O(n + m)</strong> for building Z on the combined string. The{' '}
          <code className="font-mono text-sm">$</code> separator must not appear in pattern or text.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Z[i] = longest prefix match starting at i.',
          'Z-box [L,R] lets you copy prior work — linear total time.',
          'Pattern search: pattern + "$" + text, Z[i] == m → match.',
          'O(n + m) preprocessing and search.',
        ]}
      />
    </LessonArticle>
  )
}
