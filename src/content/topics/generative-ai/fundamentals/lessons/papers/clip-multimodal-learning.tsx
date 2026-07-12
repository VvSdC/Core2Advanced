import {
  Callout,
  ContentStep,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2103.00020'

export function ClipMultimodalLearning() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="Learning Transferable Visual Models From Natural Language Supervision"
        authors="Radford et al. (OpenAI)"
        year="2021"
        venue="CLIP"
        url={PAPER_URL}
      >
        Taught models to understand <strong className="text-white">images and text in the same space</strong> —
        the foundation under GPT-4V, LLaVA, and every vision-language model.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        In <em>Multimodal Models</em> you learned that images and text are converted to tokens in one model.
        CLIP is the paper that first made that possible at scale — by training on 400 million image-text pairs
        from the internet.
      </Callout>

      <LessonSection title="Background — the labelling bottleneck">
        <p>
          Before CLIP, image models needed <strong className="text-white">hand-labelled datasets</strong> —
          humans tag each image with categories ("cat", "dog", "car"). This is expensive, limited to fixed
          categories, and does not scale to the diversity of real-world images.
        </p>
        <p className="mt-3">
          CLIP asked: <em>the internet already has billions of images with captions — can we learn vision from
          that text supervision alone?</em>
        </p>
      </LessonSection>

      <LessonSection title="How CLIP works">
        <ContentStep number={1} title="Two encoders, one shared space">
          <Flowchart
            title="CLIP architecture"
            chart={`flowchart TB
  A[Image] --> B[Image Encoder — ViT or ResNet]
  C[Text: "a dog on a beach"] --> D[Text Encoder — Transformer]
  B --> E[Image embedding vector]
  D --> F[Text embedding vector]
  E --> G{Cosine similarity}
  F --> G
  G --> H[High if image matches caption, low if mismatched]`}
          />
          <p className="mt-3">
            An <strong className="text-white">image encoder</strong> and a <strong className="text-white">text
            encoder</strong> each produce a vector (embedding). Matching image-caption pairs should have similar
            vectors; mismatched pairs should be far apart. Training uses contrastive learning across millions of
            pairs.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Training on 400M image-text pairs">
          <p>
            Collected 400 million (image, caption) pairs from the internet. For each batch of N pairs, the model
            learns to maximise similarity for the N correct pairs and minimise it for the N²−N incorrect
            combinations. No manual category labels needed.
          </p>
        </ContentStep>

        <ContentStep number={3} title="Zero-shot classification">
          <p>
            To classify a new image, CLIP compares it against text descriptions of each candidate class:
          </p>
          <Callout variant="beginner">
            Image of a dog → compare against embeddings of "a photo of a cat", "a photo of a dog", "a photo of
            a car" → highest similarity wins. No task-specific training required.
          </Callout>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Key results">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Matched or beat supervised models on 30+ image classification benchmarks — without any labelled training data for those tasks.</li>
          <li>Transfers to tasks it was never trained on: OCR, action recognition, geo-localisation.</li>
          <li>Scales predictably — larger models and more data consistently improve performance.</li>
          <li>The learned image and text encoders became building blocks for every subsequent multimodal system.</li>
        </ul>
      </LessonSection>

      <LessonSection title="How CLIP connects to modern multimodal LLMs">
        <p>
          CLIP does not generate text about images — it only scores similarity. But its image encoder is reused
          inside larger systems:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">GPT-4V / Claude</strong> — vision encoders (often CLIP-derived) convert images to tokens fed into the language model.</li>
          <li><strong className="text-white">LLaVA</strong> — connects CLIP's vision encoder to a Llama language model with a projection layer.</li>
          <li><strong className="text-white">DALL·E / Stable Diffusion</strong> — CLIP's text encoder guides image generation toward prompts.</li>
        </ul>
        <Callout variant="insight">
          CLIP solved the "how does the model see?" problem. Later papers solved "how does the model talk about
          what it sees?" — but they all build on CLIP's shared embedding space.
        </Callout>
      </LessonSection>

      <LessonSection title="Limitations">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">No generation</strong> — CLIP classifies and scores; it cannot describe an image in a full sentence.</li>
          <li><strong className="text-white">Struggles with fine-grained details</strong> — counting objects, reading small text, precise spatial reasoning.</li>
          <li><strong className="text-white">Biased by web data</strong> — reflects stereotypes and gaps in internet image-text pairs.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Connection to Fundamentals">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Fundamentals lesson</th>
                <th className="px-4 py-3">How this paper connects</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Multimodal Models', 'The foundational paper for image+text understanding at scale'],
                ['Attention Is All You Need', 'CLIP text encoder is a Transformer; image encoder uses attention too'],
                ['Large Language Models', 'Vision encoders from CLIP are plugged into LLMs to make them multimodal'],
                ['What Are Model Parameters?', 'CLIP ViT-L/14 has 428M params — shows multimodal adds significant capacity'],
              ].map(([lesson, connection]) => (
                <tr key={lesson} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{lesson}</td>
                  <td className="px-4 py-3 text-slate-400">{connection}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'CLIP learns image and text encoders in a shared embedding space — no manual labels.',
          'Trained on 400M internet image-caption pairs using contrastive learning.',
          'Zero-shot classification: compare image against text descriptions of each class.',
          'Foundation for GPT-4V, LLaVA, DALL·E — every modern vision-language system builds on CLIP.',
        ]}
      />
    </LessonArticle>
  )
}
