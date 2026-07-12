import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function LargeLanguageModels() {
  return (
    <LessonArticle>
      <Definition term="Large Language Model (LLM)">
        <p>
          A <strong className="text-white">large language model</strong> typically has{' '}
          <strong className="text-white">tens to hundreds of billions of parameters</strong> (10B–1T+). LLMs are
          trained on massive datasets with enormous compute budgets and serve as general-purpose foundation models
          for text understanding and generation.
        </p>
      </Definition>

      <LessonSection title="Where LLMs sit on the scale">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Model family</th>
                <th className="px-4 py-3">Largest variant</th>
                <th className="px-4 py-3">Notable capability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['GPT-4 class', '~1.8T (MoE, reported)', 'Broad reasoning, coding, analysis'],
                ['Llama 3.1', '405B', 'Largest open-weights model'],
                ['Claude 3.5', 'Undisclosed', 'Long context, nuanced writing'],
                ['Gemini 1.5 Pro', 'Undisclosed', 'Up to 1M token context window'],
                ['Mixtral 8×7B', '47B total (13B active)', 'Mixture-of-Experts efficiency'],
              ].map(([family, size, capability]) => (
                <tr key={family} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{family}</td>
                  <td className="px-4 py-3 font-mono">{size}</td>
                  <td className="px-4 py-3 text-slate-400">{capability}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="What LLMs can do that SLMs struggle with">
        <ContentStep number={1} title="Broad world knowledge">
          <p>
            LLMs trained on trillions of tokens absorb facts across science, history, law, medicine, and culture.
            They can answer questions about niche topics without domain-specific fine-tuning.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Multi-step reasoning">
          <p>
            Tasks that require chaining several logical steps — proving a math result, debugging code across files,
            or comparing policy arguments — benefit from the extra capacity of large models.
          </p>
          <Callout variant="beginner">
            Techniques like <strong className="text-white">chain-of-thought prompting</strong> ("think step by step")
            unlock much of this reasoning ability. The model writes intermediate steps before the final answer.
          </Callout>
        </ContentStep>

        <ContentStep number={3} title="Instruction following and versatility">
          <p>
            A single LLM can translate, write emails, generate SQL, summarise PDFs, and role-play — all from
            natural-language instructions without retraining. This versatility is the foundation of chat-based AI
            products.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="The cost of scale">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Training cost</strong> — a frontier model can cost $100M+ in GPU time,
            energy, and engineering.
          </li>
          <li>
            <strong className="text-white">Inference cost</strong> — every token generated requires billions of
            floating-point operations across all layers.
          </li>
          <li>
            <strong className="text-white">Infrastructure</strong> — serving a 70B model needs multiple high-memory
            GPUs; a 405B model needs a cluster.
          </li>
          <li>
            <strong className="text-white">Latency</strong> — larger models are slower, especially without
            optimisations like quantisation or speculative decoding.
          </li>
        </ul>
        <Callout variant="insight">
          <strong className="text-white">Mixture of Experts (MoE)</strong> is one way to scale capacity without
          scaling cost linearly. Mixtral activates only 13B of its 47B parameters per token — getting large-model
          quality at a fraction of the compute.
        </Callout>
      </LessonSection>

      <LessonSection title="SLM vs LLM — when to use which">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Factor</th>
                <th className="px-4 py-3">SLM (&lt;10B)</th>
                <th className="px-4 py-3">LLM (10B+)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Speed', 'Fast', 'Slower'],
                ['Cost', 'Low', 'High'],
                ['On-device', 'Yes', 'Rarely'],
                ['General knowledge', 'Limited', 'Broad'],
                ['Complex reasoning', 'Moderate', 'Strong'],
                ['Best for', 'Focused, high-volume tasks', 'General assistant, hard problems'],
              ].map(([factor, slm, llm]) => (
                <tr key={factor} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{factor}</td>
                  <td className="px-4 py-3 text-slate-400">{slm}</td>
                  <td className="px-4 py-3 text-slate-400">{llm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'LLMs have tens to hundreds of billions of parameters — general-purpose foundation models.',
          'They excel at broad knowledge, multi-step reasoning, and versatile instruction following.',
          'Trade-off: high training cost, expensive inference, and slower latency.',
          'MoE architectures scale capacity without linearly scaling per-token cost.',
        ]}
      />
    </LessonArticle>
  )
}
