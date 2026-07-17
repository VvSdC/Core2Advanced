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

export function PushToRemote() {
  return (
    <LessonArticle>
      <Definition term="git push">
        <p>
          <span className="font-mono text-sm text-core-400">git push</span> uploads your local commits to
          a remote (usually <span className="font-mono text-sm text-core-400">origin</span>) so others —
          and backup copies — can see them.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: commit files papers in your desk drawer; push ships copies to the shared library shelf.
        </p>
      </Definition>

      <Callout variant="beginner" title="One sentence version">
        Push publishes commits that already exist locally. It does not run{' '}
        <span className="font-mono text-sm text-core-400">add</span> or{' '}
        <span className="font-mono text-sm text-core-400">commit</span> for you.
      </Callout>

      <LessonSection title="First push and upstream tracking">
        <Flowchart
          title="Set upstream, then push"
          chart={`flowchart TB
  A[Local commits] --> B["git push -u origin main"]
  B --> C[Remote branch updated]
  C --> D[Upstream tracking set]
  D --> E[Later: plain git push]`}
        />
        <ContentStep number={1} title="Push and set upstream">
          <p className="text-slate-300">
            <span className="font-mono text-sm text-core-400">-u</span> (or{' '}
            <span className="font-mono text-sm text-core-400">--set-upstream</span>) remembers which remote
            branch this local branch tracks.
          </p>
          <Example title="Common first push">
{`git push -u origin main
# some repos still use master:
git push -u origin master`}
          </Example>
        </ContentStep>
        <ContentStep number={2} title="Push a new feature branch">
          <CodeBlock title="Publish your branch">
{`git switch -c feature/login
# ... commits ...
git push -u origin feature/login`}
          </CodeBlock>
        </ContentStep>
        <ContentStep number={3} title="Everyday push afterward">
          <CodeBlock title="Once upstream exists">{`git push`}</CodeBlock>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What upstream tracking means">
        <p className="text-slate-300">
          After <span className="font-mono text-sm text-core-400">-u</span>, Git knows:{' '}
          <em>this local branch ↔ that remote branch</em>. Then{' '}
          <span className="font-mono text-sm text-core-400">git push</span> and{' '}
          <span className="font-mono text-sm text-core-400">git pull</span> need fewer arguments, and{' '}
          <span className="font-mono text-sm text-core-400">git status</span> can say &quot;ahead 2 /
          behind 1.&quot;
        </p>
        <CodeBlock title="Status often shows tracking">
{`On branch feature/login
Your branch is ahead of 'origin/feature/login' by 1 commit.
  (use "git push" to publish your local commits)`}
        </CodeBlock>
        <Callout variant="tip" title="Check remotes anytime">
          <span className="font-mono text-sm text-core-400">git remote -v</span> confirms where push goes.
        </Callout>
      </LessonSection>

      <LessonSection title="Rejected: non-fast-forward (intro)">
        <p className="text-slate-300">
          If the remote has commits you do not have, Git rejects a plain push. That protects teammates&apos;
          work from being overwritten.
        </p>
        <CodeBlock title="Typical rejection message">
{`! [rejected]        main -> main (non-fast-forward)
error: failed to push some refs
hint: Updates were rejected because the remote contains work
hint: that you do not have locally.`}
        </CodeBlock>
        <ContentStep number={1} title="Beginner recovery path">
          <CodeBlock title="Integrate remote work first">
{`git fetch origin
git merge origin/main
# resolve conflicts if any, then:
git push`}
          </CodeBlock>
          <p className="text-slate-300">
            Or use <span className="font-mono text-sm text-core-400">git pull</span> (fetch + merge) when
            you are ready to combine — covered in the pull lessons.
          </p>
        </ContentStep>
        <Callout variant="insight" title="Do not jump to force-push">
          Force-push rewrites the remote. Skip it on shared{' '}
          <span className="font-mono text-sm text-core-400">main</span> unless your team explicitly allows
          it.
        </Callout>
      </LessonSection>

      <LessonSection title="What you push (and what you do not)">
        <p className="text-slate-300">
          Only <strong className="text-white">commits</strong> travel on push. Untracked or uncommitted
          files stay on your laptop until you add and commit them.
        </p>
        <CodeBlock title="Checklist before push">
{`git status
git log --oneline -3
git push`}
        </CodeBlock>
        <Callout variant="tip" title="Push early, push often (on your branch)">
          Publishing a feature branch frequently backs up your work and makes collaboration easier. Just
          keep messages clear.
        </Callout>
        <Example title="After more local commits">
{`git add .
git commit -m "Polish header spacing"
git push
# uses the upstream you set with -u`}
        </Example>
        <CodeBlock title="See tracking relationship">
{`git status -sb
# ## feature/login...origin/feature/login`}
        </CodeBlock>
      </LessonSection>

      <KeyTakeaways
        items={[
          <>Push uploads commits; commit locally first.</>,
          <><span className="font-mono text-sm text-core-400">git push -u origin main</span> sets upstream tracking.</>,
          <>After -u, plain <span className="font-mono text-sm text-core-400">git push</span> is enough.</>,
          <>Non-fast-forward → fetch/merge (or pull), then push — not force by default.</>,
        ]}
      />
    </LessonArticle>
  )
}
