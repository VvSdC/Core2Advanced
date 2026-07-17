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

export function CommitHashAndHistory() {
  return (
    <LessonArticle>
      <Definition term="Commit hash and history">
        <p>
          A <strong className="text-white">commit hash</strong> is the unique ID of a snapshot —
          usually shown as 7+ hexadecimal characters (a shortened form of the full SHA).{' '}
          <strong className="text-white">History</strong> is the chain of commits linked by parent
          pointers. <span className="font-mono text-sm text-core-400">HEAD</span> means &quot;where
          you are now.&quot;
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: each commit is a bead on a string; the hash is the bead&apos;s serial number;{' '}
          <span className="text-core-400">HEAD</span> is your finger resting on the current bead;
          a <span className="text-core-400">branch</span> is a sticky note taped to a bead that can
          move forward as you commit.
        </p>
      </Definition>

      <Callout variant="beginner" title="You will see hashes everywhere">
        Error messages, <span className="font-mono text-sm text-core-400">git log</span>, and
        &quot;detached HEAD&quot; warnings all talk in hashes. Learning what they name removes the
        fear.
      </Callout>

      <LessonSection title="What a commit hash is">
        <p className="text-slate-300">
          The hash is computed from the commit&apos;s contents (tree, parents, author, message,
          …). Change the message and you get a <strong className="text-white">new</strong> hash —
          the old commit object still exists if anything still points to it.
        </p>
        <Example
          title="Short vs full"
          caption="Short forms are usually unique enough in a small repo"
        >
{`# Short (common in logs)
a1b2c3d

# Full (40 hex chars for SHA-1 repos)
a1b2c3d4e5f6789012345678901234567890abcd`}
        </Example>
      </LessonSection>

      <LessonSection title="HEAD, branches, and the linked list">
        <Flowchart
          title="History as a linked list of commits"
          chart={`flowchart TB
  C1[Commit C1]
  C2[Commit C2]
  C3[Commit C3 — HEAD / main]
  C1 --> C2
  C2 --> C3`}
        />
        <ContentStep number={1} title="HEAD">
          <p className="text-slate-300">
            Points to your current commit — usually by pointing at a branch name, which then points
            at a commit.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Branch">
          <p className="text-slate-300">
            A movable pointer with a friendly name like{' '}
            <span className="font-mono text-sm text-core-400">main</span>. New commits on that
            branch move the pointer forward.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Parent links">
          <p className="text-slate-300">
            Each commit (except the root) records its parent(s). That is how{' '}
            <span className="font-mono text-sm text-core-400">git log</span> walks history.
          </p>
        </ContentStep>
        <CodeBlock title="See where you are">
{`git rev-parse HEAD
git branch
# * marks the current branch`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="Reading history with git log">
        <Example
          title="The one-liner every beginner should know"
          output={`a1b2c3d (HEAD -> main) Add login form
f9e8d7c Fix typo in README
c0ffee1 Initial commit`}
        >
{`git log --oneline`}
        </Example>
        <p className="text-slate-300">
          Newest commits appear first. <span className="font-mono text-sm text-core-400">HEAD -&gt;
          main</span> means you are on <span className="font-mono text-sm text-core-400">main</span>{' '}
          at that commit.
        </p>
        <CodeBlock title="A few useful variations">
{`git log --oneline -5          # last five commits
git log --oneline --graph     # ASCII graph of history
git show HEAD                 # details of the current commit`}
        </CodeBlock>
        <Callout variant="tip" title="Linked list, not a magic cloud">
          If you understand &quot;each commit points to the previous one,&quot; you already
          understand enough history to learn branch, merge, and reset later without panic.
        </Callout>
      </LessonSection>

      <LessonSection title="How a new commit moves pointers">
        <Flowchart
          title="Branch tip moves forward"
          chart={`flowchart TB
  A[Commits C1 → C2] --> B[You commit again]
  B --> C[New commit C3]
  C --> D["main and HEAD now point at C3"]`}
        />
        <p className="text-slate-300">
          You rarely type hashes by hand at first. Friendly names (
          <span className="font-mono text-sm text-core-400">main</span>,{' '}
          <span className="font-mono text-sm text-core-400">HEAD</span>,{' '}
          <span className="font-mono text-sm text-core-400">HEAD~1</span> for &quot;one commit
          before&quot;) are shortcuts to those IDs.
        </p>
        <Example title="Relative names (preview)">
{`git show HEAD      # current commit
git show HEAD~1    # parent of current
# Full hashes still work anywhere a commit is accepted`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'A commit hash uniquely identifies a snapshot.',
          'HEAD is your current position; a branch is a movable named pointer.',
          'History is a linked list (or DAG) of commits via parent pointers.',
          'git log --oneline is the everyday way to read that chain.',
        ]}
      />
    </LessonArticle>
  )
}
