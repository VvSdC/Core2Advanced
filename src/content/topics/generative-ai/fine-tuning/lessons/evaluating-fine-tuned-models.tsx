import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function EvaluatingFineTunedModels() {
  return (
    <LessonArticle>
      <Definition term="Fine-tune evaluation">
        <p>
          Checking whether a fine-tuned model is <strong className="text-white">actually better for your task</strong>
          — not just that training loss went down. Eval mixes held-out loss, task metrics, careful LLM-as-judge
          scores, and human review on real prompts.
        </p>
      </Definition>

      <Callout variant="beginner" title="The trap">
        Low eval loss feels comforting. It does not guarantee better answers on support tickets, code styles, or
        brand voice. Always test on prompts your users will type.
      </Callout>

      <LessonSection title="Held-out eval loss is not enough">
        <p className="text-slate-300">
          During training you typically split data into train and a held-out set and watch{' '}
          <strong className="text-white">eval loss / perplexity</strong>. That measures how surprised the model is
          by next tokens in your dataset distribution.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>Good for spotting training bugs and gross overfitting.</li>
          <li>
            Weak for open-ended generation quality, tone, tool-call format, or factual usefulness.
          </li>
          <li>
            Can look great while the model still fails your real product prompts.
          </li>
        </ul>
        <Callout variant="insight">
          Treat eval loss as a <em>smoke test</em>, not a ship decision. The ship decision is: “Does it beat the
          base model on my golden set?”
        </Callout>
      </LessonSection>

      <LessonSection title="Layers of evaluation">
        <ContentStep number={1} title="Task metrics (when you have labels)">
          <p className="text-slate-300">
            Classification accuracy, exact match, F1, BLEU/ROUGE for constrained generation, structured-output
            parse success rate, tool-call schema validity. Prefer metrics that map to product success.
          </p>
        </ContentStep>
        <ContentStep number={2} title="LLM-as-judge (use carefully)">
          <p className="text-slate-300">
            Ask a strong judge model to score helpfulness, faithfulness, or style. Useful for open-ended text —
            but judges have biases (prefer longer answers, favor the base model’s style). Use rubrics, blind
            comparisons, and spot-check with humans.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Human review">
          <p className="text-slate-300">
            Sample 20–50 hard prompts. Score win / tie / loss vs base. Humans catch toxic tone, subtle leakage,
            and “technically correct but useless” answers that automated metrics miss.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Base vs fine-tuned head-to-head">
          <p className="text-slate-300">
            Same prompts, same decoding settings. Side-by-side comparison on <span className="text-genai-400">your</span>{' '}
            real prompts — not only training-style paraphrases.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Overfitting signals">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Train loss ↓, held-out loss ↑</strong> after some step — classic overfit.
          </li>
          <li>
            <strong className="text-white">Memorizes few-shot phrasings</strong> from the dataset but fails slight
            rewrites of the same question.
          </li>
          <li>
            <strong className="text-white">Collapses diversity</strong> — always the same boilerplate opening or
            format even when inappropriate.
          </li>
          <li>
            <strong className="text-white">Base model was better</strong> on general prompts you still care about
            (catastrophic forgetting / style lock-in).
          </li>
        </ul>
        <Example title="Simple golden-set discipline">{`Hold out 50–100 real prompts never used in training.
For each: base answer vs FT answer.
Labels: win / tie / lose (+ notes).
Ship only if FT wins more on what matters
and does not regress badly on "must not break" prompts.`}</Example>
      </LessonSection>

      <LessonSection title="Build a small eval suite">
        <p className="text-slate-300">
          Version a CSV/JSONL of prompts with expected behaviors (not necessarily exact gold strings): format
          rules, forbidden claims, must-cite sources, tone examples. Re-run after every adapter version.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Slice</th>
                <th className="px-4 py-3">What to check</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Happy path', 'Typical user asks; format and tone'],
                ['Edge cases', 'Empty context, long inputs, ambiguity'],
                ['Safety / policy', 'Refusals, PII, disallowed topics'],
                ['Regression', 'General skills base model still must keep'],
              ].map(([slice, check]) => (
                <tr key={slice} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{slice}</td>
                  <td className="px-4 py-3 text-genai-400">{check}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Checklist flowchart">
        <Flowchart
          title="Ship / iterate decision"
          chart={`flowchart TD
  START[New adapter] --> LOSS{Eval loss sane?}
  LOSS -->|No| BUG[Fix data / train / template]
  LOSS -->|Yes| GOLD[Run golden prompts]
  GOLD --> VS{FT vs base}
  VS -->|Worse| TUNE[Adjust data / epochs / LR]
  VS -->|Mixed| HUMAN[Human review hard cases]
  VS -->|Better| JUDGE[Optional LLM judge + metrics]
  HUMAN --> DEC{Product ready?}
  JUDGE --> DEC
  DEC -->|No| TUNE
  DEC -->|Yes| SHIP[Version adapter + eval report]
  BUG --> START
  TUNE --> START`}
        />
      </LessonSection>

      <Callout variant="tip" title="Practical bar">
        For many internal tools, <strong className="text-white">win rate on 50 golden prompts + no catastrophic
        regressions</strong> beats a pretty training curve. Document the eval set next to the adapter commit.
      </Callout>

      <KeyTakeaways
        items={[
          'Held-out loss is necessary but not sufficient for shipping.',
          'Combine task metrics, careful LLM-as-judge, and human review.',
          'Always compare base vs fine-tuned on real user-style prompts.',
          'Watch for overfitting: rising eval loss, memorization, style collapse.',
        ]}
      />
    </LessonArticle>
  )
}
