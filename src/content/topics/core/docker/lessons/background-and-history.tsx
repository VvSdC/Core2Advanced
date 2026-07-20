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

export function BackgroundAndHistory() {
  return (
    <LessonArticle>
      <Definition term="Where containers came from">
        <p>
          <strong className="text-white">Containers</strong> grew from a long need: run many
          isolated apps on one machine without wasting a full operating system for each. Linux
          features made lightweight isolation possible; Docker later made that power{' '}
          <strong className="text-white">easy for developers</strong>.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: shipping containers standardized freight — Docker helped{' '}
          <span className="text-docker-400">standardize how we ship software</span>.
        </p>
      </Definition>

      <Callout variant="beginner" title="History in one sentence">
        Isolation existed in Linux before Docker; Docker popularized a simple toolkit and workflow
        so everyday developers could use containers.
      </Callout>

      <LessonSection title="Why containers emerged">
        <p className="text-slate-300">
          Servers used to run one big app, or many apps fighting over shared libraries. Full virtual
          machines fixed isolation but were heavy. Teams wanted something lighter: isolate processes
          and filesystems without booting a second OS every time.
        </p>
        <Flowchart
          title="From messy shared hosts to containers"
          chart={`flowchart TB
  A[Shared server chaos] --> B[Full VMs — strong but heavy]
  B --> C[Linux isolation features]
  C --> D[Containers — light isolation]
  D --> E[Docker — great developer UX]`}
        />
        <ContentStep number={1} title="Isolation without waste">
          <p className="text-slate-300">
            Give each app its own view of files and processes, while sharing the host kernel for
            efficiency.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Repeatable deploys">
          <p className="text-slate-300">
            Package once, run the same unit in test, staging, and production.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Linux containers and LXC heritage">
        <p className="text-slate-300">
          On Linux, isolation builds on kernel features (later lessons cover{' '}
          <span className="font-mono text-sm text-docker-400">namespaces</span> and{' '}
          <span className="font-mono text-sm text-docker-400">cgroups</span>). Projects like{' '}
          <strong className="text-white">LXC</strong> (Linux Containers) offered container tooling
          before Docker became famous. Docker stood on that heritage and focused on a friendly
          image format, CLI, and ecosystem.
        </p>
        <Example title="High-level timeline (simplified)">
{`Linux kernel features → early container tools (e.g. LXC)
                     → Docker popularizes images + CLI + Hub
                     → Containers become mainstream for apps`}
        </Example>
        <Callout variant="info" title="You do not need LXC to learn Docker">
          Treat LXC as historical context. Day to day you talk to Docker; under the hood Docker
          still relies on the same kind of Linux isolation ideas.
        </Callout>
      </LessonSection>

      <LessonSection title="Docker and the shipping-container analogy">
        <p className="text-slate-300">
          Physical shipping containers let trucks, ships, and cranes handle the{' '}
          <strong className="text-white">same box shape</strong> regardless of what is inside.
          Software containers aim for a similar deal: one standard unit that runtimes and platforms
          understand.
        </p>
        <ContentStep number={1} title="Standard box">
          <p className="text-slate-300">
            An image/container is a known format tools can pull, run, and move.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Developer UX">
          <p className="text-slate-300">
            Docker Inc. and the open-source Docker project made commands like{' '}
            <span className="font-mono text-sm text-docker-400">docker run</span> approachable —
            that UX spread containers far beyond kernel experts.
          </p>
        </ContentStep>
        <CodeBlock title="The vibe of early Docker success">
{`# One memorable idea:
# "Build, ship, run" the same way everywhere
docker run my-app`}
        </CodeBlock>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Containers emerged to isolate apps without the full cost of a VM per workload.',
          'Linux container tech (including LXC heritage) predates Docker’s popularity.',
          'Docker’s breakthrough was packaging + CLI + registries that developers loved.',
          'The shipping-container analogy: a standard box that moves the same way everywhere.',
        ]}
      />
    </LessonArticle>
  )
}
