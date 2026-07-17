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

export function WhatIsGit() {
  return (
    <LessonArticle>
      <Definition term="Git">
        <p>
          <strong className="text-white">Git</strong> is a{' '}
          <strong className="text-white">version control system</strong> — software that records
          snapshots of your project over time so you can go back, compare changes, and work with
          others without overwriting each other&apos;s work.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: Git is a <span className="text-core-400">time machine for your code</span>. Every
          commit is a save point you can return to later.
        </p>
      </Definition>

      <Callout variant="beginner" title="Who this track is for">
        Absolute beginners. You do not need prior Git experience — only a folder of files and
        curiosity. We start from concepts, then type real commands.
      </Callout>

      <LessonSection title="What is version control?">
        <p className="text-slate-300">
          Without version control, people rename files like{' '}
          <span className="font-mono text-sm text-core-400">report_final_v3_REALLY.docx</span>. That
          breaks down fast. Version control keeps{' '}
          <strong className="text-white">history</strong>, <strong className="text-white">who
          changed what</strong>, and a clean way to undo mistakes.
        </p>
        <ContentStep number={1} title="Track history">
          <p className="text-slate-300">
            See what the project looked like last week — not by digging through email attachments.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Collaborate safely">
          <p className="text-slate-300">
            Multiple people edit the same project; Git helps merge their changes instead of one
            person overwriting the other.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Experiment without fear">
          <p className="text-slate-300">
            Try a big refactor on a branch. If it fails, your main line of work is still intact.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Why Git specifically?">
        <Flowchart
          title="Why teams use Git"
          chart={`flowchart TB
  A[Your project files] --> B[Git records snapshots]
  B --> C[Undo / compare / share]
  C --> D[Collaborate on GitHub and friends]`}
        />
        <p className="text-slate-300">
          Git is free, open source, and the industry default. Learning Git unlocks GitHub, GitLab,
          Bitbucket, and almost every professional software workflow.
        </p>
        <Callout variant="tip" title="Mental model">
          Think <strong className="text-white">snapshots</strong>, not only &quot;file diffs.&quot;
          Each commit is a full picture of the project at that moment (Git stores it efficiently
          underneath).
        </Callout>
      </LessonSection>

      <LessonSection title="The snapshot model">
        <p className="text-slate-300">
          When you <span className="font-mono text-sm text-core-400">git commit</span>, you are not
          merely saying &quot;line 12 changed.&quot; You are saving a{' '}
          <strong className="text-white">checkpoint</strong> of the tracked files as they are right
          now.
        </p>
        <Example title="Everyday analogy" caption="Commits are labeled save points">
{`Game progress:
  Save 1 — tutorial done
  Save 2 — boss defeated
  Save 3 — new armor equipped

Git commits:
  abc123 — "Add README"
  def456 — "Fix login bug"
  ghi789 — "Ship dark mode"`}
        </Example>
        <CodeBlock title="You will type commands like these later">
{`git status
git add .
git commit -m "Describe what changed"
git log --oneline`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="Learning path for this Git track">
        <ContentStep number={1} title="Ideas first">
          <p className="text-slate-300">
            What Git is, how it differs from GitHub, install + identity, what{' '}
            <span className="font-mono text-sm text-core-400">git init</span> creates.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Where work lives">
          <p className="text-slate-300">
            Working folder, staging area, repository — then where commits are stored and how hashes
            form history.
          </p>
        </ContentStep>
        <ContentStep number={3} title="First real repo">
          <p className="text-slate-300">
            A copy-paste walkthrough: create a folder, init, add a file, commit, and read the log.
          </p>
        </ContentStep>
        <Callout variant="info" title="Pace yourself">
          Read one lesson, type the commands on your machine, then move on. Muscle memory beats
          memorizing every flag.
        </Callout>
        <Example title="Vocabulary you will meet soon">
{`repository  — a project tracked by Git (.git exists)
commit      — a saved snapshot with a message
branch      — a movable name pointing at a commit
remote      — a hosted copy (often on GitHub)`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Version control records project history so you can undo, compare, and collaborate.',
          'Git is a time machine for code — each commit is a labeled snapshot.',
          'Prefer the snapshot mental model over only thinking about line-by-line diffs.',
          'This track builds from concepts → areas of Git → your first real repository.',
        ]}
      />
    </LessonArticle>
  )
}
