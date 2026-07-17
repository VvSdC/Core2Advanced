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

export function RevertVsReset() {
  return (
    <LessonArticle>
      <Definition term="Revert vs reset">
        <p>
          Both undo work, but differently.{' '}
          <span className="font-mono text-sm text-core-400">git revert</span> adds a{' '}
          <strong className="text-white">new commit</strong> that reverses an old one.{' '}
          <span className="font-mono text-sm text-core-400">git reset</span>{' '}
          <strong className="text-white">moves history</strong> so commits disappear from the branch tip.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: revert stamps &quot;cancelled&quot; on a published receipt; reset tears pages out of a
          private notebook.
        </p>
      </Definition>

      <Callout variant="beginner" title="Team rule of thumb">
        Shared / already-pushed branch → prefer revert. Private local commits only → reset is often fine.
      </Callout>

      <LessonSection title="git revert — safe undo for shared history">
        <Flowchart
          title="Revert keeps history linear and honest"
          chart={`flowchart TB
  A[Bad commit C] --> B[git revert C]
  B --> C[New commit R undoes C]
  C --> D[History still has C and R]
  D --> E[Safe to push]`}
        />
        <p className="text-slate-300">
          Revert does not erase the mistake; it records the fix. Teammates who already pulled still have a
          clean path forward.
        </p>
        <Example title="Revert the latest commit">
{`git revert HEAD
# opens editor for the revert message, then creates the undoing commit`}
        </Example>
        <CodeBlock title="Revert a specific commit">
{`git log --oneline
git revert a1b2c3d`}
        </CodeBlock>
        <Callout variant="tip" title="Conflicts">
          Revert can conflict if later commits touched the same lines. Resolve like a merge, then{' '}
          <span className="font-mono text-sm text-core-400">git revert --continue</span>.
        </Callout>
      </LessonSection>

      <LessonSection title="git reset — rewrite local history">
        <p className="text-slate-300">
          Reset moves your branch pointer. Soft/mixed/hard control staging and the working tree. After
          reset, those commits are no longer on the branch tip (they may linger briefly as dangling
          objects).
        </p>
        <CodeBlock title="Typical local cleanup">
{`# You just committed locally and want a do-over
git reset --soft HEAD~1`}
        </CodeBlock>
        <Callout variant="insight" title="Why reset is risky on remotes">
          If you reset and then force-push, you rewrite what others already cloned. That causes confusing
          non-fast-forward errors and lost work unless everyone coordinates.
        </Callout>
      </LessonSection>

      <LessonSection title="When to use which">
        <ContentStep number={1} title="Use revert when…">
          <ul className="list-disc space-y-2 pl-5 text-slate-300">
            <li>The commit is on <span className="font-mono text-sm text-core-400">main</span> / shared.</li>
            <li>Others may have pulled it already.</li>
            <li>You want an auditable &quot;we undid this&quot; trail.</li>
          </ul>
        </ContentStep>
        <ContentStep number={2} title="Use reset when…">
          <ul className="list-disc space-y-2 pl-5 text-slate-300">
            <li>Commits exist only on your laptop.</li>
            <li>You want to reshape the last commit before pushing.</li>
            <li>You are cleaning a private feature branch (still be careful if pushed).</li>
          </ul>
        </ContentStep>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[24rem] border-collapse text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 text-left text-white">
                <th className="py-2 pr-3">Goal</th>
                <th className="py-2 pr-3">Tool</th>
                <th className="py-2">Why</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-surface-700">
                <td className="py-2 pr-3">Undo a pushed bug</td>
                <td className="py-2 pr-3 font-mono text-core-400">revert</td>
                <td className="py-2">Adds fixing commit</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="py-2 pr-3">Fix last unpushed commit</td>
                <td className="py-2 pr-3 font-mono text-core-400">reset / amend</td>
                <td className="py-2">Rewrites local tip</td>
              </tr>
              <tr>
                <td className="py-2 pr-3">Throw away local experiment</td>
                <td className="py-2 pr-3 font-mono text-core-400">reset --hard</td>
                <td className="py-2">Only if you accept data loss</td>
              </tr>
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Side-by-side commands">
        <CodeBlock title="Revert path (shared branch)">
{`git log --oneline -5
git revert HEAD
git push`}
        </CodeBlock>
        <CodeBlock title="Reset path (local only)">
{`git log --oneline -5
git reset --soft HEAD~1
# edit / re-stage as needed
git commit -m "Corrected commit"
# push only if this was never on the remote
# (or if you intentionally rewrite a private branch)`}
        </CodeBlock>
        <Callout variant="beginner" title="Remember">
          If you already pushed the commit you want to undo, start with{' '}
          <span className="font-mono text-sm text-core-400">git revert</span> unless your team has a
          documented rewrite policy.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          <>Revert = new undoing commit; safe for shared branches.</>,
          <>Reset = move / rewrite local history.</>,
          <>Pushed history → revert. Unpushed local tip → reset is OK.</>,
          <>Never force-push rewritten shared history casually.</>,
        ]}
      />
    </LessonArticle>
  )
}
