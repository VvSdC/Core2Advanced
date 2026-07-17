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

export function FetchExplained() {
  return (
    <LessonArticle>
      <Definition term="git fetch">
        <p>
          <span className="font-mono text-sm text-core-400">git fetch</span> downloads new commits,
          branches, and tags from the remote into your local repo — but it{' '}
          <strong className="text-white">does not merge</strong> them into your current branch or change
          your working files.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: fetch checks the mailbox and puts letters on the side table; it does not open and file
          them into your binder yet.
        </p>
      </Definition>

      <Callout variant="beginner" title="The key idea">
        After fetch, <span className="font-mono text-sm text-core-400">origin/main</span> may move forward.
        Your local <span className="font-mono text-sm text-core-400">main</span> (and desk files) stay put
        until you merge or rebase.
      </Callout>

      <LessonSection title="What fetch updates">
        <Flowchart
          title="Fetch vs your working tree"
          chart={`flowchart TB
  A[Remote main has new commits] --> B[git fetch origin]
  B --> C[origin/main pointer updates]
  C --> D[Your branch main unchanged]
  D --> E[Working tree unchanged]
  E --> F[You decide: merge / rebase / ignore for now]`}
        />
        <Example title="Fetch from origin">
{`git fetch origin
# often enough:
git fetch`}
        </Example>
        <CodeBlock title="See what arrived">
{`git log --oneline main..origin/main
# commits that are on origin/main but not on your main`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="Remote-tracking branches">
        <ContentStep number={1} title="origin/main is a bookmark">
          <p className="text-slate-300">
            Names like <span className="font-mono text-sm text-core-400">origin/main</span> are{' '}
            <strong className="text-white">remote-tracking branches</strong> — local records of where the
            remote was last time you fetched.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Your branch is separate">
          <p className="text-slate-300">
            <span className="font-mono text-sm text-core-400">main</span> only moves when{' '}
            <em>you</em> merge, rebase, reset, or commit. Fetch alone never edits project files.
          </p>
          <CodeBlock title="Compare pointers">
{`git status
git log --oneline --decorate -5
# look for main and origin/main`}
          </CodeBlock>
        </ContentStep>
        <ContentStep number={3} title="Integrate when ready">
          <CodeBlock title="After inspecting, merge">
{`git switch main
git merge origin/main`}
          </CodeBlock>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Why fetch is a great habit">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>See teammates&apos; work before it lands in your branch.</li>
          <li>Avoid surprise conflicts mid-edit.</li>
          <li>Decide when to integrate instead of auto-merging.</li>
        </ul>
        <Callout variant="tip" title="Safe anytime">
          Fetch is read-only for your working tree. Run it often — morning, after lunch, before you push.
        </Callout>
        <CodeBlock title="Fetch all remotes">{`git fetch --all`}</CodeBlock>
      </LessonSection>

      <LessonSection title="Practice: fetch without fear">
        <CodeBlock title="Safe morning ritual">
{`git switch main
git fetch origin
git status
# status may say: Your branch is behind 'origin/main' by N commits

git log --oneline --decorate -8
# notice main vs origin/main

# when ready to integrate:
git merge origin/main
# or simply later: git pull`}
        </CodeBlock>
        <Callout variant="insight" title="Behind vs ahead">
          <strong className="text-white">Behind</strong> means the remote has commits you lack.{' '}
          <strong className="text-white">Ahead</strong> means you have local commits not pushed yet. Fetch
          updates the &quot;behind&quot; picture; it never creates &quot;ahead&quot; by itself.
        </Callout>
        <Example title="Fetch one remote branch (optional)">
{`git fetch origin main
# updates origin/main from that branch`}
        </Example>
        <CodeBlock title="Prune deleted remote branches (optional)">
{`git fetch --prune
# cleans stale origin/* refs for branches removed on the server`}
        </CodeBlock>
        <p className="text-slate-300">
          Next lessons cover <span className="font-mono text-sm text-core-400">pull</span> (fetch +
          integrate) and when to choose each.
        </p>
      </LessonSection>

      <KeyTakeaways
        items={[
          <>Fetch downloads; it does not merge or change your files.</>,
          <><span className="font-mono text-sm text-core-400">origin/main</span> moves; your branch stays.</>,
          <>Inspect with log/status, then merge when ready.</>,
          <>Fetch often — it is the safest remote sync command.</>,
        ]}
      />
    </LessonArticle>
  )
}
