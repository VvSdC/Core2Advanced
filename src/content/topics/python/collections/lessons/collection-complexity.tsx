import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function CollectionComplexity() {
  return (
    <LessonArticle>
      <Definition term="Time & Space Complexity">
        <p>
          Interviewers expect you to know average-case complexity of Python collection operations. CPython uses
          hash tables for dict/set and dynamic arrays for lists.
        </p>
      </Definition>

      <ContentStep number={1} title="Big-O cheat sheet">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-surface-600 bg-surface-800/80 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-semibold">Operation</th>
                <th className="px-4 py-3 font-semibold">list</th>
                <th className="px-4 py-3 font-semibold">dict / set</th>
              </tr>
            </thead>
            <tbody className="text-slate-400">
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3">Index / lookup by key</td>
                <td className="px-4 py-3 font-mono">O(1)</td>
                <td className="px-4 py-3 font-mono">O(1) avg</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3">Search (x in ...)</td>
                <td className="px-4 py-3 font-mono">O(n)</td>
                <td className="px-4 py-3 font-mono">O(1) avg</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3">Append / insert end</td>
                <td className="px-4 py-3 font-mono">O(1)*</td>
                <td className="px-4 py-3">—</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3">Insert at index i</td>
                <td className="px-4 py-3 font-mono">O(n)</td>
                <td className="px-4 py-3">—</td>
              </tr>
              <tr>
                <td className="px-4 py-3">Delete</td>
                <td className="px-4 py-3 font-mono">O(n)</td>
                <td className="px-4 py-3 font-mono">O(1) avg</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-sm text-slate-500">* amortized — occasional resize copies elements.</p>
      </ContentStep>

      <ContentStep number={2} title="Choosing by complexity">
        <Example
          title="Membership test"
        >{`# O(n) — scans entire list
items = list(range(1_000_000))
999_999 in items

# O(1) average — hash lookup
lookup = set(range(1_000_000))
999_999 in lookup`}</Example>
      </ContentStep>

      <ContentStep number={3} title="Space complexity">
        <Callout variant="info">
          Lists and dicts store references (8 bytes each on 64-bit) plus overhead. Generators are O(1) space per
          step — prefer them for large streams. Tuples are more compact than lists when immutability fits.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'list: O(1) index/append amortized; O(n) search/insert middle.',
          'dict/set: O(1) average lookup, insert, delete.',
          'Use set for membership tests on large data.',
          'Generators save memory for large sequences.',
        ]}
      />
    </LessonArticle>
  )
}
