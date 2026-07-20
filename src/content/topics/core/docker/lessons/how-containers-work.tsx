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

export function HowContainersWork() {
  return (
    <LessonArticle>
      <Definition term="How containers isolate work">
        <p>
          On Linux, containers are mostly ordinary processes with{' '}
          <strong className="text-white">extra isolation</strong>. The kernel gives each container
          its own view of the system using features called{' '}
          <strong className="text-white">namespaces</strong> and{' '}
          <strong className="text-white">cgroups</strong> — not a second full operating system.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: same office building (host kernel),{' '}
          <span className="text-docker-400">locked meeting rooms</span> (namespaces) and{' '}
          <span className="text-docker-400">thermostat limits</span> (cgroups).
        </p>
      </Definition>

      <Callout variant="beginner" title="Jargon decoded">
        You do not need to configure namespaces by hand. Docker sets them up when you run a
        container. Learn the words so docs and interviews make sense.
      </Callout>

      <LessonSection title="Namespaces — separate views">
        <p className="text-slate-300">
          A <strong className="text-white">namespace</strong> is a kernel feature that limits what a
          process can <em>see</em>. Process IDs, network interfaces, mount points (filesystems),
          and hostnames can each be namespaced so the container feels like &quot;its own little
          machine.&quot;
        </p>
        <ContentStep number={1} title="Process isolation">
          <p className="text-slate-300">
            Inside the container, the main app may look like PID 1. Outside, it is just another
            process on the host.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Filesystem view">
          <p className="text-slate-300">
            The container sees the image&apos;s filesystem (plus its writable layer), not your
            entire laptop disk — unless you deliberately mount folders.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Network view">
          <p className="text-slate-300">
            Containers often get their own network namespace; you publish ports to reach them from
            the host (next walkthrough lessons).
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Cgroups — resource limits">
        <p className="text-slate-300">
          <strong className="text-white">Control groups (cgroups)</strong> limit how much CPU,
          memory, and other resources a set of processes may use. That stops one noisy container
          from eating the whole machine.
        </p>
        <Example title="Plain English">
{`namespaces  → "What can I see?"
cgroups     → "How much am I allowed to use?"`}
        </Example>
        <CodeBlock title="Optional limits you may see later">
{`# Example: cap memory for a container (syntax can vary by version)
docker run -d --memory=256m --name limited nginx`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="Not a full second OS">
        <Flowchart
          title="Request → container process"
          chart={`flowchart TB
  U[You: docker run ...] --> C[Docker client]
  C --> D[Docker daemon]
  D --> K[Host kernel: namespaces + cgroups]
  K --> P[Container process running the app]`}
        />
        <p className="text-slate-300">
          There is no hidden second Windows/Linux boot for each container on a Linux host. The
          kernel schedules the container&apos;s processes like other processes — with isolation
          knobs turned on.
        </p>
        <Callout variant="info" title="Windows and Mac note">
          Docker Desktop often runs a tiny Linux VM so Linux containers still use a Linux kernel.
          Your commands stay the same; under the hood that VM provides the Linux features above.
        </Callout>
        <Callout variant="tip" title="Takeaway for beginners">
          Containers = isolated processes + their own filesystem view + optional resource caps.
          That mental model beats thinking &quot;mini VMs.&quot;
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Containers isolate processes using Linux namespaces and cgroups.',
          'Namespaces control visibility (processes, files, network); cgroups control limits.',
          'A container is not a full second OS — it shares the host kernel.',
          'docker run asks the daemon to start an isolated process for your app.',
        ]}
      />
    </LessonArticle>
  )
}
