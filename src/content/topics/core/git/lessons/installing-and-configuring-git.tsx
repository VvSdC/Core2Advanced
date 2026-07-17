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

export function InstallingAndConfiguringGit() {
  return (
    <LessonArticle>
      <Definition term="Installing and configuring Git">
        <p>
          Before you create repositories, install the <strong className="text-white">Git
          program</strong> and tell it your <strong className="text-white">name and email</strong>.
          Those identity settings are stamped on every commit you make.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: installing Git is buying a camera;{' '}
          <span className="font-mono text-sm text-core-400">user.name</span> /{' '}
          <span className="font-mono text-sm text-core-400">user.email</span> write your name on
          every photo&apos;s label.
        </p>
      </Definition>

      <Callout variant="beginner" title="Goal for this lesson">
        Prove Git is installed with <span className="font-mono text-sm text-core-400">git --version</span>,
        set your global identity, and list settings with{' '}
        <span className="font-mono text-sm text-core-400">git config --list</span>.
      </Callout>

      <LessonSection title="Install Git (high level)">
        <Flowchart
          title="Setup path"
          chart={`flowchart TB
  A[Install Git for your OS] --> B[Open a terminal]
  B --> C[git --version]
  C --> D[git config --global user.name / user.email]
  D --> E[git config --list]`}
        />
        <ContentStep number={1} title="Windows">
          <p className="text-slate-300">
            Download the installer from the official Git site, or install via{' '}
            <span className="font-mono text-sm text-core-400">winget install Git.Git</span>. Use
            Git Bash or PowerShell afterward.
          </p>
        </ContentStep>
        <ContentStep number={2} title="macOS">
          <p className="text-slate-300">
            Install Xcode Command Line Tools when prompted by{' '}
            <span className="font-mono text-sm text-core-400">git</span>, or use Homebrew:{' '}
            <span className="font-mono text-sm text-core-400">brew install git</span>.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Linux">
          <p className="text-slate-300">
            Use your package manager — for example{' '}
            <span className="font-mono text-sm text-core-400">sudo apt install git</span> (Debian/Ubuntu)
            or the equivalent for your distro.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Verify the install">
        <Example
          title="Check that Git responds"
          caption="Any recent version is fine for learning"
          output="git version 2.45.0"
        >
{`git --version`}
        </Example>
        <Callout variant="info" title="Command not found?">
          Close and reopen the terminal after installing. If it still fails, Git is not on your{' '}
          <span className="font-mono text-sm text-core-400">PATH</span> — re-run the installer or
          restart the computer.
        </Callout>
      </LessonSection>

      <LessonSection title="Set your identity">
        <p className="text-slate-300">
          <span className="font-mono text-sm text-core-400">--global</span> means &quot;for all
          repositories on this user account.&quot; Use the name and email you want attached to your
          work history.
        </p>
        <CodeBlock title="Required once (almost always)">
{`git config --global user.name "Ada Lovelace"
git config --global user.email "ada@example.com"`}
        </CodeBlock>
        <Example title="Confirm what Git stored">
{`git config --global user.name
git config --global user.email`}
        </Example>
        <Callout variant="tip" title="Why identity matters">
          Every commit records author name + email. Teammates (and future-you) use that to see who
          wrote a change. On GitHub, matching email helps link commits to your profile.
        </Callout>
      </LessonSection>

      <LessonSection title="List your configuration">
        <CodeBlock title="See all settings Git knows about">
{`git config --list`}
        </CodeBlock>
        <p className="text-slate-300">
          You will see <span className="font-mono text-sm text-core-400">user.name</span>,{' '}
          <span className="font-mono text-sm text-core-400">user.email</span>, and other defaults.
          Do not worry about every line yet — focus on identity first.
        </p>
        <Example title="Optional: nicer diffs later">
{`# Beginners can skip this — shown so you know config exists
git config --global init.defaultBranch main
git config --global color.ui auto`}
        </Example>
      </LessonSection>

      <LessonSection title="Global vs local config">
        <p className="text-slate-300">
          <span className="font-mono text-sm text-core-400">--global</span> writes to your user
          settings (all repos). Without it,{' '}
          <span className="font-mono text-sm text-core-400">git config</span> can set values for{' '}
          <em>only the current repository</em> — useful if one project needs a work email and
          another needs a personal one.
        </p>
        <CodeBlock title="See where a value comes from">
{`git config --global --list
git config --local --list    # only inside a repository
git config user.email        # effective value Git will use`}
        </CodeBlock>
        <Callout variant="insight" title="Wrong name on a commit?">
          Fix <span className="font-mono text-sm text-core-400">user.name</span> /{' '}
          <span className="font-mono text-sm text-core-400">user.email</span> before your next
          commit. Changing config does not rewrite old commits automatically.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Install Git for your OS, then verify with git --version.',
          'Set global user.name and user.email — they label every commit.',
          'git config --list shows what Git currently uses.',
          'Identity is not a login password; it is metadata written into history.',
        ]}
      />
    </LessonArticle>
  )
}
