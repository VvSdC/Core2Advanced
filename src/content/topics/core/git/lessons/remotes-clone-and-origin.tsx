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

export function RemotesCloneAndOrigin() {
  return (
    <LessonArticle>
      <Definition term="Remotes and origin">
        <p>
          A <strong className="text-white">remote</strong> is a nickname for another copy of the repo —
          usually on GitHub, GitLab, or a company server.{' '}
          <span className="font-mono text-sm text-core-400">origin</span> is the default name Git gives
          the remote you cloned from.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: your laptop is the desk copy; origin is the library shelf everyone syncs with.
        </p>
      </Definition>

      <Callout variant="beginner" title="One sentence version">
        Clone downloads a full repo and sets <span className="font-mono text-sm text-core-400">origin</span>{' '}
        to point at that URL.
      </Callout>

      <LessonSection title="Clone a repository">
        <Flowchart
          title="Clone creates a local repo + origin"
          chart={`flowchart TB
  A[Remote URL] --> B[git clone]
  B --> C[New folder with .git]
  C --> D[Remote named origin]
  D --> E[Local main tracks origin/main]`}
        />
        <Example title="HTTPS clone">
{`git clone https://github.com/org/project.git
cd project`}
        </Example>
        <Example title="SSH clone">
{`git clone git@github.com:org/project.git
cd project`}
        </Example>
        <p className="text-slate-300">
          After cloning you already have history, a working tree, and{' '}
          <span className="font-mono text-sm text-core-400">origin</span> configured.
        </p>
      </LessonSection>

      <LessonSection title="Inspect remotes">
        <ContentStep number={1} title="List remotes with URLs">
          <CodeBlock title="Show fetch and push URLs">{`git remote -v`}</CodeBlock>
          <CodeBlock title="Typical output">
{`origin  https://github.com/org/project.git (fetch)
origin  https://github.com/org/project.git (push)`}
          </CodeBlock>
        </ContentStep>
        <ContentStep number={2} title="Add a remote later">
          <p className="text-slate-300">
            If you used <span className="font-mono text-sm text-core-400">git init</span> locally, you add
            origin yourself:
          </p>
          <CodeBlock title="Connect an existing folder">
{`git remote add origin https://github.com/you/new-repo.git
git remote -v`}
          </CodeBlock>
        </ContentStep>
      </LessonSection>

      <LessonSection title="SSH vs HTTPS (high level)">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[24rem] border-collapse text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 text-left text-white">
                <th className="py-2 pr-3">Method</th>
                <th className="py-2 pr-3">Looks like</th>
                <th className="py-2">Beginner notes</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-surface-700">
                <td className="py-2 pr-3 text-core-400">HTTPS</td>
                <td className="py-2 pr-3 font-mono text-xs">https://github.com/...</td>
                <td className="py-2">Works in browsers; often uses a token/password helper</td>
              </tr>
              <tr>
                <td className="py-2 pr-3 text-core-400">SSH</td>
                <td className="py-2 pr-3 font-mono text-xs">git@github.com:...</td>
                <td className="py-2">Uses SSH keys; great once keys are set up</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Either is fine">
          Pick one, set up auth once, and stick with it. The Git commands (
          <span className="font-mono text-sm text-core-400">fetch</span>,{' '}
          <span className="font-mono text-sm text-core-400">pull</span>,{' '}
          <span className="font-mono text-sm text-core-400">push</span>) stay the same.
        </Callout>
        <CodeBlock title="Rename or change URL later">
{`git remote set-url origin git@github.com:org/project.git
git remote -v`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="Clone options beginners meet">
        <CodeBlock title="Clone into a specific folder name">
{`git clone https://github.com/org/project.git my-folder
cd my-folder`}
        </CodeBlock>
        <CodeBlock title="Shallow clone (less history — advanced tip)">
{`git clone --depth 1 https://github.com/org/project.git
# smaller download; not always ideal for full contribution`}
        </CodeBlock>
        <Callout variant="beginner" title="Fresh clone vs init">
          Prefer <span className="font-mono text-sm text-core-400">git clone</span> when the project
          already lives on a host. Use <span className="font-mono text-sm text-core-400">git init</span>{' '}
          + <span className="font-mono text-sm text-core-400">remote add</span> when you start a brand-new
          project on your machine first.
        </Callout>
        <Example title="New project → GitHub later">
{`mkdir my-app && cd my-app
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/you/my-app.git
git push -u origin main`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          <><span className="font-mono text-sm text-core-400">git clone</span> copies a remote repo and names it <span className="font-mono text-sm text-core-400">origin</span>.</>,
          <><span className="font-mono text-sm text-core-400">git remote -v</span> shows where fetch/push go.</>,
          <>HTTPS vs SSH is about authentication, not different Git concepts.</>,
          <>You can <span className="font-mono text-sm text-core-400">remote add</span> after a local <span className="font-mono text-sm text-core-400">init</span>.</>,
        ]}
      />
    </LessonArticle>
  )
}
