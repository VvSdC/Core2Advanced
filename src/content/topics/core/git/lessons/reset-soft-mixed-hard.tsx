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

export function ResetSoftMixedHard() {
  return (
    <LessonArticle>
      <Definition term="git reset">
        <p>
          <span className="font-mono text-sm text-core-400">git reset</span> moves your current branch
          pointer (<strong className="text-white">HEAD</strong>) to another commit, and optionally
          rewrites the <strong className="text-white">staging area</strong> and{' '}
          <strong className="text-white">working tree</strong>.
        </p>
        <p className="mt-2 text-slate-300">
          Think of three shelves: commits (history), staging (outbox), working files (desk). Soft,
          mixed, and hard disagree on how many shelves to wipe.
        </p>
      </Definition>

      <Callout variant="beginner" title="Critical warning">
        Reset rewrites <strong className="text-white">local</strong> history. Never{' '}
        <span className="font-mono text-sm text-core-400">--hard</span> reset shared, already-pushed
        history unless your whole team agrees and understands the fallout.
      </Callout>

      <LessonSection title="The three modes">
        <Flowchart
          title="soft vs mixed vs hard"
          chart={`flowchart TB
  A["git reset MODE HEAD~1"] --> B{Which mode?}
  B -->|soft| C[Move HEAD only]
  B -->|mixed default| D[Move HEAD + clear staging]
  B -->|hard| E[Move HEAD + clear staging + working tree]
  C --> F[Files stay staged]
  D --> G[Files stay on disk unstaged]
  E --> H[Files match target commit — edits gone]`}
        />
        <ContentStep number={1} title="--soft — keep staging and working">
          <p className="text-slate-300">
            Moves HEAD back one commit. Your changes remain{' '}
            <strong className="text-white">staged</strong>, ready to recommit.
          </p>
          <CodeBlock title="Undo last commit, keep everything staged">
{`git reset --soft HEAD~1`}
          </CodeBlock>
        </ContentStep>
        <ContentStep number={2} title="--mixed (default) — unstage, keep files">
          <p className="text-slate-300">
            Moves HEAD and resets the index. Edits stay in the working tree as{' '}
            <strong className="text-white">unstaged</strong> modifications.
          </p>
          <CodeBlock title="Same as mixed">
{`git reset --mixed HEAD~1
git reset HEAD~1`}
          </CodeBlock>
        </ContentStep>
        <ContentStep number={3} title="--hard — DANGEROUS wipe">
          <p className="text-slate-300">
            Moves HEAD and makes staging <em>and</em> working tree match that commit. Uncommitted and
            reset-away changes are discarded.
          </p>
          <CodeBlock title="Match previous commit exactly">
{`git reset --hard HEAD~1`}
          </CodeBlock>
          <Callout variant="insight" title="Only when you mean it">
            Double-check <span className="font-mono text-sm text-core-400">git status</span> and that you
            do not need those edits. Prefer soft/mixed for &quot;I committed too soon.&quot;
          </Callout>
        </ContentStep>
      </LessonSection>

      <LessonSection title="After reset: what each area looks like">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[28rem] border-collapse text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 text-left text-white">
                <th className="py-2 pr-3">Mode</th>
                <th className="py-2 pr-3">HEAD / commits</th>
                <th className="py-2 pr-3">Staging</th>
                <th className="py-2">Working tree</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-surface-700">
                <td className="py-2 pr-3 font-mono text-core-400">--soft</td>
                <td className="py-2 pr-3">Moved back</td>
                <td className="py-2 pr-3">Keeps old commit contents staged</td>
                <td className="py-2">Unchanged</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="py-2 pr-3 font-mono text-core-400">--mixed</td>
                <td className="py-2 pr-3">Moved back</td>
                <td className="py-2 pr-3">Cleared (matches new HEAD)</td>
                <td className="py-2">Keeps file edits</td>
              </tr>
              <tr>
                <td className="py-2 pr-3 font-mono text-core-400">--hard</td>
                <td className="py-2 pr-3">Moved back</td>
                <td className="py-2 pr-3">Cleared</td>
                <td className="py-2">Matches commit — edits gone</td>
              </tr>
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Beginner-friendly examples">
        <Example title="Wrong message — soft reset then recommit">
{`git reset --soft HEAD~1
git commit -m "Better message"`}
        </Example>
        <Example title="Split a commit — mixed reset">
{`git reset HEAD~1
git add file-a.js
git commit -m "Only file A"
git add file-b.js
git commit -m "Only file B"`}
        </Example>
        <Callout variant="tip" title="Shared branches">
          If the commit is already on the remote, use{' '}
          <span className="font-mono text-sm text-core-400">git revert</span> (next lesson) instead of
          reset + force-push.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          <>Soft: move HEAD, keep staged + working.</>,
          <>Mixed (default): move HEAD, unstage, keep files.</>,
          <>Hard: move HEAD and discard staging + working — irreversible locally.</>,
          <>Never hard-reset published shared history without understanding.</>,
        ]}
      />
    </LessonArticle>
  )
}
