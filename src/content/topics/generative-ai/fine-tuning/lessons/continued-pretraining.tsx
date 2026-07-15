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

export function ContinuedPretraining() {
  return (
    <LessonArticle>
      <Definition term="Continued pretraining (CPT)">
        <p>
          <strong className="text-white">Continued pretraining</strong> (also called{' '}
          <strong className="text-white">domain adaptation</strong>) keeps training a pretrained language model
          with the same objective it saw originally — <span className="text-genai-400">next-token prediction</span>{' '}
          — but on a new corpus from your domain: legal filings, medical papers, company code, internal wikis.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a general doctor who already knows medicine spends months reading only cardiology journals.
          They still “read and predict the next sentence,” but the vocabulary and patterns become heart-health
          native. No one handed them a quiz with labels — the textbooks themselves were the training signal.
        </p>
      </Definition>

      <Callout variant="beginner" title="CPT vs SFT in one line">
        CPT = “absorb this domain’s language.” SFT = “learn to follow instructions and answer like this.” CPT
        usually has no instruction/response labels — just long documents.
      </Callout>

      <LessonSection title="What problem CPT solves">
        <p className="text-slate-300">
          A base model knows the open internet well, but your world may look different: dense statutes, ICD codes,
          proprietary APIs, or a rare programming dialect. Prompting alone often hits a ceiling when the model
          barely saw that distribution during original pretraining.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Legal docs</strong> — case law style, citations, defined terms.
          </li>
          <li>
            <strong className="text-white">Medical papers</strong> — dense abstracts, trial jargon, abbreviations.
          </li>
          <li>
            <strong className="text-white">Company codebases</strong> — internal libraries, naming, architecture
            comments.
          </li>
        </ul>
        <Flowchart
          title="Why domain text matters"
          chart={`flowchart LR
  WEB[General web pretraining] --> BASE[Base LLM]
  BASE --> GAP{Domain gap?}
  GAP -->|Rare jargon / style| CPT[Continued pretraining on domain corpus]
  GAP -->|Already fluent| SFT2[Skip CPT → go to SFT]
  CPT --> ADAPT[Domain-adapted model]
  ADAPT --> SFT[Then SFT / chat training]`}
        />
      </LessonSection>

      <LessonSection title="How CPT differs from supervised fine-tuning">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Aspect</th>
                <th className="px-4 py-3">Continued pretraining</th>
                <th className="px-4 py-3">SFT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Objective', 'Next-token on raw / lightly cleaned text', 'Predict the assistant reply given a prompt'],
                ['Labels', 'None (document is the signal)', 'Instruction → desired response pairs'],
                ['Goal', 'Domain fluency & knowledge density', 'Behavior, format, helpfulness'],
                ['Data shape', 'Long documents, code files, papers', 'Short-to-medium Q&A / chat turns'],
                ['Typical stage', 'Before instruction/chat tuning', 'After base (or after CPT)'],
              ].map(([aspect, cpt, sft]) => (
                <tr key={aspect} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{aspect}</td>
                  <td className="px-4 py-3 text-genai-400">{cpt}</td>
                  <td className="px-4 py-3 text-slate-400">{sft}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Example title="CPT data is not an instruction pair">{`# CPT sample — just domain text (next-token learning)
WHEREAS the Lessee shall maintain the Premises in good repair...
Section 4.2 Indemnification. The Lessee agrees to indemnify...

# Not CPT — this is SFT (needs labels)
{"instruction": "Summarize clause 4.2", "output": "Lessee must indemnify..."}`}</Example>
      </LessonSection>

      <LessonSection title="When to do CPT, then SFT">
        <ContentStep number={1} title="Detect a real domain gap">
          <p className="text-slate-300">
            If a strong base or chat model already handles your jargon with RAG or careful prompts, CPT may be
            unnecessary cost. Use CPT when fluency and recall of domain patterns are chronically weak.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Continue pretraining on curated domain corpus">
          <p className="text-slate-300">
            Clean PDFs/code to plain text, remove junk, optionally pack documents into packing-friendly lengths.
            Train with a modest learning rate so you adapt without shredding general ability overnight.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Run SFT (or chat tuning) on the adapted checkpoint">
          <p className="text-slate-300">
            CPT teaches the dialect; SFT teaches the job. After CPT, fine-tune on instruction or chat data so the
            model answers questions, follows tools, and stays helpful — now with better domain priors.
          </p>
        </ContentStep>
        <Flowchart
          title="Recommended pipeline when domain gap is large"
          chart={`flowchart TB
  B[Base / pretrained LLM] --> C{Large domain gap?}
  C -->|Yes| CPT[Continued pretraining]
  C -->|No| SFT[Supervised fine-tuning]
  CPT --> SFT
  SFT --> PREF[Optional preference tuning]
  PREF --> PROD[Deploy / evaluate]`}
        />
        <CodeBlock title="Mental model of the stages">{`stage_1_cpt   = "next_token(domain_docs)"      # speak the dialect
stage_2_sft   = "imitate(instruction → answer)" # do the job
stage_3_pref  = "prefer(chosen > rejected)"     # align taste / safety`}</CodeBlock>
      </LessonSection>

      <LessonSection title="Risks — forgetting general ability">
        <p className="text-slate-300">
          Aggressive CPT can cause <strong className="text-white">catastrophic forgetting</strong>: the model
          becomes great at contracts but worse at everyday English, math, or coding it used to handle. Think of a
          specialist who stops talking to patients outside one clinic and slowly loses bedside manner.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Mix in general data</strong> — replay a fraction of diverse web/code
            samples during CPT.
          </li>
          <li>
            <strong className="text-white">Lower LR & fewer epochs</strong> — domain soak, not a full re-pretrain.
          </li>
          <li>
            <strong className="text-white">Evaluate both worlds</strong> — domain benchmarks <em>and</em> general
            capability suites before declaring victory.
          </li>
          <li>
            <span className="text-genai-400">PEFT/adapters</span> for CPT can reduce forgetting vs updating every
            weight — covered in the full-vs-PEFT lesson.
          </li>
        </ul>
        <Callout variant="tip" title="Practical rule">
          If your goal is a helpful assistant, almost never stop at CPT alone — follow with SFT. CPT without SFT
          often yields a fluent document-continuer, not a cooperative chat partner.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Continued pretraining adapts a model to a domain via next-token prediction on unlabeled domain text.',
          'Unlike SFT, CPT does not need instruction/response labels — raw documents are the dataset.',
          'Common domains: legal, medical, proprietary codebases and internal knowledge.',
          'Typical order when needed: CPT → SFT → optional preference alignment.',
          'Main risk is forgetting general ability — mix data, moderate training, and dual evaluation.',
        ]}
      />
    </LessonArticle>
  )
}
