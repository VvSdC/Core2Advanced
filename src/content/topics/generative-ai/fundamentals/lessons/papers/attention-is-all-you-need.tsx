import {
  Callout,
  ContentStep,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/1706.03762'

export function AttentionIsAllYouNeed() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="Attention Is All You Need"
        authors="Vaswani et al. (Google)"
        year="2017"
        venue="NeurIPS"
        url={PAPER_URL}
      >
        Introduced the <strong className="text-white">Transformer</strong> — the architecture behind GPT, Llama,
        Claude, Gemini, and every model in the Fundamentals section.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        You have already learned that language models predict the next token using billions of parameters. This
        paper explains <em>what those parameters are arranged into</em> — the blueprint every modern LLM inherits.
      </Callout>

      <LessonSection title="Background — what came before">
        <p>
          In 2017, the best language and translation systems used <strong className="text-white">RNNs</strong> and{' '}
          <strong className="text-white">LSTMs</strong>. These read text one token at a time, left to right,
          carrying a hidden state forward like a relay baton.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Slow training</strong> — token 100 cannot be processed until tokens 1–99 finish. GPUs sit idle.</li>
          <li><strong className="text-white">Forgetful on long text</strong> — linking "was" to "cat" across 20 words is hard when information passes through many sequential steps.</li>
          <li><strong className="text-white">Attention as a patch</strong> — earlier models added attention on top of RNNs so the decoder could "look back" at relevant encoder states. This paper asked: what if attention <em>is</em> the whole model?</li>
        </ul>
      </LessonSection>

      <LessonSection title="The core idea — self-attention in plain English">
        <p>
          For every token in a sentence, self-attention asks: <em>"Which other tokens in this sentence should I
          pay attention to when understanding this one?"</em>
        </p>
        <ContentStep number={1} title="Query, Key, Value — a library analogy">
          <ul className="list-disc space-y-2 pl-5 text-slate-300">
            <li><strong className="text-white">Query</strong> — your question: "I am the word <code className="font-mono text-sm">sat</code> — what is relevant to me?"</li>
            <li><strong className="text-white">Key</strong> — each other token advertises what it offers: "<code className="font-mono text-sm">cat</code> is a subject", "<code className="font-mono text-sm">on</code> is a preposition".</li>
            <li><strong className="text-white">Value</strong> — the actual content each token contributes if selected.</li>
          </ul>
          <p className="mt-3">
            The model computes a relevance score between every Query–Key pair, converts those scores to
            probabilities (via softmax — same idea as next-token probabilities), and takes a weighted average of
            Values. High-attention tokens contribute more.
          </p>
          <Callout variant="insight">
            In <em>How Language Models Work</em>, the model outputs probabilities over the <em>vocabulary</em>.
            Inside attention, it outputs probabilities over <em>positions in the input</em>. Same maths, different
            target.
          </Callout>
        </ContentStep>

        <ContentStep number={2} title="Multi-head attention">
          <p>
            Instead of one attention pass, the model runs <strong className="text-white">8 heads in parallel</strong>{' '}
            (in the original paper), each learning different relationship types. One head might link verbs to
            subjects; another might track pronoun references across long distances. Their outputs are concatenated
            and projected back.
          </p>
        </ContentStep>

        <ContentStep number={3} title="Positional encoding">
          <p>
            Attention processes all tokens simultaneously — it has no built-in sense of order. The paper adds
            positional encodings (sinusoidal patterns) to each token embedding so the model knows "this token
            came first, that one came third."
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Full architecture — what the paper actually built">
        <Flowchart
          title="Original Transformer (encoder-decoder)"
          chart={`flowchart TB
  A[Input sentence] --> B[Token embeddings + positional encoding]
  B --> C[Encoder stack × 6 layers]
  C --> D[Each layer: Multi-head attention → Feed-forward → Residual + LayerNorm]
  D --> E[Encoder output]
  F[Output sentence so far] --> G[Decoder stack × 6 layers]
  E --> G
  G --> H[Each layer: Masked self-attention → Cross-attention to encoder → Feed-forward]
  H --> I[Linear layer → softmax over vocabulary]
  I --> J[Next token prediction]`}
        />

        <div className="mt-4 space-y-3 text-slate-300">
          <p><strong className="text-white">Encoder (6 identical layers)</strong> — reads the full input sentence and builds rich representations. Each layer has self-attention + a feed-forward network (two linear layers with ReLU).</p>
          <p><strong className="text-white">Decoder (6 identical layers)</strong> — generates output one token at a time. Uses masked self-attention (each position can only see earlier positions, not future ones) plus cross-attention to the encoder output.</p>
          <p><strong className="text-white">Residual connections + Layer Normalisation</strong> — after each sub-layer, the input is added back to the output (skip connection) and normalised. This stabilises training of deep stacks.</p>
          <p><strong className="text-white">Final linear layer</strong> — projects decoder output to vocabulary size, then softmax gives next-token probabilities — exactly the mechanism you learned in Fundamentals.</p>
        </div>

        <Callout variant="info">
          <strong className="text-white">Modern LLMs use only the decoder.</strong> GPT, Llama, and Claude are
          decoder-only Transformers — they dropped the encoder entirely. BERT uses only the encoder. The attention
          mechanism itself is unchanged.
        </Callout>
      </LessonSection>

      <LessonSection title="How the paper tested it">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Task</strong> — machine translation (English↔German, English↔French) on standard benchmarks.</li>
          <li><strong className="text-white">Training data</strong> — millions of sentence pairs from WMT translation datasets.</li>
          <li><strong className="text-white">Model size</strong> — base model used 512-dimensional embeddings, 8 attention heads, 6 layers, ~65M parameters (tiny by today's standards).</li>
          <li><strong className="text-white">Hardware</strong> — trained on 8 NVIDIA P100 GPUs for 3.5 days (base model).</li>
        </ul>
      </LessonSection>

      <LessonSection title="Key results">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Set new state-of-the-art on English→German and English→French translation (BLEU score 28.4 on WMT 2014 En→De).</li>
          <li>Base model trained in a fraction of the time and cost of the best RNN-based systems.</li>
          <li>Large variant (6 layers, 1024 dims, 16 heads, ~213M params) trained in 3.5 days on 8 GPUs — previously such quality required weeks on many more chips.</li>
          <li>Attention weights are interpretable — you can visualise which input words the model focuses on when producing each output word.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Limitations and what came after">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Quadratic cost</strong> — attention compares every token to every other token. A 100k-token document means 100k² comparisons. Later papers (FlashAttention, sparse attention) address this.</li>
          <li><strong className="text-white">Fixed context in original</strong> — trained on sentences, not books. Modern models extend context to 128k–1M tokens.</li>
          <li><strong className="text-white">No pre-training at scale</strong> — this paper trained from scratch on translation data. GPT-2/3 later showed pre-training on general web text first, then fine-tuning, works far better.</li>
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
                ['How Language Models Work', 'Final decoder layer produces the next-token probability distribution'],
                ['What Are Model Parameters?', 'Attention weight matrices (Q, K, V projections) are where billions of parameters live'],
                ['LLMs / SLMs / Multimodal', 'All are stacks of Transformer layers built on this design'],
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
          'Replaced slow, sequential RNNs with parallel self-attention over all tokens.',
          'Each token asks every other token "how relevant are you?" via Query-Key-Value attention.',
          'Encoder-decoder for translation; modern LLMs keep only the decoder half.',
          'Made GPU-parallel training practical — the direct ancestor of every model in this course.',
        ]}
      />
    </LessonArticle>
  )
}
