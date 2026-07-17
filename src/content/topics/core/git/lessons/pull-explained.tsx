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

export function PullExplained() {
  return (
    <LessonArticle>
      <Definition term="git pull">
        <p>
          <span className="font-mono text-sm text-core-400">git pull</span> is a convenience: roughly{' '}
          <strong className="text-white">fetch + integrate</strong>. By default that means fetch, then{' '}
          <span className="font-mono text-sm text-core-400">merge</span> into your current branch. Some
          setups use <span className="font-mono text-sm text-core-400">rebase</span> instead of merge.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: pull both checks the mailbox <em>and</em> files the letters into your binder in one
          motion.
        </p>
      </Definition>

      <Callout variant="beginner" title="One sentence version">
        Pull updates your current branch with remote commits — handy when you are ready to integrate now.
      </Callout>

      <LessonSection title="What pull does">
        <Flowchart
          title="Default pull = fetch + merge"
          chart={`flowchart TB
  A[git pull] --> B[Fetch from remote]
  B --> C[Update origin/main]
  C --> D[Merge into current branch]
  D --> E{Conflicts?}
  E -->|no| F[Branch + working tree updated]
  E -->|yes| G[Resolve like a normal merge]`}
        />
        <Example title="Pull the tracked branch">
{`git switch main
git pull`}
        </Example>
        <CodeBlock title="Explicit remote and branch">
{`git pull origin main`}
        </CodeBlock>
        <p className="text-slate-300">
          If upstream tracking is set (<span className="font-mono text-sm text-core-400">-u</span> from
          push), plain <span className="font-mono text-sm text-core-400">git pull</span> is enough.
        </p>
      </LessonSection>

      <LessonSection title="Pull vs fetch-then-merge">
        <ContentStep number={1} title="When pull is convenient">
          <ul className="list-disc space-y-2 pl-5 text-slate-300">
            <li>You are on <span className="font-mono text-sm text-core-400">main</span> with a clean tree.</li>
            <li>You want the latest remote work immediately.</li>
            <li>You trust a quick merge is fine.</li>
          </ul>
          <CodeBlock title="Morning catch-up">{`git pull`}</CodeBlock>
        </ContentStep>
        <ContentStep number={2} title="When to fetch first">
          <ul className="list-disc space-y-2 pl-5 text-slate-300">
            <li>You want to inspect remote commits before merging.</li>
            <li>You have local work and want fewer surprises.</li>
            <li>You prefer merge or rebase deliberately.</li>
          </ul>
          <CodeBlock title="Manual two-step">
{`git fetch origin
git log --oneline HEAD..origin/main
git merge origin/main`}
          </CodeBlock>
        </ContentStep>
        <Callout variant="insight" title="Config note">
          Some teams set <span className="font-mono text-sm text-core-400">pull.rebase true</span>. Then
          pull rebases your local commits onto the updated remote tip instead of merging. Ask your team
          which they use.
        </Callout>
      </LessonSection>

      <LessonSection title="Conflicts on pull">
        <p className="text-slate-300">
          Because pull merges (or rebases), you can hit the same conflict markers as a normal merge.
        </p>
        <CodeBlock title="During a conflicted pull">
{`git status
# fix files, remove <<<<<<< markers
git add .
git commit   # if merge-style pull
# or: git rebase --continue  if rebase-style pull`}
        </CodeBlock>
        <ContentStep number={1} title="Abort if overwhelmed">
          <CodeBlock title="Undo the integration attempt">
{`git merge --abort
# or for rebase pull:
git rebase --abort`}
          </CodeBlock>
        </ContentStep>
        <Callout variant="tip" title="Stay clean before pull">
          Commit or stash local edits first so pull conflicts are only about already-saved work.
        </Callout>
      </LessonSection>

      <LessonSection title="Pull on a feature branch">
        <p className="text-slate-300">
          You can also pull into a feature branch if it tracks a remote branch — useful when collaborating
          on the same feature.
        </p>
        <CodeBlock title="Update your remote-tracking feature">
{`git switch feature/login
git pull
# equivalent idea:
git fetch origin
git merge origin/feature/login`}
        </CodeBlock>
        <Callout variant="tip" title="Bring main into your feature">
          Many teams update a feature with the latest main separately:
        </Callout>
        <CodeBlock title="Refresh from main (common pattern)">
{`git switch feature/login
git fetch origin
git merge origin/main
# resolve conflicts on the feature branch, then push`}
        </CodeBlock>
      </LessonSection>

      <KeyTakeaways
        items={[
          <>Pull ≈ fetch + merge (or rebase if configured).</>,
          <>Convenient when you are ready to integrate immediately.</>,
          <>Fetch first when you want to look before merging.</>,
          <>Conflicts on pull = same resolve / abort skills as merge.</>,
        ]}
      />
    </LessonArticle>
  )
}
