import {
  Callout,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function LangsmithVsLangfuse() {
  return (
    <LessonArticle>
      <LessonSection title="Two observability platforms, one problem">
        <p className="text-slate-300">
          Both <strong className="text-white">LangSmith</strong> and{' '}
          <strong className="text-white">Langfuse</strong> help you trace, debug, and evaluate LLM apps. They
          record prompts, tool calls, latency, and errors — but they come from different philosophies. This
          lesson is a fair side-by-side so you can pick (or combine) the right tool.
        </p>
      </LessonSection>

      <LessonSection title="Head-to-head comparison">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Dimension</th>
                <th className="px-4 py-3">LangSmith</th>
                <th className="px-4 py-3">Langfuse</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Ecosystem fit',
                  'LangChain-native — built by the LangChain team; deepest integration with LangChain, LangGraph, and LangGraph Platform',
                  'Framework-agnostic — works with any Python/JS stack, raw OpenAI SDK, custom code, or LangChain via CallbackHandler',
                ],
                [
                  'Open source',
                  'Proprietary platform (cloud-hosted); no self-hosted OSS edition',
                  'Core platform is open source (MIT); full source on GitHub',
                ],
                [
                  'Self-hosting',
                  'Cloud only (smith.langchain.com) — no on-prem deployment option',
                  'Self-host with Docker, or use Langfuse Cloud — good for data residency requirements',
                ],
                [
                  'Pricing model',
                  'Free tier + usage-based paid plans (traces, eval runs); bundled with LangChain Plus offerings',
                  'Generous free cloud tier; self-host is free (you pay infra); paid cloud for teams at scale',
                ],
                [
                  'Tracing setup',
                  'Often zero code — set env vars and LangChain apps trace automatically',
                  'SDK decorators (@observe) or CallbackHandler; slightly more explicit setup',
                ],
                [
                  'Evaluation',
                  'First-class datasets, experiments, 30+ evaluator templates, Prompt Hub',
                  'Datasets, experiments, LLM-as-judge evaluators, prompt management',
                ],
                [
                  'Best audience',
                  'Teams all-in on LangChain/LangGraph who want lowest-friction tracing',
                  'Teams needing OSS, self-host, or mixing multiple frameworks beyond LangChain',
                ],
              ].map(([dim, smith, fuse]) => (
                <tr key={dim} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{dim}</td>
                  <td className="px-4 py-3 text-slate-400">{smith}</td>
                  <td className="px-4 py-3 text-slate-400">{fuse}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="When to use LangSmith">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            Your app is built with <strong className="text-white">LangChain or LangGraph</strong> and you want
            tracing with minimal setup.
          </li>
          <li>
            You want <strong className="text-white">one vendor</strong> for build + observe + deploy (LangGraph
            Platform).
          </li>
          <li>
            You need <strong className="text-white">Prompt Hub</strong> and tight integration with LangChain
            prompt pull APIs.
          </li>
          <li>Cloud-only is acceptable — no requirement to run observability on your own servers.</li>
        </ul>
      </LessonSection>

      <LessonSection title="When to use Langfuse">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            You need <strong className="text-white">open source</strong> or{' '}
            <strong className="text-white">self-hosted</strong> observability (compliance, air-gapped envs).
          </li>
          <li>
            Your stack mixes frameworks — raw OpenAI SDK, custom Python, TypeScript services,{' '}
            <em>and</em> some LangChain.
          </li>
          <li>
            You want to avoid vendor lock-in to the LangChain ecosystem for the observability layer.
          </li>
          <li>
            Cost predictability via self-hosting matters more than zero-config LangChain tracing.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Can you use both?">
        <p className="text-slate-300">
          Yes, in theory — but rarely in practice for the same production traffic. Running dual observability
          doubles ingestion cost, adds latency, and splits your debugging workflow across two dashboards.
        </p>
        <Callout variant="tip">
          A sensible hybrid: use <strong className="text-white">LangSmith</strong> for LangChain/LangGraph dev
          and eval workflows, and <strong className="text-white">Langfuse</strong> for non-LangChain microservices
          in the same product. Or evaluate both during a pilot week, then standardise on one.
        </Callout>
        <p className="mt-3 text-slate-300">
          Both solve the same core job — making LLM apps debuggable. Pick based on{' '}
          <strong className="text-white">ecosystem fit</strong> and{' '}
          <strong className="text-white">deployment constraints</strong>, not feature checklists alone. The
          Langfuse sub-topic in this course covers the other path in equal depth.
        </p>
      </LessonSection>

      <KeyTakeaways
        items={[
          'LangSmith = LangChain-native, cloud-only, near-zero setup for LangChain/LangGraph apps.',
          'Langfuse = framework-agnostic, open source, self-hostable — better for mixed stacks or data residency.',
          'Both offer tracing, datasets, evaluators, and prompt management — choose by ecosystem and hosting needs.',
          'Using both on the same traffic is usually overkill; pilot both, then pick one (or split by service).',
        ]}
      />
    </LessonArticle>
  )
}
