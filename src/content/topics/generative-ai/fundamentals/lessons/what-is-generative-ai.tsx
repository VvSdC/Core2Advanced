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

export function WhatIsGenerativeAI() {
  return (
    <LessonArticle>
      <Definition term="Generative AI">
        <p>
          <strong className="text-white">Generative AI</strong> is any system that can <em>create</em> new content —
          text, images, audio, video, or code — that did not exist before, by learning the patterns inside huge
          amounts of example data.
        </p>
        <p>
          The key word is <strong className="text-white">generate</strong>. Instead of only labelling or sorting
          things that already exist, a generative model produces something original: a paragraph, a picture, a melody,
          a working function.
        </p>
      </Definition>

      <Callout variant="beginner">
        You do not need any machine-learning background for this track. If you understand that a computer stores
        numbers and does arithmetic on them, you already have everything you need. We will build every other idea from
        scratch, one lesson at a time.
      </Callout>

      <LessonSection title="Two families of AI: discriminative vs generative">
        <p>
          For decades, most AI was <strong className="text-white">discriminative</strong> — it drew boundaries between
          things. "Is this email spam or not?" "Is this photo a cat or a dog?" The model looks at an input and picks a
          label. It never has to invent anything.
        </p>
        <p>
          <strong className="text-white">Generative</strong> AI flips the question around. Instead of "which label
          fits this input?", it asks "what is a plausible <em>next</em> piece of content given everything so far?" That
          single shift — from choosing a label to producing content — is what makes ChatGPT, Midjourney, and GitHub
          Copilot possible.
        </p>

        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Question it answers</th>
                <th className="px-4 py-3">Discriminative</th>
                <th className="px-4 py-3">Generative</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Core task', 'Classify / predict a label', 'Produce new content'],
                ['Example', 'Spam vs not-spam', 'Write the reply email'],
                ['Output', 'A category or number', 'Text, image, audio, code'],
                ['Everyday tool', 'Fraud detection', 'ChatGPT, Copilot, Midjourney'],
              ].map(([row, disc, gen]) => (
                <tr key={row} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{row}</td>
                  <td className="px-4 py-3 text-slate-400">{disc}</td>
                  <td className="px-4 py-3 text-slate-400">{gen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Callout variant="insight">
          A generative model still uses probabilities under the hood — but instead of "70% spam", it produces "given
          this sentence, the most likely next word is <em>mat</em>". Chain thousands of those tiny predictions together
          and you get a full essay.
        </Callout>
      </LessonSection>

      <LessonSection title="What can it generate?">
        <p>
          The same core idea — learn patterns, then predict the next piece — powers many different <em>modalities</em>{' '}
          (types of content):
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Modality</th>
                <th className="px-4 py-3">What it makes</th>
                <th className="px-4 py-3">Well-known example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Text', 'Answers, summaries, essays, chat', 'ChatGPT, Claude, Gemini'],
                ['Code', 'Functions, tests, whole files', 'GitHub Copilot, Cursor'],
                ['Images', 'Pictures from a description', 'Midjourney, DALL·E, Stable Diffusion'],
                ['Audio', 'Speech, music, sound effects', 'ElevenLabs, Suno'],
                ['Video', 'Short clips from a prompt', 'Sora, Runway'],
              ].map(([mod, makes, ex]) => (
                <tr key={mod} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{mod}</td>
                  <td className="px-4 py-3 text-slate-400">{makes}</td>
                  <td className="px-4 py-3 text-slate-400">{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="info">
          This whole track focuses mostly on <strong className="text-white">text and code</strong> models — the{' '}
          <strong className="text-white">Large Language Models (LLMs)</strong> behind chat assistants and coding tools —
          because they are the foundation everything else (agents, RAG, tools) is built on.
        </Callout>
      </LessonSection>

      <LessonSection title="A mental model: prediction as a superpower">
        <p>
          Here is the surprising part. A modern LLM was trained to do one boring-sounding thing:{' '}
          <strong className="text-white">predict the next word</strong>. That's it. But to predict the next word well
          across the entire internet, it is <em>forced</em> to learn grammar, facts, reasoning shortcuts, coding
          syntax, and writing style — because all of those help it guess better.
        </p>

        <ContentStep number={1} title="A tiny example of 'prediction = understanding'">
          <p>To correctly finish this sentence, the model must "understand" a lot:</p>
          <Example
            title="Why next-word prediction forces learning"
            output={`Prompt:  "The capital of France is"
Model:   " Paris"    ← needs world knowledge

Prompt:  "def add(a, b):\\n    return"
Model:   " a + b"    ← needs to understand code

Prompt:  "2 + 2 ="
Model:   " 4"        ← needs basic arithmetic`}
          >{`# The model only ever predicts "what comes next",
# but doing that well requires real capabilities.
prompts = [
    "The capital of France is",   # world knowledge
    "def add(a, b):\\n    return", # code understanding
    "2 + 2 =",                     # arithmetic
]
# Each correct continuation is evidence the model
# learned a pattern, not just memorised text.`}</Example>
        </ContentStep>

        <Flowchart
          title="The generative loop, at a glance"
          chart={`flowchart TB
  A([You type a prompt]) --> B[Model reads it as tokens]
  B --> C[Predict the most likely next token]
  C --> D[Add that token to the text]
  D --> E{Finished?}
  E -- no --> C
  E -- yes --> F([Full response])`}
        />
        <Callout variant="insight">
          Every capability you will read about later — chatting, calling tools, using an agent, searching your
          documents with RAG — is layered <em>on top of</em> this one loop. Understand the loop and the rest becomes
          much easier.
        </Callout>
      </LessonSection>

      <LessonSection title="Why now? Why did this suddenly work?">
        <p>Generative models are old ideas, but three things came together around 2017–2023:</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">A new architecture (the Transformer, 2017)</strong> that could read huge
            amounts of text in parallel and learn long-range patterns. We dedicate two full lessons to it.
          </li>
          <li>
            <strong className="text-white">Scale</strong> — much bigger models trained on much more data (the internet)
            with much more compute (GPUs).
          </li>
          <li>
            <strong className="text-white">Alignment</strong> — techniques (instruction tuning, RLHF) that turned a raw
            "text predictor" into a helpful, safe assistant that follows instructions.
          </li>
        </ul>
        <Callout variant="tip">
          Keep these three levers in mind — <em>architecture</em>, <em>scale</em>, and <em>alignment</em>. Almost every
          later topic in this track is really about improving one of them.
        </Callout>
      </LessonSection>

      <LessonSection title="What this Foundations track will give you">
        <p>By the end of the Foundations lessons you will be able to explain, in plain language:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
          <li>What a token is and why models see text as tokens, not letters.</li>
          <li>How next-token prediction turns into full answers.</li>
          <li>What a neural network and the Transformer actually do inside.</li>
          <li>What "attention" means and why it was the breakthrough.</li>
          <li>What parameters, embeddings, training, and context windows are.</li>
        </ul>
        <p className="mt-3">
          That base is enough to make real decisions later — like whether a use case needs RAG, an agent, fine-tuning,
          or just a good prompt.
        </p>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Generative AI creates new content (text, code, images, audio, video) instead of just labelling existing data.',
          'Discriminative AI picks a label; generative AI predicts the next piece of content.',
          'Modern LLMs are trained on one task — predict the next token — which forces them to learn grammar, facts, and reasoning.',
          'Everything advanced (agents, tools, RAG) is built on top of this simple prediction loop.',
          'Three levers made it work: the Transformer architecture, scale (data + compute), and alignment.',
        ]}
      />
    </LessonArticle>
  )
}
