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

export function GitLogAndDiff() {
  return (
    <LessonArticle>
      <Definition term="Log and diff">
        <p>
          <span className="font-mono text-sm text-core-400">git log</span> shows{' '}
          <strong className="text-white">history</strong> (past commits).{' '}
          <span className="font-mono text-sm text-core-400">git diff</span> shows{' '}
          <strong className="text-white">what changed</strong> between two states — usually your edits
          versus the last commit.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: log is the table of contents of a diary; diff is the red pen marks on the current page.
        </p>
      </Definition>

      <Callout variant="beginner" title="One sentence version">
        Use log to see where you have been; use diff to see what you are about to save.
      </Callout>

      <LessonSection title="Reading history: git log">
        <Example title="Full log (press q to quit in many terminals)">
{`git log`}
        </Example>
        <ContentStep number={1} title="One line per commit">
          <CodeBlock title="Compact history">{`git log --oneline`}</CodeBlock>
          <CodeBlock title="Example output">
{`a1b2c3d Fix typo in README
e4f5g6h Add login form
9i0j1k2 Initial commit`}
          </CodeBlock>
        </ContentStep>
        <ContentStep number={2} title="See the branch graph">
          <p className="text-slate-300">
            <span className="font-mono text-sm text-core-400">--graph</span> draws how branches split and
            merge — helpful once you use more than one branch.
          </p>
          <CodeBlock title="Graph + oneline">{`git log --oneline --graph`}</CodeBlock>
        </ContentStep>
        <ContentStep number={3} title="Inspect one commit">
          <p className="text-slate-300">
            <span className="font-mono text-sm text-core-400">git show</span> prints the commit message and
            the patch for that snapshot (default: the latest commit).
          </p>
          <CodeBlock title="Show latest or a specific hash">
{`git show
git show a1b2c3d`}
          </CodeBlock>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What changed: git diff">
        <Flowchart
          title="Two common diffs"
          chart={`flowchart TB
  A[Working tree edits] -->|git diff| B[Unstaged changes]
  C[Staged files] -->|git diff --staged| D[What the next commit will include]`}
        />
        <p className="text-slate-300">
          <span className="font-mono text-sm text-core-400">git diff</span> compares the working tree to
          the staging area — unstaged edits only.
        </p>
        <CodeBlock title="Unstaged changes">{`git diff`}</CodeBlock>
        <p className="text-slate-300">
          After <span className="font-mono text-sm text-core-400">git add</span>, use{' '}
          <span className="font-mono text-sm text-core-400">git diff --staged</span> (same as{' '}
          <span className="font-mono text-sm text-core-400">--cached</span>) to preview the commit.
        </p>
        <CodeBlock title="Staged changes">{`git diff --staged`}</CodeBlock>
      </LessonSection>

      <LessonSection title="Reading a diff (beginner guide)">
        <CodeBlock title="Tiny sample patch">
{`diff --git a/hello.js b/hello.js
--- a/hello.js
+++ b/hello.js
@@ -1,3 +1,3 @@
-console.log("hi")
+console.log("hello")`}
        </CodeBlock>
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            Lines starting with <span className="font-mono text-sm text-core-400">-</span> were removed.
          </li>
          <li>
            Lines starting with <span className="font-mono text-sm text-core-400">+</span> were added.
          </li>
          <li>
            File paths and <span className="font-mono text-sm text-core-400">@@</span> hunks tell you where
            in the file the change sits.
          </li>
        </ul>
        <Callout variant="tip" title="Habit">
          Run <span className="font-mono text-sm text-core-400">git diff --staged</span> right before every
          commit so you never surprise yourself.
        </Callout>
      </LessonSection>

      <LessonSection title="Handy log filters">
        <CodeBlock title="Last N commits">
{`git log --oneline -5
git log --oneline -10`}
        </CodeBlock>
        <CodeBlock title="Who changed what (overview)">
{`git log --oneline --author="You"
git log --oneline -- path/to/file.js`}
        </CodeBlock>
        <Callout variant="insight" title="Combine with status">
          Before committing: <span className="font-mono text-sm text-core-400">status</span> →{' '}
          <span className="font-mono text-sm text-core-400">diff</span> /{' '}
          <span className="font-mono text-sm text-core-400">diff --staged</span>. After committing:{' '}
          <span className="font-mono text-sm text-core-400">log --oneline</span> to confirm the tip.
        </Callout>
        <CodeBlock title="Quit pagers">
{`# If log/diff opens a pager, press q to quit
git log --oneline
git show`}
        </CodeBlock>
      </LessonSection>

      <KeyTakeaways
        items={[
          <>Log = history; start with <span className="font-mono text-sm text-core-400">git log --oneline</span>.</>,
          <><span className="font-mono text-sm text-core-400">git show</span> opens one commit in detail.</>,
          <><span className="font-mono text-sm text-core-400">git diff</span> = unstaged; <span className="font-mono text-sm text-core-400">--staged</span> = what you will commit.</>,
          <>Minus lines gone, plus lines new.</>,
        ]}
      />
    </LessonArticle>
  )
}
