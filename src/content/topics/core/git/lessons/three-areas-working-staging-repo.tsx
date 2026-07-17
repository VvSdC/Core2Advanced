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

export function ThreeAreasWorkingStagingRepo() {
  return (
    <LessonArticle>
      <Definition term="Three areas of Git">
        <p>
          Git keeps your work in three places: the{' '}
          <strong className="text-white">working directory</strong> (files you edit), the{' '}
          <strong className="text-white">staging area</strong> (also called the{' '}
          <strong className="text-white">index</strong> — what you chose for the next commit), and
          the <strong className="text-white">repository</strong> (committed history inside{' '}
          <span className="font-mono text-sm text-core-400">.git</span>).
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: desk (working) → packing box (staging) → locked archive shelf (repository).
        </p>
      </Definition>

      <Callout variant="beginner" title="Why three steps?">
        Staging lets you commit <em>exactly</em> what you intend — maybe two files ready, three
        still messy. You choose what goes into the next snapshot.
      </Callout>

      <LessonSection title="Meet the three areas">
        <Flowchart
          title="Working → Staging → Repository"
          chart={`flowchart TB
  W[Working directory — edit files]
  S[Staging area / index — git add]
  R[Repository — git commit]
  W -->|git add| S
  S -->|git commit| R`}
        />
        <ContentStep number={1} title="Working directory">
          <p className="text-slate-300">
            The normal folder you see in your editor. Change a file here and Git notices it is
            modified or untracked.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Staging area (index)">
          <p className="text-slate-300">
            A draft of the next commit. <span className="font-mono text-sm text-core-400">git add</span>{' '}
            copies the chosen file versions into this draft.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Repository (.git)">
          <p className="text-slate-300">
            Permanent snapshots. <span className="font-mono text-sm text-core-400">git commit</span>{' '}
            stores the staged snapshot in history and clears that draft for the next round.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="File states beginners see">
        <Flowchart
          title="untracked → staged → committed"
          chart={`flowchart TB
  U[Untracked — new file Git does not know]
  S[Staged — after git add]
  C[Committed — after git commit]
  M[Modified — edit after a commit]
  U --> S
  S --> C
  C --> M
  M --> S`}
        />
        <CodeBlock title="Commands that move files between areas">
{`git status          # ask: where is each file?
git add README.md   # working → staging
git add .           # stage everything relevant in this folder
git commit -m "Add README"   # staging → repository`}
        </CodeBlock>
        <Example
          title="Reading git status language"
          caption="Status is your map of the three areas"
        >
{`# Untracked files:     never added before
# Changes to be committed:   staged (ready)
# Changes not staged for commit:  edited after last add/commit`}
        </Example>
      </LessonSection>

      <LessonSection title="The everyday cycle">
        <ContentStep number={1} title="Edit">
          <p className="text-slate-300">Change files in the working directory.</p>
        </ContentStep>
        <ContentStep number={2} title="Stage">
          <p className="text-slate-300">
            <span className="font-mono text-sm text-core-400">git add</span> the pieces that belong
            together.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Commit">
          <p className="text-slate-300">
            <span className="font-mono text-sm text-core-400">git commit -m &quot;…&quot;</span>{' '}
            saves a snapshot with a message.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Modified after commit">
          After a commit, if you edit the same file again, it becomes{' '}
          <strong className="text-white">modified</strong> in the working directory. Stage and
          commit again to record the new snapshot.
        </Callout>
        <Example title="Tiny loop you will repeat forever">
{`echo "hello" > notes.txt
git add notes.txt
git commit -m "Add notes"
# edit notes.txt again…
git add notes.txt
git commit -m "Update notes"`}
        </Example>
      </LessonSection>

      <LessonSection title="Common beginner mix-ups">
        <Callout variant="info" title="Forgot to add?">
          If <span className="font-mono text-sm text-core-400">git commit</span> says nothing to
          commit, you probably edited files but never ran{' '}
          <span className="font-mono text-sm text-core-400">git add</span>. Status will show
          &quot;Changes not staged for commit.&quot;
        </Callout>
        <Callout variant="tip" title="Staged the wrong file?">
          Unstage without deleting your edits:{' '}
          <span className="font-mono text-sm text-core-400">git restore --staged file.txt</span>{' '}
          (older tutorials may show{' '}
          <span className="font-mono text-sm text-core-400">git reset HEAD file.txt</span>).
        </Callout>
        <p className="text-slate-300">
          Remember: staging is a <strong className="text-white">draft</strong>. Until you commit,
          the repository history has not gained a new snapshot yet.
        </p>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Working directory = files you edit; staging = next commit draft; repo = saved history.',
          'git add moves versions into staging; git commit snapshots staging into .git.',
          'New files start untracked → staged → committed; later edits restart the cycle.',
          'git status tells you which area each change is in.',
        ]}
      />
    </LessonArticle>
  )
}
