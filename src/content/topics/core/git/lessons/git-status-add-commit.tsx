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

export function GitStatusAddCommit() {
  return (
    <LessonArticle>
      <Definition term="Status → stage → commit">
        <p>
          Everyday Git is three verbs:{' '}
          <span className="font-mono text-sm text-core-400">git status</span> (look),{' '}
          <span className="font-mono text-sm text-core-400">git add</span> (choose), and{' '}
          <span className="font-mono text-sm text-core-400">git commit</span> (save a snapshot).
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: status is checking your desk, add is putting papers in the outbox, commit is sealing
          the envelope with a note.
        </p>
      </Definition>

      <Callout variant="beginner" title="One sentence version">
        Edit files → check status → stage what you want → commit with a clear message.
      </Callout>

      <LessonSection title="See where you stand: git status">
        <p className="text-slate-300">
          Run <span className="font-mono text-sm text-core-400">git status</span> often. It tells you which
          files are modified, staged, or untracked.
        </p>
        <Example title="Check the working tree" caption="Safe to run anytime — it never changes files">
{`git status`}
        </Example>
        <CodeBlock title="Common status phrases">
{`On branch main
Changes not staged for commit:
  modified:   app.js

Untracked files:
  notes.txt

nothing to commit, working tree clean`}
        </CodeBlock>
        <Callout variant="tip" title="What “nothing to commit” means">
          Your working tree matches the last commit. There is nothing new to stage or save — you are
          clean and ready to branch, pull, or push.
        </Callout>
      </LessonSection>

      <LessonSection title="Stage changes: git add">
        <Flowchart
          title="Working tree → staging area"
          chart={`flowchart TB
  A[Edit files] --> B[git status]
  B --> C[git add]
  C --> D[Staging area]
  D --> E[git commit]`}
        />
        <ContentStep number={1} title="Add one file">
          <CodeBlock title="Stage a single path">{`git add app.js`}</CodeBlock>
        </ContentStep>
        <ContentStep number={2} title="Add everything in the folder">
          <p className="text-slate-300">
            <span className="font-mono text-sm text-core-400">git add .</span> stages all changes under
            the current directory (respecting <span className="font-mono text-sm text-core-400">.gitignore</span>).
          </p>
          <CodeBlock title="Stage all">{`git add .`}</CodeBlock>
        </ContentStep>
        <ContentStep number={3} title="Add piece by piece (optional)">
          <p className="text-slate-300">
            <span className="font-mono text-sm text-core-400">git add -p</span> lets you stage hunks
            interactively — useful when one file has two unrelated edits.
          </p>
          <CodeBlock title="Patch mode">{`git add -p`}</CodeBlock>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Save a snapshot: git commit">
        <Example title="Commit with a message (most common)">
{`git commit -m "Explain login form validation"`}
        </Example>
        <p className="text-slate-300">
          Without <span className="font-mono text-sm text-core-400">-m</span>, Git opens your editor so
          you can write a longer message, then save and close to finish the commit.
        </p>
        <CodeBlock title="Open the editor">{`git commit`}</CodeBlock>
        <Callout variant="insight" title="Amend (use carefully)">
          <span className="font-mono text-sm text-core-400">git commit --amend</span> folds new staged
          changes into the <strong className="text-white">last</strong> commit (or rewrites its message).
          Only amend if that commit has <strong className="text-white">not</strong> been pushed — rewriting
          published history confuses teammates.
        </Callout>
        <CodeBlock title="Amend message or include missed files">
{`git add forgotten.js
git commit --amend -m "Explain login form validation"`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="A complete mini session">
        <CodeBlock title="From empty change to saved commit">
{`# 1. See what changed
git status

# 2. Stage what belongs in this commit
git add app.js
# or everything relevant:
# git add .

# 3. Preview the commit (optional but smart)
git diff --staged

# 4. Save the snapshot
git commit -m "Validate email on login form"

# 5. Confirm you are clean
git status`}
        </CodeBlock>
        <Callout variant="tip" title="Write messages for humans">
          Prefer <em>why</em> or <em>what changed</em> over vague words like &quot;update&quot; or &quot;fix.&quot; Future you
          will thank present you.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          <>Use <span className="font-mono text-sm text-core-400">git status</span> before and after every change.</>,
          <>Stage with <span className="font-mono text-sm text-core-400">git add</span>, then <span className="font-mono text-sm text-core-400">git commit -m</span>.</>,
          <>&quot;Nothing to commit, working tree clean&quot; means you are fully saved.</>,
          <>Amend only unpushed commits.</>,
        ]}
      />
    </LessonArticle>
  )
}
