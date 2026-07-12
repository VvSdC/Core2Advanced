import {
  Callout,
  ContentStep,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2302.13971'

export function LlamaOpenEfficientModels() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="LLaMA: Open and Efficient Foundation Language Models"
        authors="Touvron et al. (Meta)"
        year="2023"
        url={PAPER_URL}
      >
        Proved a <strong className="text-white">13B model trained properly can match GPT-3 (175B)</strong> — and
        released the weights publicly, sparking the open-source AI movement.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Chinchilla showed that training data matters as much as parameters. LLaMA put that lesson into practice
        and made the results available to everyone. Read this after <em>Chinchilla</em>, <em>SLMs</em>, and{' '}
        <em>LLMs</em>.
      </Callout>

      <LessonSection title="Background — closed models and wasted scale">
        <p>
          By early 2023, the best models (GPT-3, PaLM, Chinchilla) were available only through paid APIs — you
          could use them but not inspect, modify, or run them yourself. Meanwhile, most models were still
          under-trained per Chinchilla's findings.
        </p>
        <p className="mt-3">
          Meta's goal: build <strong className="text-white">state-of-the-art models following Chinchilla scaling
          laws</strong>, then release the weights publicly so researchers and developers worldwide could build on them.
        </p>
      </LessonSection>

      <LessonSection title="What the paper built">
        <ContentStep number={1} title="Model family — four sizes">
          <div className="overflow-x-auto rounded-xl border border-surface-600">
            <table className="w-full text-sm text-slate-300">
              <thead>
                <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3">Model</th>
                  <th className="px-4 py-3">Params</th>
                  <th className="px-4 py-3">Training tokens</th>
                  <th className="px-4 py-3">Tokens / param</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-600">
                {[
                  ['LLaMA-7B', '6.7B', '1T', '~150'],
                  ['LLaMA-13B', '13.0B', '1T', '~77'],
                  ['LLaMA-33B', '32.5B', '1.4T', '~43'],
                  ['LLaMA-65B', '65.2B', '1.4T', '~21'],
                ].map(([model, params, tokens, ratio]) => (
                  <tr key={model} className="hover:bg-surface-800/50">
                    <td className="px-4 py-3 font-semibold text-white">{model}</td>
                    <td className="px-4 py-3 font-mono">{params}</td>
                    <td className="px-4 py-3 font-mono">{tokens}</td>
                    <td className="px-4 py-3 font-mono text-genai-400">{ratio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3">
            All variants exceed Chinchilla's ~20 tokens/param recommendation. LLaMA-65B is nearly optimal;
            LLaMA-7B is massively over-trained on tokens (good for a small model).
          </p>
        </ContentStep>

        <ContentStep number={2} title="Architecture improvements">
          <ul className="list-disc space-y-2 pl-5 text-slate-300">
            <li><strong className="text-white">Pre-normalisation</strong> — LayerNorm before attention (more stable training than the original Transformer).</li>
            <li><strong className="text-white">SwiGLU activation</strong> — replaces ReLU in feed-forward layers (better quality per parameter).</li>
            <li><strong className="text-white">Rotary embeddings (RoPE)</strong> — replaces fixed positional encodings (better handling of long sequences).</li>
            <li><strong className="text-white">No bias terms</strong> — removes bias from linear layers (simpler, no quality loss).</li>
          </ul>
          <Callout variant="beginner">
            You do not need to memorise these — they are engineering improvements on top of the Transformer from
            the Attention paper. Together they squeeze more quality from each parameter.
          </Callout>
        </ContentStep>

        <ContentStep number={3} title="Training data">
          <p>1–1.4 trillion tokens from publicly available sources only:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
            <li><strong className="text-white">CCNet</strong> — filtered Common Crawl web pages</li>
            <li><strong className="text-white">C4</strong> — cleaned web text (Colossal Clean Crawled Corpus)</li>
            <li><strong className="text-white">GitHub</strong> — source code (for coding ability)</li>
            <li><strong className="text-white">Wikipedia</strong> — encyclopaedic knowledge (20 languages)</li>
            <li><strong className="text-white">Books</strong> — Gutenberg and other book corpora</li>
            <li><strong className="text-white">ArXiv / Stack Exchange</strong> — scientific papers and Q&A</li>
          </ul>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Key results">
        <ContentStep number={1} title="LLaMA-13B matched GPT-3 (175B) on most benchmarks">
          <p>
            Despite being <strong className="text-white">13× smaller</strong>, LLaMA-13B outperformed GPT-3 on
            most NLP benchmarks at the time — because it was trained on 3× more tokens with a better
            architecture. Direct proof that parameter count alone does not determine quality.
          </p>
        </ContentStep>

        <ContentStep number={2} title="LLaMA-65B was state-of-the-art among open models">
          <p>
            Competitive with PaLM and Chinchilla on benchmarks like HellaSwag, WinoGrande, ARC, and PIQA —
            while being fully open for research and commercial use (under a licence).
          </p>
        </ContentStep>

        <ContentStep number={3} title="Open weights changed the ecosystem">
          <p>Releasing weights (not just an API) enabled an entire ecosystem:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
            <li><strong className="text-white">Fine-tuning</strong> — Alpaca, Vicuna, and thousands of domain-specific models</li>
            <li><strong className="text-white">Quantisation</strong> — running 7B models on laptops and phones (GGUF, llama.cpp)</li>
            <li><strong className="text-white">Distillation</strong> — compressing knowledge into even smaller models</li>
            <li><strong className="text-white">On-device AI</strong> — the SLM revolution you read about in Fundamentals</li>
          </ul>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Does more parameters mean much better?">
        <Callout variant="insight">
          <strong className="text-white">Not if the smaller model is properly trained.</strong> LLaMA-13B beat
          GPT-3 (175B) because it had ~77 tokens per parameter vs GPT-3's ~1.7. Chinchilla's lesson in action:
          capacity must be filled with data to matter.
        </Callout>
      </LessonSection>

      <LessonSection title="Limitations">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">No instruction tuning</strong> — raw pre-trained model, not a chatbot out of the box (fine-tuning required for dialogue).</li>
          <li><strong className="text-white">No safety alignment</strong> — no RLHF or content filtering; can produce harmful outputs without guardrails.</li>
          <li><strong className="text-white">English-centric</strong> — multilingual but English dominates training data.</li>
          <li><strong className="text-white">Knowledge cutoff</strong> — training data ends at a fixed date; no real-time information.</li>
          <li><strong className="text-white">Licence restrictions</strong> — LLaMA weights were initially gated; later Llama 2/3 improved access.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Connection to Fundamentals">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Fundamentals lesson</th>
                <th className="px-4 py-3">How this paper connects</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Chinchilla Scaling Laws', 'First major model family built to Chinchilla-optimal token counts'],
                ['Small Language Models', 'LLaMA-7B/13B are the ancestors of every modern SLM (Mistral, Phi, Gemma)'],
                ['Large Language Models', 'LLaMA-65B showed open models can compete with closed LLMs'],
                ['What Are Model Parameters?', '13B beating 175B is the clearest proof that param count ≠ quality'],
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
          'LLaMA-13B matched GPT-3 (175B) by training on more tokens with a better architecture.',
          'Four sizes (7B–65B), all trained well beyond Chinchilla-optimal token counts.',
          'Open weights enabled fine-tuning, quantisation, and the entire on-device AI ecosystem.',
          'More parameters alone does not mean better — training quality and data volume matter more.',
        ]}
      />
    </LessonArticle>
  )
}
