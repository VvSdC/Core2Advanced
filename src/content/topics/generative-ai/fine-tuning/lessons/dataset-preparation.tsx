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

export function DatasetPreparation() {
  return (
    <LessonArticle>
      <Definition term="Fine-tuning dataset preparation">
        <p>
          <strong className="text-white">Dataset preparation</strong> is the process of turning raw documents,
          tickets, chats, or logs into a clean training set: collected, filtered, de-duplicated, split, and
          formatted so a fine-tune actually learns the behavior you want.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a gym coach does not dump a warehouse of unlabeled junk food into an athlete’s meal plan.
          Curated portions beat a dumpster of calories. For SFT especially,{' '}
          <span className="text-genai-400">quality beats quantity</span>.
        </p>
      </Definition>

      <Callout variant="beginner" title="Why this lesson matters">
        Bad data quietly ruins expensive GPU runs. Fixing five thousand messy examples beats buying another GPU.
      </Callout>

      <LessonSection title="From raw to curated — the pipeline">
        <Flowchart
          title="Raw data → curated SFT set"
          chart={`flowchart TB
  RAW[Raw sources — docs, tickets, chats, code] --> COLL[Collect & export]
  COLL --> CLEAN[Clean — PII, boilerplate, broken text]
  CLEAN --> DEDUP[De-duplicate near & exact copies]
  DEDUP --> FILT[Filter — length, language, toxicity, relevance]
  FILT --> FMT[Format — JSONL instruction / chat schema]
  FMT --> SPLIT[Train / validation split]
  SPLIT --> REVIEW[Spot-check + gold eval set]
  REVIEW --> TRAIN[Ready for SFT / PEFT]`}
        />
      </LessonSection>

      <LessonSection title="Collecting">
        <ContentStep number={1} title="Pick a narrow job first">
          <p className="text-slate-300">
            “Answer support tickets like our best agent” beats “be smart at everything.” Narrow jobs make collection
            and grading tractable.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Sources that map to targets">
          <p className="text-slate-300">
            Ideal SFT rows are prompt → high-quality response. Mines: expert-written FAQs, paired tickets+replies,
            carefully edited model drafts, synthetic data that humans verified.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Permissions and privacy">
          <p className="text-slate-300">
            Strip PII, respect licenses, and do not train on secrets. Contaminated private data is a product and
            legal risk, not just a quality issue.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Cleaning and de-duplicating">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Normalize text</strong> — encoding glitches, HTML artifacts, accidental
            truncation.
          </li>
          <li>
            <strong className="text-white">Remove boilerplate</strong> — email signatures, auto-replies, legal
            footers that teach the wrong pattern.
          </li>
          <li>
            <strong className="text-white">Exact de-dup</strong> — identical prompts or full rows waste steps and
            overfit.
          </li>
          <li>
            <strong className="text-white">Near de-dup</strong> — paraphrased clones can still dominate the loss;
            hash/n-gram tools help.
          </li>
        </ul>
        <Callout variant="tip" title="Train/val leakage">
          De-duplicate <em>before</em> splitting. If the same ticket sits in both train and val, your metrics lie.
        </Callout>
      </LessonSection>

      <LessonSection title="Train / validation split">
        <p className="text-slate-300">
          Hold out a <strong className="text-white">validation set</strong> (and ideally a tiny human-reviewed
          gold set) you never train on. Watch val loss/quality to stop over-training. For chat data, split by
          conversation or user when possible so a thread does not appear on both sides.
        </p>
        <Flowchart
          title="Split hygiene"
          chart={`flowchart LR
  ALL[Clean unique rows] --> TRAIN[Train 90–95%]
  ALL --> VAL[Val 5–10%]
  ALL --> GOLD[Optional gold eval — hand graded]
  TRAIN --> FIT[Fit model]
  VAL --> STOP[Early stop / pick checkpoint]
  GOLD --> SHIP[Go / no-go for ship]`}
        />
      </LessonSection>

      <LessonSection title="Quality over quantity for SFT">
        <p className="text-slate-300">
          Ten thousand noisy, contradictory demos teach the model that “anything goes.” A few thousand consistent,
          diverse, correct examples often win. Prefer:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>Correct answers with the style you want shipped.</li>
          <li>Coverage of edge cases and refusals you care about.</li>
          <li>Consistent formatting (JSON fields, markdown, tool-call syntax).</li>
        </ul>
        <Callout variant="insight" title="Rule of thumb">
          If you would not proudly show a row to a new teammate as “this is how we answer,” do not train on it.
        </Callout>
      </LessonSection>

      <LessonSection title="JSONL formats and Hugging Face datasets">
        <Example title="Instruction-style JSONL (one object per line)">{`{"instruction": "Summarize this error for a junior engineer.", "input": "NullPointerException at UserService.java:42", "output": "Something was null when UserService ran line 42. Check the object you call methods on."}
{"instruction": "Rewrite politely.", "input": "fix the form again.", "output": "Could you please submit the form again when you have a moment?"}`}</Example>
        <CodeBlock title="Chat-style messages (common for modern trainers)">{`{"messages": [
  {"role": "system", "content": "You are a concise support agent."},
  {"role": "user", "content": "Where is my order #183?"},
  {"role": "assistant", "content": "I found #183 — it's out for delivery today. ETA before 8pm."}
]}`}</CodeBlock>
        <p className="mt-4 text-slate-300">
          <strong className="text-white">Hugging Face Datasets</strong> (<code className="font-mono text-sm">datasets</code>{' '}
          library) loads JSON/JSONL/CSV/Parquet, maps transforms, and streams large files. Push private sets to the
          Hub only with proper access controls — treat training data like product source code.
        </p>
        <CodeBlock title="Load JSONL with datasets (sketch)">{`from datasets import load_dataset

ds = load_dataset("json", data_files={"train": "train.jsonl", "validation": "val.jsonl"})
# ds["train"][0] → dict with your fields
# map() to tokenize / convert to chat template later in the trainer`}</CodeBlock>
      </LessonSection>

      <LessonSection title="Common data bugs that ruin fine-tunes">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Bug</th>
                <th className="px-4 py-3">Symptom</th>
                <th className="px-4 py-3">Fix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Label noise / contradictions', 'Model oscillates or invents style', 'Human audit; drop conflicts'],
                ['Train/val leakage', 'Great val, bad production', 'De-dup then split by source'],
                ['Wrong chat template', 'Garbled roles at inference', 'Match train format to serve template'],
                ['Truncated targets', 'Abrupt endings learned as normal', 'Filter/fix max length carefully'],
                ['Prompt-only duplicates', 'Overfit one ask', 'De-dup prompts; diversify'],
                ['PII & secrets', 'Model regurgitates private data', 'Redact before train'],
                ['Unbalanced tasks', 'Ignores rare but critical cases', 'Upsample / explicit coverage'],
              ].map(([bug, symptom, fix]) => (
                <tr key={bug} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{bug}</td>
                  <td className="px-4 py-3 text-slate-400">{symptom}</td>
                  <td className="px-4 py-3 text-genai-400">{fix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Before you hit Train">
          Read 50 random rows. If those 50 look wrong, scaling to 50,000 will not save you.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Prepare data as a pipeline: collect → clean → de-dup → format → split → spot-check.',
          'For SFT, quality and consistency beat raw row count.',
          'Hold out validation (and a gold set); de-duplicate before splitting to avoid leakage.',
          'JSONL instruction or chat schemas are the usual SFT formats; Hugging Face datasets help load them.',
          'Common killers: noisy labels, leakage, template mismatch, truncation, PII, and imbalance.',
        ]}
      />
    </LessonArticle>
  )
}
