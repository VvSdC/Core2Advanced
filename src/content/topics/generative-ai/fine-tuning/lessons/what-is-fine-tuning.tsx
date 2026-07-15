import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function WhatIsFineTuning() {
  return (
    <LessonArticle>
      <Definition term="Fine-tuning">
        <p>
          <strong className="text-white">Fine-tuning</strong> means taking a{' '}
          <strong className="text-white">pretrained</strong> model — one that already learned language, code, or
          other patterns from a huge internet-scale dataset — and <em>training it further</em> on{' '}
          <strong className="text-genai-400">your</strong> examples so it behaves more like you want: your tone,
          your JSON format, your domain jargon, your preferred answer style.
        </p>
      </Definition>

      <LessonSection title="The school → doctor analogy">
        <p className="text-slate-300">
          Think of a large language model the way you think about a person&apos;s education:
        </p>
        <div className="mt-4 space-y-3">
          {[
            [
              'Pretraining (general education)',
              'Years of reading everything — books, web pages, code. The model learns grammar, facts, reasoning patterns, and “how language works.” It is broadly capable but not specialized.',
            ],
            [
              'Fine-tuning (medical school)',
              'Focused practice on a narrower curriculum: patient notes, clinic dialogues, your company docs. Same brain architecture — new habits and terminology layered on top.',
            ],
            [
              'Inference (seeing patients)',
              'You stop updating the weights and just ask questions. The model uses what it already learned to generate answers.',
            ],
          ].map(([label, text]) => (
            <div key={label} className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
              <p className="text-sm font-semibold text-white">{label}</p>
              <p className="mt-1 text-sm text-slate-400">{text}</p>
            </div>
          ))}
        </div>
        <Callout variant="beginner" title="One sentence version">
          Pretraining gives the model a general brain; fine-tuning teaches that brain your specialty without building
          a new brain from scratch.
        </Callout>
      </LessonSection>

      <LessonSection title="What changes — and what stays the same">
        <ContentStep number={1} title="Weights change">
          <p className="text-slate-300">
            <strong className="text-white">Weights</strong> (also called parameters) are the millions or billions of
            numbers inside the model that encode what it has learned. During fine-tuning, an optimizer nudges those
            numbers so the model is more likely to produce your preferred outputs.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Architecture stays">
          <p className="text-slate-300">
            The <strong className="text-white">architecture</strong> — number of layers, attention design, tokenizer
            vocabulary size — usually stays fixed. You are not inventing a new model family; you are adapting one
            that already exists (e.g. Llama, Mistral, GPT).
          </p>
        </ContentStep>
        <ContentStep number={3} title="Capabilities get reshaped">
          <p className="text-slate-300">
            Fine-tuning can teach <span className="text-genai-400">style, format, and domain language</span>. It is a
            weaker tool for facts that change every day — that is often better handled by{' '}
            <strong className="text-white">RAG</strong> (retrieval-augmented generation), covered in a later lesson
            in this track.
          </p>
        </ContentStep>
        <Flowchart
          title="Pretrain → fine-tune → use"
          chart={`flowchart LR
  A[Pretrained model<br/>general weights] --> B[Your dataset<br/>examples]
  B --> C[Fine-tuning<br/>update weights]
  C --> D[Specialized model<br/>same architecture]`}
        />
      </LessonSection>

      <LessonSection title="Learning path for this Fine-Tuning track">
        <p className="text-slate-300">
          This topic moves from concepts to practice. You do not need to memorize papers — you need a clear story of
          when fine-tuning helps, how training works, and how to format data correctly before LoRA and beyond.
        </p>
        <Flowchart
          title="Fine-Tuning track map"
          chart={`flowchart TB
  A[1. What is fine-tuning] --> B[2. Pretraining vs FT vs RAG]
  B --> C[3. When to fine-tune]
  C --> D[4. How models learn]
  D --> E[5. Supervised fine-tuning SFT]
  E --> F[6. Instruction tuning]
  F --> G[7. Chat templates and roles]
  G --> H[Later: LoRA / PEFT / training runs]`}
        />
      </LessonSection>

      <Callout variant="beginner" title="Prerequisites">
        Comfortable with prompting an LLM and the idea that models predict the next token. Prior RAG lessons help
        for comparison, but are not required for this first lesson. No linear algebra needed yet — we explain
        training step-by-step with analogies before any math.
      </Callout>

      <KeyTakeaways
        items={[
          'Fine-tuning = further training a pretrained model on your data so behavior shifts toward your needs.',
          'Analogy: general education (pretrain) → specialize as a doctor (fine-tune) → see patients (inference).',
          'Weights update; architecture usually stays the same.',
          'This track builds: concepts → decision-making → training mechanics → SFT → instructions → chat templates.',
        ]}
      />
    </LessonArticle>
  )
}
