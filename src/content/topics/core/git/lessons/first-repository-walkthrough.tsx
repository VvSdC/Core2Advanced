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

export function FirstRepositoryWalkthrough() {
  return (
    <LessonArticle>
      <Definition term="Your first repository">
        <p>
          This lesson is an <strong className="text-white">end-to-end practice run</strong>: create
          a folder, initialize Git, add a file, check status, stage, commit, and read the log.
          Copy the commands into your terminal and follow along.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a cooking recipe from empty counter → plated dish. Do each step once; muscle
          memory sticks.
        </p>
      </Definition>

      <Callout variant="beginner" title="Before you start">
        Git should already be installed and configured (
        <span className="font-mono text-sm text-core-400">git --version</span>,{' '}
        <span className="font-mono text-sm text-core-400">user.name</span>,{' '}
        <span className="font-mono text-sm text-core-400">user.email</span>). Use any empty practice
        folder — not a huge work project.
      </Callout>

      <LessonSection title="The whole path at a glance">
        <Flowchart
          title="First-repo walkthrough"
          chart={`flowchart TB
  A[mkdir + cd] --> B[git init]
  B --> C[Create a file]
  C --> D[git status]
  D --> E[git add]
  E --> F[git commit]
  F --> G[git log --oneline]`}
        />
      </LessonSection>

      <LessonSection title="Step-by-step commands">
        <ContentStep number={1} title="Create a practice folder">
          <CodeBlock title="Shell">
{`mkdir git-practice
cd git-practice`}
          </CodeBlock>
        </ContentStep>
        <ContentStep number={2} title="Initialize the repository">
          <Example
            title="Turn the folder into a Git repo"
            output="Initialized empty Git repository in .../git-practice/.git/"
          >
{`git init`}
          </Example>
        </ContentStep>
        <ContentStep number={3} title="Create a file">
          <CodeBlock title="Add something to track">
{`# PowerShell
"Hello, Git!" | Out-File -Encoding utf8 hello.txt

# macOS / Linux / Git Bash
echo "Hello, Git!" > hello.txt`}
          </CodeBlock>
        </ContentStep>
        <ContentStep number={4} title="Check status">
          <Example
            title="See that Git notices the new file"
            caption="Expect 'Untracked files' and hello.txt"
          >
{`git status`}
          </Example>
        </ContentStep>
        <ContentStep number={5} title="Stage the file">
          <CodeBlock title="Working directory → staging area">
{`git add hello.txt
git status
# Now hello.txt should appear under "Changes to be committed"`}
          </CodeBlock>
        </ContentStep>
        <ContentStep number={6} title="Commit the snapshot">
          <Example title="Save history with a clear message">
{`git commit -m "Add hello.txt"`}
          </Example>
          <Callout variant="tip" title="Editor opened instead?">
            If you omit <span className="font-mono text-sm text-core-400">-m</span>, Git opens an
            editor for the message. For this walkthrough, keep using{' '}
            <span className="font-mono text-sm text-core-400">-m &quot;…&quot;</span>.
          </Callout>
        </ContentStep>
        <ContentStep number={7} title="Read the log">
          <Example
            title="Confirm your commit exists"
            output={`c0ffee1 (HEAD -> main) Add hello.txt`}
          >
{`git log --oneline`}
          </Example>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Full sequence to copy">
        <CodeBlock title="Paste-friendly (adjust the echo line for your shell)">
{`mkdir git-practice
cd git-practice
git init
echo "Hello, Git!" > hello.txt
git status
git add hello.txt
git commit -m "Add hello.txt"
git status
git log --oneline`}
        </CodeBlock>
        <p className="text-slate-300">
          After the commit, <span className="font-mono text-sm text-core-400">git status</span>{' '}
          should say something like{' '}
          <strong className="text-white">nothing to commit, working tree clean</strong> — your
          snapshot matches the files on disk.
        </p>
        <Callout variant="info" title="What you just practiced">
          init → edit → status → add → commit → log. That loop is the core of daily Git. Later
          lessons add remotes, branches, and collaboration on top of this same cycle.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'mkdir + git init creates a local practice repository.',
          'New files are untracked until git add; commits need a message.',
          'git status and git log --oneline confirm each step worked.',
          'A clean working tree after commit means disk matches the latest snapshot.',
        ]}
      />
    </LessonArticle>
  )
}
