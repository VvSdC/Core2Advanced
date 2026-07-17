import {
  Callout,
  CodeBlock,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PullVsFetch() {
  return (
    <LessonArticle>
      <Definition term="Pull vs fetch">
        <p>
          <span className="font-mono text-sm text-core-400">fetch</span> only updates remote-tracking
          refs. <span className="font-mono text-sm text-core-400">pull</span> fetches{' '}
          <em>and</em> integrates into your current branch. Same download; different ending.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: fetch = get the package; pull = get the package and unpack it into your room.
        </p>
      </Definition>

      <Callout variant="beginner" title="Team-friendly habit">
        Fetch often to stay informed; pull (or merge) when you are ready to combine remote work with yours.
      </Callout>

      <LessonSection title="Side-by-side comparison">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[28rem] border-collapse text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 text-left text-white">
                <th className="py-2 pr-3">Question</th>
                <th className="py-2 pr-3 font-mono text-core-400">git fetch</th>
                <th className="py-2 font-mono text-core-400">git pull</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-surface-700">
                <td className="py-2 pr-3">Downloads remote commits?</td>
                <td className="py-2 pr-3">Yes</td>
                <td className="py-2">Yes</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="py-2 pr-3">Updates origin/main?</td>
                <td className="py-2 pr-3">Yes</td>
                <td className="py-2">Yes</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="py-2 pr-3">Changes your branch tip?</td>
                <td className="py-2 pr-3">No</td>
                <td className="py-2">Yes (merge/rebase)</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="py-2 pr-3">Touches working files?</td>
                <td className="py-2 pr-3">No</td>
                <td className="py-2">Yes if merge applies</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="py-2 pr-3">Can create conflicts?</td>
                <td className="py-2 pr-3">No</td>
                <td className="py-2">Yes</td>
              </tr>
              <tr>
                <td className="py-2 pr-3">Best for…</td>
                <td className="py-2 pr-3">Inspecting safely</td>
                <td className="py-2">Quick integrate</td>
              </tr>
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Decision flowchart">
        <Flowchart
          title="Fetch or pull?"
          chart={`flowchart TB
  A[Need remote updates?] --> B{Ready to change your branch now?}
  B -->|No — just look| C[git fetch]
  C --> D[Review origin/main]
  D --> E{Integrate?}
  E -->|Later| F[Keep coding]
  E -->|Now| G[git merge origin/main]
  B -->|Yes — integrate now| H[git pull]
  H --> I{Conflicts?}
  I -->|Yes| J[Resolve / abort]
  I -->|No| K[Continue work]`}
        />
      </LessonSection>

      <LessonSection title="Recommended team workflow">
        <ContentStep number={1} title="Fetch often">
          <CodeBlock title="Low-risk sync">{`git fetch origin`}</CodeBlock>
          <p className="text-slate-300">
            See whether you are behind without reshaping your branch mid-thought.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Pull when ready to integrate">
          <Example title="Clean main, ready for remote">
{`git switch main
git status   # working tree clean
git pull`}
          </Example>
        </ContentStep>
        <ContentStep number={3} title="Or stay explicit">
          <CodeBlock title="Same end state, more control">
{`git fetch origin
git merge origin/main`}
          </CodeBlock>
        </ContentStep>
        <Callout variant="tip" title="Before you push">
          Fetch (or pull) first so you are less likely to hit non-fast-forward rejection.
        </Callout>
      </LessonSection>

      <LessonSection title="Quick command cheatsheet">
        <CodeBlock title="Fetch path">
{`git fetch
git log --oneline HEAD..origin/main
git merge origin/main`}
        </CodeBlock>
        <CodeBlock title="Pull path">{`git pull`}</CodeBlock>
      </LessonSection>

      <LessonSection title="Same goal, two paths">
        <Example title="Path A — pull">
{`git switch main
git pull`}
        </Example>
        <Example title="Path B — fetch then merge">
{`git switch main
git fetch origin
git merge origin/main`}
        </Example>
        <p className="text-slate-300">
          End state is usually the same with default settings. Path B gives you a chance to read{' '}
          <span className="font-mono text-sm text-core-400">git log</span> between the two steps.
        </p>
        <Callout variant="beginner" title="Remember">
          Neither replaces <span className="font-mono text-sm text-core-400">git push</span>. Fetch and
          pull bring changes <em>in</em>; push sends your commits <em>out</em>.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          <>Fetch = download only; pull = download + integrate.</>,
          <>Fetch cannot conflict; pull can.</>,
          <>Team habit: fetch often, pull when ready.</>,
          <>Fetch + merge equals default pull — with a pause in the middle.</>,
        ]}
      />
    </LessonArticle>
  )
}
