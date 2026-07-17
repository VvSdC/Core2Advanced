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

export function GitVsGithub() {
  return (
    <LessonArticle>
      <Definition term="Git vs GitHub">
        <p>
          <strong className="text-white">Git</strong> is the tool that runs on{' '}
          <strong className="text-white">your computer</strong>.{' '}
          <strong className="text-white">GitHub</strong> (and GitLab, Bitbucket, etc.) are{' '}
          <strong className="text-white">websites that host</strong> Git repositories so people can
          share and collaborate online.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: Git is like <span className="text-core-400">Microsoft Word on your laptop</span>.
          GitHub is like <span className="text-core-400">Google Drive</span> — a place to store and
          share those documents.
        </p>
      </Definition>

      <Callout variant="beginner" title="Common mix-up">
        People say &quot;I pushed to Git&quot; when they mean GitHub. You use Git commands locally;
        you push to a remote host when you want a copy in the cloud.
      </Callout>

      <LessonSection title="Local vs remote">
        <Flowchart
          title="Your machine and the cloud"
          chart={`flowchart TB
  L[Local repo — .git on your PC]
  R[Remote — GitHub / GitLab / Bitbucket]
  L -->|git push| R
  R -->|git clone / git pull| L`}
        />
        <ContentStep number={1} title="Local repository">
          <p className="text-slate-300">
            Lives in a hidden <span className="font-mono text-sm text-core-400">.git</span> folder
            inside your project. You can commit offline — no internet required.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Remote repository">
          <p className="text-slate-300">
            A copy hosted on a server. Remotes make backup, code review, and teamwork possible.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Same Git, many hosts">
          <p className="text-slate-300">
            Commands like <span className="font-mono text-sm text-core-400">git commit</span> are
            the same whether the remote is GitHub, GitLab, or Bitbucket.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Side-by-side comparison">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full min-w-[28rem] text-left text-sm text-slate-300">
            <thead className="border-b border-surface-600 bg-surface-900 text-white">
              <tr>
                <th className="px-4 py-3 font-semibold">Topic</th>
                <th className="px-4 py-3 font-semibold">Git</th>
                <th className="px-4 py-3 font-semibold">GitHub / hosts</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3 text-white">What it is</td>
                <td className="px-4 py-3">Version control software</td>
                <td className="px-4 py-3">Hosting + collaboration website</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3 text-white">Where it runs</td>
                <td className="px-4 py-3">Your machine</td>
                <td className="px-4 py-3">Cloud servers</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3 text-white">Needs internet?</td>
                <td className="px-4 py-3">No for local commits</td>
                <td className="px-4 py-3">Yes to push / pull / browse</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3 text-white">Examples</td>
                <td className="px-4 py-3">
                  <span className="font-mono text-sm text-core-400">git</span> CLI
                </td>
                <td className="px-4 py-3">GitHub, GitLab, Bitbucket</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-white">You mainly…</td>
                <td className="px-4 py-3">init, add, commit, branch</td>
                <td className="px-4 py-3">host remotes, PRs, issues</td>
              </tr>
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="How they work together">
        <Example title="Typical beginner flow" caption="Git locally, then share on a host">
{`# On your computer (Git)
git init
git add .
git commit -m "First commit"

# Later, share online (Git + remote host)
git remote add origin https://github.com/you/my-project.git
git push -u origin main`}
        </Example>
        <CodeBlock title="Remember this sentence">
{`Git = the engine on your machine
GitHub = one popular garage where the car is parked for others`}
        </CodeBlock>
        <Callout variant="tip" title="You can use Git alone">
          A full Git history on a USB drive is still valid Git. Hosts are optional extras for
          sharing — not required to learn the basics.
        </Callout>
      </LessonSection>

      <LessonSection title="What hosts add on top of Git">
        <p className="text-slate-300">
          Remotes still speak Git. Hosts wrap that with a website: pull requests / merge requests,
          issues, CI buttons, and access control. Those features are powerful — but they sit{' '}
          <strong className="text-white">on top of</strong> commits, branches, and remotes.
        </p>
        <ContentStep number={1} title="Learn Git first">
          <p className="text-slate-300">
            init, add, commit, log, branch — works fully offline.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Then connect a remote">
          <p className="text-slate-300">
            <span className="font-mono text-sm text-core-400">git remote</span>,{' '}
            <span className="font-mono text-sm text-core-400">push</span>,{' '}
            <span className="font-mono text-sm text-core-400">pull</span> — same Git, new destination.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Git is local software; GitHub/GitLab/Bitbucket host remotes on the web.',
          'You commit offline; you push/pull when syncing with a remote.',
          'The same Git commands work with any Git host.',
          'Learn Git first — hosting features (PRs, issues) come after the core ideas.',
        ]}
      />
    </LessonArticle>
  )
}
