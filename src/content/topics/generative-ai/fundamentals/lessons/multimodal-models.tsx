import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function MultimodalModels() {
  return (
    <LessonArticle>
      <Definition term="Multimodal Model">
        <p>
          A <strong className="text-white">multimodal model</strong> can process and generate more than one type
          of data — typically combining <strong className="text-white">text</strong> with{' '}
          <strong className="text-white">images</strong>, <strong className="text-white">audio</strong>, or{' '}
          <strong className="text-white">video</strong> in a single system. Instead of separate models for each
          modality, one unified model understands relationships across them.
        </p>
      </Definition>

      <LessonSection title="Modalities and what they mean">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Modality</th>
                <th className="px-4 py-3">Input example</th>
                <th className="px-4 py-3">Output example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Text only (LLM)', '"Summarise this article"', 'A paragraph of text'],
                ['Text + Image', 'Photo of a receipt + "What is the total?"', '"The total is $47.50"'],
                ['Text + Audio', 'Voice recording + "Transcribe and translate"', 'Text in target language'],
                ['Text + Video', 'Clip + "What is the person doing?"', '"They are assembling a chair"'],
                ['Text → Image', '"A watercolor of a fox in autumn"', 'Generated image'],
              ].map(([modality, input, output]) => (
                <tr key={modality} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{modality}</td>
                  <td className="px-4 py-3 text-slate-400">{input}</td>
                  <td className="px-4 py-3 text-slate-400">{output}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="How multimodal models work">
        <ContentStep number={1} title="Everything becomes tokens">
          <p>
            Just like text is split into tokens, images and audio are converted into sequences of tokens the model
            can process:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
            <li><strong className="text-white">Images</strong> → split into patches (e.g. 16×16 pixel squares), each patch encoded as a vector/token.</li>
            <li><strong className="text-white">Audio</strong> → converted to spectrograms or raw waveform chunks, then tokenised.</li>
            <li><strong className="text-white">Text</strong> → standard subword tokenisation.</li>
          </ul>
          <Callout variant="beginner">
            Once everything is tokens, the same transformer architecture that predicts the next text token can
            predict the next patch token or audio token — the core mechanism is identical.
          </Callout>
        </ContentStep>

        <ContentStep number={2} title="Architecture overview">
          <Flowchart
            title="Multimodal processing pipeline"
            chart={`flowchart TB
  A[Text input] --> D[Token sequence]
  B[Image input] --> E[Vision encoder → image tokens]
  C[Audio input] --> F[Audio encoder → audio tokens]
  D --> G[Unified transformer]
  E --> G
  F --> G
  G --> H{Output type}
  H -- Text --> I[Text response]
  H -- Image --> J[Image generator]
  H -- Audio --> K[Speech synthesiser]`}
          />
          <p className="mt-3">
            A <strong className="text-white">vision encoder</strong> (often a pre-trained model like CLIP or SigLIP)
            converts images into embeddings. These are projected into the same vector space as text tokens so the
            transformer can attend across all modalities.
          </p>
        </ContentStep>

        <ContentStep number={3} title="Cross-modal understanding">
          <p>Because all modalities share one model, it can reason across them:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
            <li>Look at a chart image and explain the trend in text.</li>
            <li>Read a diagram and generate working code from it.</li>
            <li>Listen to a question and respond with both speech and a generated image.</li>
          </ul>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Notable multimodal models">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3">Modalities</th>
                <th className="px-4 py-3">Highlight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['GPT-4o', 'Text, image, audio', 'Real-time voice conversation'],
                ['Gemini 1.5 Pro', 'Text, image, audio, video', '1M token context, native video'],
                ['Claude 3.5 Sonnet', 'Text, image', 'Strong document and chart analysis'],
                ['LLaVA', 'Text, image', 'Open-source vision-language model'],
                ['DALL·E 3 / Stable Diffusion', 'Text → image', 'Text-to-image generation'],
                ['Whisper', 'Audio → text', 'Robust speech recognition'],
              ].map(([model, modalities, highlight]) => (
                <tr key={model} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{model}</td>
                  <td className="px-4 py-3 font-mono text-xs">{modalities}</td>
                  <td className="px-4 py-3 text-slate-400">{highlight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Text-only vs multimodal">
        <Callout variant="insight">
          A plain LLM only sees text. If you paste "What is in this image?" without the image itself, it cannot
          help. A multimodal model receives the actual pixels alongside your question — that is the fundamental
          difference.
        </Callout>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">LLM</strong> — text in, text out. Fast, cheap, great for language tasks.</li>
          <li><strong className="text-white">Multimodal</strong> — text + images/audio/video in, text or media out. Richer understanding, higher compute.</li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Multimodal models handle text, images, audio, and video in one unified system.',
          'All modalities are converted to tokens and processed by the same transformer.',
          'Vision/audio encoders project non-text data into the model vector space.',
          'Examples: GPT-4o, Gemini 1.5, Claude 3.5, LLaVA, DALL·E, Whisper.',
        ]}
      />
    </LessonArticle>
  )
}
