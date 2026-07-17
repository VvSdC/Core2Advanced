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

export function UndoingLocalChanges() {
  return (
    <LessonArticle>
      <Definition term="Undoing local changes">
        <p>
          Before a commit leaves your machine, you can safely throw away edits or pull files back out of
          the staging area. Modern Git prefers{' '}
          <span className="font-mono text-sm text-core-400">git restore</span>; older docs use{' '}
          <span className="font-mono text-sm text-core-400">git checkout --</span> and{' '}
          <span className="font-mono text-sm text-core-400">git reset HEAD</span>.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: discard the scratch paper on your desk, or take papers out of the outbox without
          shredding them.
        </p>
      </Definition>

      <Callout variant="beginner" title="Stop and check first">
        Always run <span className="font-mono text-sm text-core-400">git status</span> so you know whether
        a change is staged, unstaged, or both.
      </Callout>

      <LessonSection title="Discard working-tree edits">
        <Flowchart
          title="Restore a file to the last commit"
          chart={`flowchart TB
  A[Messy working file] --> B[git restore file]
  B --> C[Matches last commit]
  D[Older style] --> E["git checkout -- file"]
  E --> C`}
        />
        <p className="text-slate-300">
          This <strong className="text-white">deletes uncommitted edits</strong> in that file. There is no
          undo inside Git for discarded working-tree changes.
        </p>
        <ContentStep number={1} title="Modern: git restore">
          <CodeBlock title="Discard one file">{`git restore app.js`}</CodeBlock>
          <CodeBlock title="Discard many">{`git restore .`}</CodeBlock>
        </ContentStep>
        <ContentStep number={2} title="Older generation (still works)">
          <CodeBlock title="Same idea with checkout">{`git checkout -- app.js`}</CodeBlock>
        </ContentStep>
        <Callout variant="insight" title="Why two commands?">
          Git split &quot;switch branches&quot; and &quot;restore files&quot; into clearer verbs. Prefer{' '}
          <span className="font-mono text-sm text-core-400">restore</span> /{' '}
          <span className="font-mono text-sm text-core-400">switch</span> on new machines; recognize the
          old forms when reading tutorials.
        </Callout>
      </LessonSection>

      <LessonSection title="Unstage without losing edits">
        <p className="text-slate-300">
          Unstaging keeps your file changes on disk; it only removes them from the next commit.
        </p>
        <Example title="Modern unstage">
{`git restore --staged app.js`}
        </Example>
        <Example title="Older unstage">
{`git reset HEAD app.js`}
        </Example>
        <CodeBlock title="Verify">
{`git status
# app.js should move from "staged" back to "modified"`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="Safe beginner recipes">
        <ContentStep number={1} title="Oops — staged the wrong file">
          <CodeBlock title="Unstage, keep edits">{`git restore --staged wrong.js`}</CodeBlock>
        </ContentStep>
        <ContentStep number={2} title="Oops — experiment failed">
          <CodeBlock title="Throw away local edits">{`git restore experiment.js`}</CodeBlock>
        </ContentStep>
        <ContentStep number={3} title="Start over on one file">
          <CodeBlock title="Unstage then discard">
{`git restore --staged app.js
git restore app.js`}
          </CodeBlock>
        </ContentStep>
        <Callout variant="tip" title="Safety rule">
          Prefer unstage + discard over{' '}
          <span className="font-mono text-sm text-core-400">git reset --hard</span> until you fully
          understand reset modes (next lesson).
        </Callout>
      </LessonSection>

      <LessonSection title="Decision cheat sheet">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[26rem] border-collapse text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 text-left text-white">
                <th className="py-2 pr-3">Situation</th>
                <th className="py-2 pr-3">Keep file edits?</th>
                <th className="py-2">Command</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-surface-700">
                <td className="py-2 pr-3">Staged wrong file</td>
                <td className="py-2 pr-3">Yes</td>
                <td className="py-2 font-mono text-core-400">git restore --staged file</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="py-2 pr-3">Bad experiment in file</td>
                <td className="py-2 pr-3">No</td>
                <td className="py-2 font-mono text-core-400">git restore file</td>
              </tr>
              <tr>
                <td className="py-2 pr-3">Need last committed version</td>
                <td className="py-2 pr-3">No</td>
                <td className="py-2 font-mono text-core-400">git restore file</td>
              </tr>
            </tbody>
          </table>
        </div>
        <CodeBlock title="Always verify afterward">
{`git status
git diff
git diff --staged`}
        </CodeBlock>
        <Callout variant="beginner" title="Not for undoing old commits">
          These recipes fix <strong className="text-white">uncommitted</strong> mistakes. To undo commits,
          learn reset modes and revert next.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          <>Discard edits: <span className="font-mono text-sm text-core-400">git restore</span> (or <span className="font-mono text-sm text-core-400">checkout --</span>).</>,
          <>Unstage: <span className="font-mono text-sm text-core-400">git restore --staged</span> (or <span className="font-mono text-sm text-core-400">reset HEAD</span>).</>,
          <>Discarding working-tree changes cannot be undone by Git.</>,
          <>Status first, then choose unstage vs discard.</>,
        ]}
      />
    </LessonArticle>
  )
}
