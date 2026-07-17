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
} from '../../../../components/content'

export function ContainersVsVirtualMachines() {
  return (
    <LessonArticle>
      <Definition term="Containers vs virtual machines">
        <p>
          A <strong className="text-white">virtual machine (VM)</strong> runs a{' '}
          <strong className="text-white">full guest operating system</strong> on top of a
          hypervisor. A <strong className="text-white">container</strong> shares the{' '}
          <strong className="text-white">host kernel</strong> and isolates the app with lighter
          boundaries.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a VM is a <span className="text-docker-400">whole house with its own utilities</span>;
          a container is an <span className="text-docker-400">apartment in a shared building</span>{' '}
          — private rooms, shared foundation.
        </p>
      </Definition>

      <Callout variant="beginner" title="Both are useful">
        Containers are not &quot;VMs but better&quot; in every case. They are different tools.
        Beginners usually meet containers first for app packaging; VMs still shine for strong OS
        isolation and mixed kernels.
      </Callout>

      <LessonSection title="The core difference">
        <Flowchart
          title="What sits on the hardware"
          chart={`flowchart TB
  subgraph VM[Virtual machine]
    H1[Host hardware]
    HV[Hypervisor]
    GOS[Guest OS]
    APP1[App]
    H1 --> HV --> GOS --> APP1
  end
  subgraph CT[Container]
    H2[Host hardware]
    HOS[Host OS + kernel]
    ENG[Container engine]
    APP2[App]
    H2 --> HOS --> ENG --> APP2
  end`}
        />
        <ContentStep number={1} title="VM = guest OS">
          <p className="text-slate-300">
            Each VM boots its own kernel and userland. Strong isolation; more RAM, disk, and
            startup time.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Container = shared kernel">
          <p className="text-slate-300">
            Containers reuse the host kernel. They start fast and pack densely, but they do not
            give you a second independent OS kernel.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Resource and startup comparison">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full min-w-[28rem] text-left text-sm text-slate-300">
            <thead className="border-b border-surface-600 bg-surface-900 text-white">
              <tr>
                <th className="px-4 py-3 font-semibold">Topic</th>
                <th className="px-4 py-3 font-semibold">Virtual machine</th>
                <th className="px-4 py-3 font-semibold">Container</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3 text-white">Kernel</td>
                <td className="px-4 py-3">Own guest kernel</td>
                <td className="px-4 py-3">Shares host kernel</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3 text-white">Typical size</td>
                <td className="px-4 py-3">GBs (full OS)</td>
                <td className="px-4 py-3">MBs–hundreds of MB common</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3 text-white">Startup</td>
                <td className="px-4 py-3">Seconds to minutes</td>
                <td className="px-4 py-3">Often near-instant</td>
              </tr>
              <tr className="border-b border-surface-700">
                <td className="px-4 py-3 text-white">Density</td>
                <td className="px-4 py-3">Fewer per host</td>
                <td className="px-4 py-3">Many per host</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-white">Isolation feel</td>
                <td className="px-4 py-3">Full OS boundary</td>
                <td className="px-4 py-3">Process + filesystem isolation</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Example title="Rough intuition (not exact numbers)">
{`Start 50 copies of a small web app:
  VMs     → lots of duplicate OS overhead
  Containers → share one kernel, less waste`}
        </Example>
      </LessonSection>

      <LessonSection title="When beginners choose containers">
        <p className="text-slate-300">
          For packaging a web app, a database demo, or a microservice, Docker containers are usually
          the lighter path. You still may run Docker Desktop{' '}
          <strong className="text-white">inside</strong> a lightweight VM on Windows/Mac — that is
          an implementation detail; your mental model stays &quot;container for the app.&quot;
        </p>
        <CodeBlock title="Containers feel like processes">
{`# Start / stop feel closer to managing a process than booting an OS
docker run -d --name web nginx
docker stop web
docker rm web`}
        </CodeBlock>
        <Callout variant="tip" title="Remember the apartment analogy">
          Shared foundation (kernel) + private living space (isolated files, processes, limits).
          That is the heart of containers vs VMs.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'VMs include a full guest OS; containers share the host kernel.',
          'Containers are typically smaller and start faster than VMs.',
          'Isolation styles differ — choose based on needs, not hype.',
          'Apartment vs whole house is a solid beginner mental model.',
        ]}
      />
    </LessonArticle>
  )
}
